const Restaurant = require('../models/restaurant.model');

module.exports.getRestaurants = async (req, res) => {
    var ref = ['managers', 'newfeeds', 'menus', 'followers'];
    var restaurant = await Restaurant.find().populate(ref);
    res.json(restaurant);
}

module.exports.createRestaurant = async (req, res) => {
    const restaurant = new Restaurant(req.body)
    await restaurant.save((err, result) => {
        if (err) return res.json({ err });
        res.json({ restaurant: result });
    })
}



module.exports.getRestaurant = async (req, res) => {
    let restaurant = await Restaurant.findById({_id: req.params.id}, (err, restaurant) => {
        if (err) return res.json(err);
        if (!restaurant) { return res.json('Cant Find')}
        else {
            res.json(restaurant);
        }
    });
}


module.exports.updateRestaurant= async (req, res) => {
    Restaurant.findById(req.body._id, (err, restaurant) => {
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


module.exports.deleteRestaurant = async (req, res) => {
    let result = await Restaurant.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}