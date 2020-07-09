const Shipper = require('../models/shipper.model');

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
    let shipper = await Shipper.findById({_id: req.params.id}, (err, shipper) => {
        if (err) res.json(res);
        if (!shipper) { return res.json('Cant Find')}
        else {
            res.json(shipper);
        }
    });
}

module.exports.updateShipper = async (req, res) => {
    Shipper.findById(req.body._id, (err, shipper) => {
        if (err) res.json(err)
        if (!shipper) {
            return res.json('Cant Find');
        }
        else {
            shipper.set(req.body);
            shipper.save((error, result) => {
                if (error) res.json(error)
                res.json({ sp: result })
            });
        }
    });
}

module.exports.deleteShipper = async (req, res) => {
    let result = await Shipper.deleteOne({_id: req.params.id}).exec();
    res.json(result);
}
