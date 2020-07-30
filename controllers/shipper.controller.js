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
            return res.json(order);
        } else {
            order.shipper = req.shipper._id;
            order.status = "receiving";
            await order.updateOne(order, async (err, raw) => {
                req.shipper.orders.push(idOrder);
                await req.shipper.updateOne(req.shipper);
                console.log(order.shipper);
                return res.json(order);
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