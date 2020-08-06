const FoodCategory = require("../models/foodCategory.model");

module.exports.getFoodCategorys = async (req, res) => {
  var foodCategory = await FoodCategory.find();
  res.json(foodCategory);
};

module.exports.createFoodCategory = async (req, res) => {
    req.body = JSON.parse(req.body.foodCategory);
    const foodCategory = new FoodCategory(req.body);
    let image = req.file;
            if (!image) {
                foodCategory.image = "product-default-image.jpg";
            } else {
                foodCategory.image = image.path.split("\\")[2];
            }
    await foodCategory.save((err, result) => {
        if (err) return res.json({ err });
        res.json({ foodCategory: result });
    });
};

module.exports.getFoodCategory = async (req, res) => {
    await FoodCategory.findById({ _id: req.params.id }, (err, foodCategory) => {
        if (err) res.json(res);
        if (!foodCategory) { return res.json('Cant Find') }
        else {
            res.json(foodCategory);
        }
    });
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
    req.body = JSON.parse(req.body.foodCategory);
    let footCategory = await FoodCategory.findOne({ _id: req.body._id });
    let image = req.file;
    if (!image) {
        //Nothing
    } else {
      footCategory.image = image.path.split("\\")[2];
    }
    footCategory.name = req.body.name;
    await footCategory.updateOne(footCategory);
    return res.json(footCategory);
};

module.exports.deleteFoodCategory = async (req, res) => {
    let result = await FoodCategory.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}
