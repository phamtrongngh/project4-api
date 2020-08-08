const Shipper = require('../models/shipper.model');
const Order = require("../models/order.model");
const bcrypt = require("bcrypt");
module.exports.getShippers = async (req, res) => {
    var shipper = await Shipper.find();
    res.json(shipper);
}

module.exports.createShipper = async (req, res) => {
    req.body = JSON.parse(req.body.shipper);
    Shipper.findOne({ phone: req.body.phone }, (err, shipper) => {
        if (shipper == null) { 
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) return res.json(err);
                const shipper = new Shipper(req.body);
                let avatar = req.file;
                if (!avatar) {
                    shipper.avatar = "product-default-image.jpg";
                } else shipper.avatar = avatar.path.split("\\")[2]; 
                shipper.password = hash;
                shipper.save((err, result) => {
                    if (err) return res.json({ err });
                    res.json({ shipper: result });
                })
            })
        } else {
            res.json({ err: "Phone has been used" });
        }
    })
}

module.exports.getShipper = async (req, res) => {
    let shipper = await Shipper.findById({ _id: req.params.id }, (err, shipper) => {
        if (err) res.json(res);
        if (!shipper) { return res.json('Cant Find') }
        else {
            res.json(shipper);
        }
    });
}
module.exports.getMyOrders = async (req, res) => {
    let orders = await Order.find({ shipper: req.shipper._id })
        .populate("coupon user restaurant")
        .populate("products.product");
    return res.json(orders);
}
module.exports.getMyCompleteOrders = async (req, res) => {
    var order = await Shipper.findOne({ _id: req.shipper._id })
        .populate("orders");
    order.populate("orders.user orders.restaurant orders.coupon", (err, esres) => {
        return res.json(esres.orders.filter(x => x.status == "completed"));
    })
}
module.exports.getMyFailedOrders = async (req, res) => {
    var order = await Shipper.findOne({ _id: req.shipper._id })
        .populate("orders");
    order.populate("orders.user orders.restaurant orders.coupon", (err, esres) => {
        return res.json(esres.orders.filter(x => x.status == "canceled"));
    })
}
module.exports.getMyShipper = async (req, res) => {
    await Shipper.findOne(req.shipper._id, (err, shipper) => {
        if (err) return res.json(err);
        return res.json(shipper);
    })
}

module.exports.updateShipper = async (req, res) => {
    req.body = JSON.parse(req.body.coupon);
    let shipper = await Shipper.findOne({ _id: req.body._id });
    let avatar = req.file;
    if (!avatar) {} 
    else {
        shipper.avatar = avatar.path.split("\\")[2];
    }
    shipper.fullname = req.body.name;
    shipper.phone = req.body.description;
    shipper.password = req.body.discount;
    shipper.dob = req.body.max;
    shipper.idCard = req.body.min;
    shipper.gender = req.body.exp;
    await shipper.updateOne(shipper);
    return res.json(shipper);
}

module.exports.changeActiveShipper = async (req, res) => {
    let shipper = await Shipper.findOne({ _id: req.params.id });
    if (shipper.active == true){
        shipper.active = false;
        await shipper.updateOne(shipper);
    }
    else {
        shipper.active = true;
        await shipper.updateOne(shipper);
    }
    console.log(shipper)
    return res.json(shipper);
}

module.exports.deleteShipper = async (req, res) => {
    let result = await Shipper.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}

module.exports.acceptOrder = async (req, res) => {
    let idOrder = req.params.id;
    const ACCEPTED_ORDER = "1";
    const UNCOMPLETE_ORDER = "2";
    await Order.findOne({ _id: idOrder }, async (err, order) => {
        if (!req.shipper.currentOrder) {
            if (order.shipper) {
                await order.populate("user restaurant coupon", (err, doc) => {
                    let obj = {
                        ...doc
                    }
                    obj.message = ACCEPTED_ORDER;
                    return res.json(obj);
                });
            } else {
                order.shipper = req.shipper._id;
                order.status = "receiving";
                await order.updateOne(order, async (err, raw) => {
                    req.shipper.orders.push(idOrder);
                    req.shipper.currentOrder = idOrder;
                    await req.shipper.updateOne(req.shipper);
                    var io = req.app.locals.io;
                    io.sockets.in(order.user).emit("acceptOrder", { latLng: [req.body.latitude, req.body.longitude], shipper: req.shipper })
                    await order.populate("user restaurant coupon", (err, doc) => {
                        io.sockets.emit("removeOrder", doc);
                        return res.json(doc);
                    });
                });
            }
        } else {
            await order.populate("user restaurant coupon", (err, doc) => {
                let obj = {
                    ...doc
                }
                obj.message = UNCOMPLETE_ORDER;
                return res.json(obj);
            });
        }
    })

}

module.exports.deliveringOrder = async (req, res) => {
    var io = req.app.locals.io;
    let idOrder = req.shipper.currentOrder;
    await Order.findOne({ _id: idOrder }, async (err, order) => {
        if (order.shipper.toString() == req.shipper._id) {
            order.status = "delivering";
            await order.updateOne(order, async (err, raw) => {
                order.populate("user restaurant coupon", (err, result) => {
                    io.sockets.in(result.user._id).emit("deliveringOrder", result);
                    return res.json(result);
                })
            })
        } else {
            return res.json("Youv do not hae permission!");
        };
    })
}
module.exports.sendMyLocation = async (req, res) => {
    let latLng = req.body;
    var io = req.app.locals.io;
    await req.shipper.populate("currentOrder", (err, result) => {
        io.sockets.in(result.currentOrder.user).emit("shipperLocation", latLng);
    })
    return res.json("Successfully");
}
module.exports.completeOrder = async (req, res) => {
    let idOrder = req.shipper.currentOrder;
    var io = req.app.locals.io;
    await Order.findOne({ _id: idOrder }, async (err, order) => {
        if (order.shipper.toString() == req.shipper._id) {
            order.status = "completed";
            await order.updateOne(order, async (err, raw) => {
                req.shipper.currentOrder = null;
                await req.shipper.updateOne(req.shipper);
                order.populate("user restaurant coupon", (err, result) => {
                    io.sockets.in(result.user._id).emit("completedOrder", result);
                    return res.json(result);
                })
            });

        } else {
            return res.json("You do not have permission!");
        };
    })
}

module.exports.cancelOrder = async (req, res) => {
    let idOrder = req.shipper.currentOrder;
    var io = req.app.locals.io;
    await Order.findOne({ _id: idOrder }, async (err, order) => {
        if (order.shipper.toString() == req.shipper._id) {
            order.status = "canceled";
            order.canceledBy = "shipper";
            await order.updateOne(order, async (err, raw) => {
                req.shipper.currentOrder = null;
                await req.shipper.updateOne(req.shipper);
                order.populate("user restaurant coupon", (err, result) => {
                    io.sockets.in(result.user._id).emit("cancelOrder", result);
                    return res.json(result);
                })
            });
        } else {
            return res.json("You do not have permission!");
        };
    })
}