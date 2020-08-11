const Newfeed = require("../models/newfeed.model");
const Product = require("../models/product.model");
const Restaurant = require("../models/restaurant.model");
const User = require("../models/user.model");
module.exports.getNewfeeds = async (req, res) => {
  await Newfeed.find()
    .populate({
      path: "comments restaurant user",
      populate: {
        path: "user reply",
        select: "fullname _id avatar content user",
        populate: {
          path: "user",
          select: "fullname _id avatar",
        },
      },
    })
    .exec(function (err, docs) {
      return res.json(docs.sort(() => Math.random() - 0.5));
    });
};
module.exports.getListLike = async (req, res) => {
  var newfeed = req.params.id;
  Newfeed.findOne({ _id: newfeed }, "likes", async (err, newfeed) => {
    await newfeed.populate("likes", "fullname _id avatar", (err, listLike) => {
      return res.json(listLike.likes);
    });
  });
};
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
    });
    if (result.restaurant) {
      await Restaurant.findOne(
        { _id: result.restaurant },
        async (err, restaurant) => {
          restaurant.newfeeds.push(result._id);
          await restaurant.updateOne(restaurant);
        }
      );
    }
    return res.json(result);
  });
};
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
  });
};
module.exports.getNewfeed = async (req, res) => {
  let newfeed = await Newfeed.findById(
    { _id: req.params.id },
    (err, newfeed) => {
      if (err) res.json(res);
      if (!newfeed) {
        return res.json("Cant Find");
      } else {
        newfeed.populate("restaurant user comments", (err, newfeed) => {
          newfeed.populate("comments.user comments.reply", (err, newfeed) => {
            newfeed.populate("comments.reply.user", (err, newfeed) => {
              return res.json(newfeed);
            });
          });
        });
      }
    }
  );
};
module.exports.getMyNewfeeds = async (req, res) => {
  await Newfeed.find({ user: req.user._id })
    .populate({
      path: "comments restaurant user",
      populate: {
        path: "user reply",
        select: "fullname _id avatar content user",
        populate: {
          path: "user",
          select: "fullname _id avatar",
        },
      },
    })
    .exec(function (err, docs) {
      return res.json(docs);
    });
};
module.exports.updateNewfeed = async (req, res) => {
  req.body = JSON.parse(req.body.newfeed);
  let newfeed = await Newfeed.findOne(
    { _id: req.body._id },
    async (err, newfeed) => {
      let image = req.file;
      if (!image) {
      } else {
        newfeed.images[0] = image.path.split("\\")[2];
      }
      newfeed.content = req.body.content;
      await newfeed.updateOne(newfeed);
      return res.json(newfeed);
    }
  );
};
module.exports.changeActiveNewfeed = async (req, res) => {
  let newfeed = await Newfeed.findOne({ _id: req.params.id });
  if (newfeed.active == true) {
    newfeed.active = false;
    await newfeed.updateOne(newfeed);
  } else {
    newfeed.active = true;
    await newfeed.updateOne(newfeed);
  }
  return res.json(newfeed);
};

module.exports.deleteNewfeed = async (req, res) => {
  let result = await Newfeed.deleteOne({ _id: req.params.id }).exec();
  res.json(result);
};
