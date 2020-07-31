const Shipper = require('../models/shipper.model');
const Order = require("../models/order.model");
const Restaurant = require("../models/restaurant.model");
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
    let order = await Order.find({ shipper: req.shipper._id }).populate("user", "fullname phone avatar").populate("products.product");
    await Restaurant.findById(order[0].products[0].product.restaurant, "name address avatar", async (err, doc) => {
        order[0].restaurant = await doc;
    })
    return res.json(order);
}
module.exports.getMyCompleteOrders = async (req, res) => {
    let order = await Order.find({ shipper: req.shipper._id }).populate("user", "fullname phone avatar").populate("products.product");
    await Restaurant.findById(order[0].products[0].product.restaurant, "name address avatar", async (err, doc) => {
        order = order.filter(x => x.status == "completed");
        order[0].restaurant = await doc;
    })
    return res.json(order);
}
module.exports.getMyFailedOrders = async (req, res) => {
    let order = await Order.find({ shipper: req.shipper._id }).populate("user", "fullname phone avatar").populate("products.product");
    await Restaurant.findById(order[0].products[0].product.restaurant, "name address avatar", async (err, doc) => {
        order = order.filter(x => x.status == "failed");
        order[0].restaurant = await doc;
    })
    return res.json(order);
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
    await Order.findOne({ _id: idOrder }, async (err, order) => {

        if (order.shipper) {
            return res.json({ message: "Đã có shipper khác nhận đơn hàng này" });
        } else {
            order.shipper = req.shipper._id;
            order.status = "receiving";
            await order.updateOne(order, async (err, raw) => {
                req.shipper.orders.push(idOrder);
                await req.shipper.updateOne(req.shipper);
                await order.populate("user", (err, doc) => {
                    return res.json(doc);
                });
            });
        }
    })
}

module.exports.deliveringOrder = async (req, res) => {
    let idOrder = req.params.id;
    await Order.findOne({ _id: idOrder }, async (err, order) => {
        if (order.shipper.toString() == req.shipper._id) {
            order.status = "delivering";
            await order.updateOne(order, async (err, raw) => {
                return res.json("Bạn đã nhận hàng.");
            })
        } else {
            return res.json("You do not have permission!");
        };
    })
}

module.exports.completeOrder = async (req, res) => {
    let idOrder = req.params.id;
    await Order.findOne({ _id: idOrder }, async (err, order) => {
        if (order.shipper.toString() == req.shipper._id) {
            order.status = "completed";
            await order.updateOne(order, async (err, raw) => {
                return res.json("Bạn đã hoàn thành đơn hàng.");
            })
        } else {
            return res.json("You do not have permission!");
        };
    })
}

module.exports.cancelOrder = async (req, res) => {
    let idOrder = req.params.id;
    await Order.findOne({ _id: idOrder }, async (err, order) => {
        if (order.shipper.toString() == req.shipper._id) {
            order.status = "canceled";
            await order.updateOne(order, async (err, raw) => {
                return res.json("Bạn đã hủy đơn hàng.");
            });
        } else {
            return res.json("You do not have permission!");
        };
    })
}