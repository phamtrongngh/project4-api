const FoodCategory = require('../models/foodCategory.model');

module.exports.getFoodCategorys = async (req, res) => {
    var foodCategory = await FoodCategory.find();
    res.json(foodCategory);
}

module.exports.createFoodCategory = async (req, res) => {
    const foodCategory = new FoodCategory(req.body)
    await foodCategory.save((err, result) => {
        if (err) return res.json({ err });
        res.json({ foodCategory: result });
    })
}

module.exports.getFoodCategory = async (req, res) => {
    let foodCategory = await FoodCategory.findById({ _id: req.params.id }, (err, foodCategory) => {
        if (err) res.json(res);
        if (!foodCategory) { return res.json('Cant Find') }
        else {
            res.json(foodCategory);
        }
    });
}

module.exports.updateFoodCategory = async (req, res) => {
    FoodCategory.findById(req.body._id, (err, foodCategory) => {
        if (err) res.json(err)
        if (!foodCategory) {
            return res.json('Cant Find');
        }
        else {
            foodCategory.set(req.body);
            foodCategory.updateOne((error, result) => {
                if (error) res.json(error)
                res.json(result)
            });
        }
    });
}

module.exports.deleteFoodCategory = async (req, res) => {
    let result = await FoodCategory.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}
