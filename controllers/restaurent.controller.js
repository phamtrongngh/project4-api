const Restaurent = require('../models/restaurant.model');
const { request } = require('express');


module.exports.getRestaurents = async (req, res) => {
    var restaurent = await Restaurent.find();
    res.json(restaurent);
}

module.exports.createRestaurent = async (req, res) => {
    try {
        const restaurent = new Restaurent(req.body)
        await restaurent.save((err, result) => {
            if (err) return res.json({ err });
            res.json({ restaurent: result });
        })
    }
    catch (error) {
        res.status(500).send(error)
    }
}

module.exports.getRestaurent = async (req, res) => {
    let restaurent = await Restaurent.findById({_id: req.params.id}, (err, restaurant) => {
        if (err) return res.json(err);
        if (!restaurant) { return res.json('Cant Find')}
        else {
            res.json(restaurant);
        }
    });
}

module.exports.updateRestaurent= async (req, res) => {
    Restaurent.findById(req.body._id, (err, restaurant) => {
        if (err) return res.json(err)
        if (!restaurant) {
            return res.json('Cant Find');
        }
        else {
            restaurant.set(req.body);
            restaurant.save((error, result) => {
                if (error) res.json(error)
                res.json({ rst: result })
            });
        }
    });
}

module.exports.deleteRestaurent = async (req, res) => {
    let result = await Restaurent.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}