let Report = require("../models/report.model");
let User = require("../models/user.model");
let Product = require("../models/product.model")
let Newfeed = require("../models/newfeed.model");
let Restaurant = require("../models/restaurant.model");

module.exports.getReports = async (req, res) => {
    var reports = await Report.find();
    return res.json(reports);
}

module.exports.getReport = async (req, res) => {
    await Report.findOne({ _id: req.params.id }, async (err, report) => {
        if (err) res.json(res);
        if (!report) { return res.json('Cant Find') }
        else {
            if (report.typed === 'user') {
                await report.populate("user", async (err, result) => {
                    return res.json({ result });
                })
            }
            else if (report.typed === 'newfeed') {
                await report.populate("newfeed", async (err, result) => {
                    return res.json({ result });
                })
            }
            else {
                await report.populate("restaurant", async (err, result) => {
                    return res.json({ result });
                })
            }
        }
    });
}

module.exports.createReport = async (req, res) => {
    let report = new Report(req.body);
    if (req.body.typed == "user") {
        report.sender = req.user._id;
        report.user = req.body.id;
        report.typed = req.body.typed;
        await report.save((err, result) => {
            if (err) return res.json({ err });
            return res.json({ report: result });
        });
    }
    else if (req.body.typed == "newfeed") {
        report.sender = req.user._id;
        report.newfeed = req.body.id;
        report.typed = req.body.typed;
        await report.save((err, result) => {
            if (err) return res.json({ err });
            return res.json({ report: result });
        });
    }
    else {
        report.sender = req.user._id;
        report.restaurant = req.body.id;
        report.typed = req.body.typed;
        await report.save((err, result) => {
            if (err) return res.json({ err });
            return res.json({ report: result });
        });
    }
}

module.exports.updateReport = async (req, res) => {
    let report = await Report.findOne({ _id: req.body._id })
    report.content = req.body.content;
    report.response = req.body.response;
    await report.updateOne(report);
    return res.json(report)
}

module.exports.deleteReport = async (req, res) => {
    let result = await Report.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}   