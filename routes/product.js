const path = require("path");
const fs = require("fs");

const multer = require('multer')
const sharp = require('sharp')
const { streamUpload, removeUploadedFile } = require('../config/cloudinary')

let router = require("express").Router();
let Product = require("../models/product");
let config = require("../config");

let upload = multer({})

let productImagePath = config.productImagePath;
let productImageDir = config.productImageDir;

router.get("/", async (req, res) => {
  // console.log(req.query);
  let query = Product.find({}).limit(50).sort("-name");
  if (req.query.category != "") {
    query.where({"category": req.query.category})
  };
  query.exec((err, products) => {
    if (err) {
      console.log(err);
      res.end(404);
    } else {
      // update image path
      products.forEach((item) => item.image = productImageDir + item.image);
      res.json(JSON.stringify(products));
    }
  });

  // if (req.query.category) { // specific categories
  //   Product.find({})
  //   .where({"category": req.query.category})
  //   .limit(50)
  //   .sort("-name")
  //   .exec((err, products) => {
  //     if (err) {
  //       console.log(err);
  //       res.end(404);
  //     } else {
  //       // update image path
  //       products.forEach((item) => item.image = productImageDir + item.image);
  //       res.json(JSON.stringify(products));
  //     }
  //   })
  // } else { // all categories
  //   Product.find({})
  //   .limit(50)
  //   .sort("-name")
  //   .exec((err, products) => {
  //     if (err) {
  //       console.log(err);
  //       res.end(404);
  //     } else {
  //       // update image path
  //       products.forEach((item) => item.image = productImageDir + item.image);
  //       res.json(JSON.stringify(products));
  //     }
  //   })
  //}
})

router.post("/new", upload.single('image'), async (req, res) => {
  let {name, price, category, tax, discount } = req.body;
  // let image = (req.files && req.files.image) ? req.files.image.name : undefined;
  let product = new Product();
  product.name = name;
  product.price = price;
  product.category = category;
  product.tax = tax;
  product.discount = discount;
  product.qty = req.body.qty
  // const fileName = 'product_' + name + '_' + new Date().getMilliseconds();
  // let imagePath = path.join(productImagePath, fileName);
  // if (image) {
  //   req.files.image.mv(imagePath, function(err) {
  //     if (err) { // if err update other properties except image
  //       product.save((err, doc) => res.redirect("/pages"));
  //     } else { // set product image
  //       product.image = fileName;
  //       product.save((err, doc) => res.redirect("/pages"));
  //     }
  //   })
  // }
  try {
    if (req.file) {
      let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
      const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/products")
      product.image = imageInfo.url
      product.image_public_id = imageInfo.public_id
    }
    await product.save()
    // if (req.files) {
    //   let file = req.files.photo
    //   let extname = path.extname(file.name)
    //   let filename = 'person_' + new Date().getMilliseconds() + extname
    //   await file.mv(process.cwd() + '/uploads/images/' + filename)
    //   dao.photo = filename
    //   await PersonService.create(dao)
    // } else {
    //   await PersonService.create(dao)
    // }
    req.flash('success_msg', 'Product added')
    res.redirect('/pages/products')
  } catch (err) {
    console.log(err)
    res.redirect('/pages/products')
  }
});

router.post("/edit/:id", async (req, res) => {
  let {name, price, category, tax, discount } = req.body;
  let image = (req.files && req.files.image) ? req.files.image.name : undefined;
  Product.findById(req.params.id, function(err, product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.tax = tax || product.tax;
    product.discount = discount || product.discount;
    if (!image) { // if image was not changed
      product.save((err, doc) => res.redirect("/pages"));
    } else { // if image was changed
      const fileName = 'product_' + name + '_' + new Date().getMilliseconds();
      let filePath = path.join(productImagePath, fileName);
      req.files.image.mv(filePath, function(err) {
        if (err) { // if err update other properties except image
          product.save((err, doc) => res.end(404));
        } else {
          // delete old product image from file system
          fs.unlinkSync(productImagePath + product.image);
          // set product image
          product.image = fileName;
          product.save((err, doc) => res.redirect("/pages"));
        }
      })
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id, function(err) {
    if (err) return console.log(err);
    res.redirect("/pages/products");
  })
})

router.get("/delete/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id, function(err) {
    if (err) return console.log(err);
    res.redirect("/pages/products");
  })
})

module.exports = router;