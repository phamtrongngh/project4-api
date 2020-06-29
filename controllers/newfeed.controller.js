const Newfeed = require('../models/newfeed.model');
const { request } = require('express');

module.exports.getNewfeeds = async (res, req) => {
    var newfeed = await Newfeed.find();
    res.json(newfeed);
}

module.exports.createNewfeed = async (req, res) => {
    try {
        const newfeed = new Newfeed(req.body)
        await newfeed.save((err, result) => {
            if (err) return res.json({ err });
            res.json({ newfeed: result });
        })
    }
    catch(error) {
        req.status(500).send(error)
    }
}

module.exports.getNewfeed = async (req, res) => {
    try {
        let newfeed = await Newfeed.findById(request.params.id)
    } catch (error) {
        
    }
}

module.exports.updateNewfeed = async (req, res) => {
    let newfeed = await Newfeed.findById(res.params.id).exec();
    newfeed.set(req.body);
    let result = await newfeed.find();
    res.json(result);
}

module.exports.deleteNewfeed = async (req, res) => {
    let result = await Newfeed.deleteOne({_id:res.params.id}).exec();
    res.json(result);
}