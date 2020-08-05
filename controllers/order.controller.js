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
            })
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

module.exports.cancelOrder = async (req, res) => {
    let idOrder = req.params.id;
    var io = req.app.locals.io;
    await Order.findOne({ _id: idOrder }, async (err, order) => {
        if (order.user.toString() == req.user._id) {
            order.status = "canceled";
            order.canceledBy = "user";
            await order.updateOne(order, async (err, raw) => {
                await order.populate("user restaurant coupon", async (err, result) => {
                    await Shipper.findOne({ _id: order.shipper }, async (err, shi) => {
                        shi.currentOrder = null;
                        await shi.updateOne(shi);
                    })
                    io.sockets.in(order.shipper).emit("cancelOrder", result);
                    return res.json(result);
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
