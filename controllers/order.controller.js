const Order = require('../models/order.model');
const User = require("../models/user.model");
module.exports.getOrders = async (req, res) => {
    var order = await Order.find();
    res.json(order);
}

module.exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        order.user = req.user._id;
        order.status = "finding";
        await order.save( async (err, result) => {
            if (err) return res.json({ err });
            req.user.orders.push(result._id);
            await req.user.updateOne(req.user);
            res.json({ order: result });
        })
    }
    catch (error) {
        res.status(500).send(error)
    }
}

module.exports.getOrder = async (req, res) => {
    let order = await Order.findById({_id: req.params.id}, (err, order) => {
        if (err) res.json(res);
        if (!order) { return res.json('Cant Find')}
        else {
            res.json(order);
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
                res.json({result})
            });
        }
    });
}

module.exports.deleteOrder = async (req, res) => {
    let result = await Order.deleteOne({_id: req.params.id}).exec();
    res.json(result);
}
