const Newfeed = require('../models/newfeed.model');
const Product = require("../models/product.model");
const Restaurant = require("../models/restaurant.model");

module.exports.getNewfeeds = async (req, res) => {
    // await Newfeed.find((err,arr)=>{
    //     return res.json(arr)
    // })
    res.json(await Newfeed.find().populate("restaurant"));
}

module.exports.createNewfeed = async (req, res) => {
    const newfeed = new Newfeed(req.body);
    newfeed.images.push(req.file.path);
    await newfeed.save((err, result) => {
        if (err) { return res.json(err); }
        else {
            res.json({ newfeed: result });
        }
    })
}
module.exports.createFoodNewfeed = async (req, res) => {
    let newfeed = new Newfeed(req.body);
    let product = await Product.findOne({ _id: req.body.product });
    newfeed.images.push(product.image);
    newfeed.save(async (err, document) => {
        if (err) return res.json(err);
        let restaurant = await Restaurant.findOne({_id:req.body.restaurant});
        restaurant.newfeeds.push(document._id);
        await restaurant.updateOne(restaurant);
        return res.json(document);
    })
}
module.exports.getNewfeed = async (req, res) => {
    let newfeed = await Newfeed.findById({ _id: req.params.id }, (err, newfeed) => {
        if (err) res.json(res);
        if (!newfeed) { return res.json('Cant Find') }
        else {
            res.json(newfeed);
        }
    });
}

module.exports.updateNewfeed = async (req, res) => {
    Newfeed.findById(req.body._id, (err, newfeed) => {
        if (err) res.json(err)
        if (!newfeed) {
            return res.json('Cant Find');
        }
        else {
            newfeed.set(req.body);
            newfeed.updateOne((error, result) => {
                if (error) res.json(error)
                res.json(result)
            });
        }
    });
}

module.exports.deleteNewfeed = async (req, res) => {
    let result = await Newfeed.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}