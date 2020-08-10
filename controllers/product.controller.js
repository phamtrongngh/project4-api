const Product = require("../models/product.model");
const Restaurant = require("../models/restaurant.model");
const FoodCategory = require("../models/foodCategory.model");
module.exports.getProducts = async (req, res) => {
  var product = await Product.find()
    .lean()
    .populate(["restaurant", "category"]);
  res.json(product);
};

module.exports.createProduct = async (req, res) => {
  req.body = JSON.parse(req.body.product);
  if (req.user.restaurants.find((x) => x == req.body.restaurant)) {
    let product = new Product(req.body);
    let category = req.body.categories.trim().split(",");
    let test = category.map((x) => {
      return x.trim();
    });
    let categoryyyy = test.slice(0, test.length - 1);
    await FoodCategory.find(
      {
        name: {
          $in: categoryyyy,
        },
      },
      async (err, category) => {
        await product.category.push(...category.map((x) => x._id.toString()));
      }
    );
    let image = req.file;
    if (!image) {
      product.image = "product-default-image.jpg";
    } else {
      product.image = image.path.split("\\")[2];
    }
    await product.save((err, result) => {
      if (err) return res.json(err);
      Restaurant.findOne(
        { _id: result.restaurant },
        async (err, restaurant) => {
          if (err) return res.json(err);
          restaurant.menus.push(result._id);
          await restaurant.updateOne(restaurant);
          return res.json(product);
        }
      );
    });
  }
};

module.exports.getProduct = async (req, res) => {
  await Product.findById({ _id: req.params.id }, (err, product) => {
    if (err) res.json(res);
    if (!product) {
      return res.json("Cant Find");
    } else {
      product.populate("category", (err, pro) => {
        return res.json(product);
      });
    }
  });
};

module.exports.updateProduct = async (req, res) => {
  req.body = JSON.parse(req.body.product);
  let product = await Product.findOne({ _id: req.body._id });
  let image = req.file;
  if (!image) {
    //Nothing
  } else {
    product.image = image.path.split("\\")[2];
  }
  let category = req.body.categories.trim().split(",");
  let test = category.map((x) => {
    return x.trim();
  });
  let categoryyyy = test.slice(0, test.length - 1);
  await FoodCategory.find(
    {
      name: {
        $in: categoryyyy,
      },
    },
    async (err, category) => {
      await product.category.push(...category.map((x) => x._id.toString()));
    }
  );
  product.name = req.body.name;
  product.price = req.body.price;
  product.saleoff = req.body.saleoff;
  await product.updateOne(product);
  return res.json(product);
};

module.exports.deleteProduct = async (req, res) => {
  let result = await Product.deleteOne({ _id: req.params.id }).exec();
  res.json(result);
};
