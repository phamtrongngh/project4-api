const Newfeed = require('../models/newfeed.model');
const Product = require("../models/product.model");
const Restaurant = require("../models/restaurant.model");
const User = require("../models/user.model");
module.exports.getNewfeeds = async (req, res) => {
    await Newfeed.find()
    .populate({ 
       path: 'comments restaurant user',
       populate: {
         path: 'user reply',         
         select:"fullname _id avatar content user",
         populate:{
            path:"user"   ,
            select:"fullname _id avatar" 
        }
       }
    }).exec(function(err, docs) {
        
        return res.json(docs)
    });
}

module.exports.createNewfeed = async (req, res) => {
    req.body = JSON.parse(req.body.newfeed);
    const newfeed = new Newfeed(req.body);
    let image = req.file;
    if (image) {
        newfeed.images.push(image.path.split("\\")[2]);
    }
    await newfeed.save(async (err, result) => {
        if (err) return res.json(err);
        await User.findOne({ _id: result.user }, async (err, user) => {
            user.newfeeds.push(result._id);
            await user.updateOne(user);
        })
        if (result.restaurant) {
            await Restaurant.findOne({ _id: result.restaurant }, async (err, restaurant) => {
                restaurant.newfeeds.push(result._id);
                await restaurant.updateOne(restaurant);
            })
        }
        return res.json(result);
    })
}
module.exports.createFoodNewfeed = async (req, res) => {
    let newfeed = new Newfeed(req.body);
    let product = await Product.findOne({ _id: req.body.product });
    newfeed.images.push(product.image);
    newfeed.save(async (err, document) => {
        if (err) return res.json(err);
        let restaurant = await Restaurant.findOne({ _id: req.body.restaurant });
        restaurant.newfeeds.push(document._id);
        await restaurant.updateOne(restaurant);
        req.user.newfeeds.push(document._id);
        await req.user.updateOne(req.user);
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
module.exports.getMyNewfeeds = async (req, res) => {
    await req.user.populate("newfeeds", async (err, result) => {
        return await res.json(result);
    })
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