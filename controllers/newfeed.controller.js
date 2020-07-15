const Newfeed = require('../models/newfeed.model');

module.exports.getNewfeeds = async (req, res) => {
    var newfeed = await Newfeed.find();
    res.json(newfeed);
}

module.exports.createNewfeed = async (req, res) => {
    try {
        const newfeed = new Newfeed(req.body)
        await newfeed.save((err, result) => {
            if (err) return res.json(err);
            res.json({ newfeed: result });
        })
    }
    catch (error) {
        res.status(500).send(error)
    }
}

module.exports.getNewfeed = async (req, res) => {
    let newfeed = await Newfeed.findById({_id: req.params.id}, (err, newfeed) => {
        if (err) res.json(res);
        if (!newfeed) { return res.json('Cant Find')}
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
            newfeed.save((error, result) => {
                if (error) res.json(error)
                res.json({ nf: result })
            });
        }
    });
}

module.exports.deleteNewfeed = async (req, res) => {
    let result = await Newfeed.deleteOne({_id: req.params.id}).exec();
    res.json(result);
}