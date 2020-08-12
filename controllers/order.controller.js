const Order = require('../models/order.model');
const Product = require("../models/product.model");
const Momo = require("../momo.util/momo");
const Restaurant = require("../models/restaurant.model");
const User = require("../models/user.model");
const Shipper = require("../models/shipper.model");
module.exports.getOrders = async (req, res) => {
    var order = await Order.find();
    return res.json(order);
}

module.exports.getFindingOrders = async (req, res) => {
    var order = await Order.find({ status: "finding" })
        .populate("user coupon")
        .populate("restaurant")
        .populate("products.product");
    return res.json(order);
}

module.exports.createOrder = async (req, res) => {
    if (!req.body.coupon) {
        req.body.coupon = undefined;
    }
    let order = new Order(req.body);
    order.user = req.user._id;
    order.amount *= 1000;
    order.fee *= 1000;
    if (order.discount) {
        order.discount *= 1000;
    } else {
        order.discount = undefined;
    }
    var io = req.app.locals.io;
    if (req.body.payment == "2") {
        order.status = "paying";
    } else {
        order.status = "finding";
    }
    await Product.find({
        "_id": {
            $in: req.body.products.map(x => x.product)
        }
    }, (err, listProduct) => {
        order.restaurant = listProduct[0].restaurant;
    })
    order.rated.restaurant = false;
    order.rated.shipper = false;
    await order.save(async (err, doc) => {
        if (err) {
            console.log(err);
            return res.json({ err })
        };
        await doc.populate("products.product", async (err, result) => {
            req.user.orders.push(result._id);
            await req.user.updateOne(req.user);
            await Restaurant.findOne({ _id: result.products[0].product.restaurant }, async (err, restaurant) => {
                restaurant.orders.push(result._id);
                await restaurant.updateOne(restaurant);
            });
            if (result.status == "paying") {
                Momo(result).then(value => {
                    return res.json(value);
                })
            } else {
                await result.populate("user", async (err, doc) => {
                    await doc.populate("restaurant coupon", (err, resultt) => {
                        io.sockets.emit("newOrder", resultt);
                        let noti = {
                            fromUser: resultt.user._id,
                            toRestaurant: resultt.restaurant._id,
                            content: "Nhà hàng bạn vừa có đơn hàng mới!",
                            date: new Date(Date.now()),
                            link: "/manageMyRestaurant/" + resultt.restaurant._id
                        };
                        resultt.restaurant.managers.forEach(async (manager) => {
                            io.sockets.in(manager.user).emit("newOrderRestaurant", resultt);
                            await User.findOne({ _id: manager.user }, async (err, user) => {
                                user.notifications.push(noti);
                                await user.updateOne(user)
                            })
                        });
                    })
                })
                return res.json("/status-order/" + doc._id);
            }
        });

    });
}
module.exports.rate = async (req, res) => {
    if (req.body.type == "shipper") {
        await Order.findOne({ _id: req.body.orderId }, async (err, order) => {
            order.rated.shipper = true;
            await order.updateOne(order);
        })
        await Shipper.findOne({ _id: req.body.targetId }, async (err, shipper) => {
            var data = {
                user: req.user._id,
                stars: parseInt(req.body.star),
                comment: req.body.content
            }
            shipper.rating.push(data);
            await shipper.updateOne(shipper);
        })
    } else {
        await Order.findOne({ _id: req.body.orderId }, async (err, order) => {
            order.rated.restaurant = true;
            await order.updateOne(order);
        })
        await Restaurant.findOne({ _id: req.body.targetId }, async (err, restaurant) => {
            var data = {
                user: req.user._id,
                stars: parseInt(req.body.star),
                comment: req.body.content
            }
            restaurant.rating.push(data);
            await restaurant.updateOne(restaurant);
        })
    }
    return res.json("");
}
module.exports.cancelOrder = async (req, res) => {
    let idOrder = req.params.id;
    var io = req.app.locals.io;
    let shipperId;
    await Order.findOne({ _id: idOrder }, async (err, order) => {
        shipperId = order.shipper;
        if (order.user.toString() == req.user._id) {
            order.status = "canceled";
            order.canceledBy = "user";
            await order.updateOne(order, async (err, raw) => {
                await order.populate("user restaurant coupon", async (err, result) => {
                    await Shipper.findOne({ _id: order.shipper }, async (err, shi) => {
                        shi.currentOrder = null;
                        await shi.updateOne(shi);
                    })
                    var disabled = false;
                    if (req.user.numberCancel < 2) {
                        req.user.numberCancel += 1;
                    } else {
                        req.user.active = false;
                        disabled = true;
                    }
                    await req.user.updateOne(req.user);
                    io.sockets.in(shipperId).emit("cancelOrder", result);

                    if (disabled) {
                        res.json("disabled")
                    } else {
                        res.json(result);
                    }
                })
            });
        } else {
            return res.json("You do not have permission!");
        };
    })
}

module.exports.paying = async (req, res) => {
    let orderId = req.params.id;
    var io = req.app.locals.io;
    await Order.findOne({ _id: orderId }, async (err, order) => {
        if (err) {
            return res.json("failed");
        }
        order.status = "finding";
        await order.updateOne(order);
        await order.populate("user", async (err, doc) => {
            await doc.populate("restaurant", (err, resultt) => {
                return res.json("success");
            })
        })
    })
}

module.exports.getOrder = async (req, res) => {
    await Order.findById({ _id: req.params.id }, async (err, order) => {
        if (err) res.json(res);
        if (!order) { return res.json('Cant Find') }
        else {
            await order.populate("products.product shipper user", async (err, result) => {
                await result.populate("products.product", async (err, resultTotal) => {
                    await resultTotal.populate("restaurant coupon", async (err, resulttt) => {
                        return res.json(resulttt);
                    })
                })
            })
        }
    });
}

module.exports.updateOrder = async (req, res) => {
    Order.findById(req.body._id, (err, order) => {
        if (err) res.json(err)
        if (!order) {
            return res.json('Cant Find');
        }
        else {
            order.set(req.body);
            order.updateOne((error, result) => {
                if (error) res.json(error)
                res.json({ result })
            });
        }
    });
}

module.exports.deleteOrder = async (req, res) => {
    let result = await Order.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}

module.exports.fakeOrder = async (req, res) => {
    // let products = ["5f23d740234d153c8401e7c9", "5f2539d9be3e4e202cee8116", "5f31551dcffec70d70c4767e"];
    // let users = await User.find({});
    // let restaurant = "5f1ffbc17f184615e8b041f5";
    // var orderPush = [];
    // users = users.map(x=>x._id);
    // for (var i = 0; i < 100; i++) {
    //     var date = new Date("8/1/2020");
    //     date.setDate(Math.floor(Math.random() * 30) + 1);
    //     let order = new Order({
    //         restaurant: restaurant,
    //         user: (users[Math.floor(Math.random() * users.length)]).toString(),
    //         products: [
    //             {
    //                 product: products[Math.floor(Math.random() * products.length)],
    //                 quantity: Math.floor(Math.random() * 10) + 1
    //             }
    //         ],
    //         createdAt: date,
    //         amount: (Math.floor(Math.random() * 16) + 5) * 10000
    //     });
    //     await order.save( async (err, ress) => {
    //         console.log("1")
    //         orderPush.push(ress._id);
    //     })
    // }
    // await Restaurant.findOne({ _id: restaurant }, async (err, restau) => {
    //     console.log("2")
    //     restau.orders.push(...orderPush);
    //     await restau.updateOne(restau);
    //     return res.json("Successfully");
    // })

    Restaurant.findOne({ _id: "5f1ffbc17f184615e8b041f5" }, (err, resss) => {
        if (err) return res.json(err)
        Order.find(async (err, oredesr) => {
            if (err) return res.json(err)
            let ressssa = oredesr.map(x => x._id);
            resss.orders.push(...ressssa);
            await resss.updateOne(resss);
            return res.json("")
        })
    })

}
