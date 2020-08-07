const Shipper = require('../models/shipper.model');
const Order = require("../models/order.model");
module.exports.getShippers = async (req, res) => {
    var shipper = await Shipper.find();
    res.json(shipper);
}

module.exports.createShipper = async (req, res) => {
    try {
        const shipper = new Shipper(req.body)
        await shipper.save((err, result) => {
            if (err) return res.json({ err });
            res.json({ shipper: result });
        })
    }
    catch (error) {
        res.status(500).send(error)
    }
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
    Shipper.findById(req.body._id, (err, shipper) => {
        if (err) res.json(err)
        if (!shipper) {
            return res.json('Cant Find');
        }
        else {
            shipper.set(req.body);
            shipper.updateOne((error, result) => {
                if (error) res.json(error)
                res.json(result)
            });
        }
    });
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