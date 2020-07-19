const Product = require('../models/product.model');

module.exports.getProducts = async (req, res) => {
    var product = await Product.find().lean().populate(["restaurant", "category"]);
    res.json(product);
}

module.exports.createProduct = async (req, res) => {
    let product = new Product(req.body);
    product.image = req.file.path.split("\\").splice(2).join("");
    await product.save((err, result) => {
        if (err) return res.json({ err });
        res.json({ product: result });
    })
}

module.exports.getProduct = async (req, res) => {
    await Product.findById({ _id: req.params.id }, (err, product) => {
        if (err) res.json(res);
        if (!product) { return res.json('Cant Find') }
        else {
            res.json(product);
        }
    });
}

module.exports.updateProduct = async (req, res) => {
    Product.findById(req.body._id, (err, product) => {
        if (err) res.json(err)
        if (!product) {
            return res.json('Cant Find');
        }
        else {
            product.set(req.body);
            product.updateOne((error, result) => {
                if (error) res.json(error)
                res.json({ result })
            });
        }
    });
}

module.exports.deleteProduct = async (req, res) => {
    let result = await Product.deleteOne({ _id: req.params.id }).exec();
    res.json(result);
}
