const fs = require("fs");
const path = require("path");
let router = require("express").Router();
let Category = require("../models/category");
let config = require("../config");
let categoryImagePath = config.categoryImagePath;

router.get("/", (req, res) => {
  Category.find({}, (err, categories) => {
    res.send(200, JSON.stringify(categories));
  });
})

router.post("/new", async (req, res) => {
  await Category.create(req.body)
  res.redirect('/pages/categories')
  // console.log(req.files);
  // let image = (req.files && req.files.image)? req.files.image.name : undefined;
  // if (image) { // image sent
  //   const fileName = 'category_' + req.body.name + '_' + new Date().getMilliseconds();
  //   const imagePath = path.join(categoryImagePath, fileName);
  //   req.files.image.mv(imagePath, err => {
  //     if (err) return res.end(404);
  //     Category.create({
  //       name: req.body.name,
  //       image: fileName
  //     }, (err) => {
  //       if (err) {
  //         console.log(err)
  //         res.end(404);
  //       } else {
  //         res.redirect("/pages");
  //       }
  //     });
  //   });
  // }
});

router.post("/edit", (req, res) => {
  image = (req.files && req.files.image)? req.files.image.name : undefined;
  Category.findById(req.params.id, (err, doc) => {
    doc.name = req.body.name || doc.name;
    if (!image) { // if image was not changed
      doc.save((err) => res.redirect("/pages"));
    } else { // if image was changed
      const fileName = doc.name + "-" + image;
      let filePath = path.join(category, fileName);
      req.files.image.mv(filePath, function(err) {
        if (err) { // if err update other properties except image
          doc.save((err, doc) => res.end(404));
        } else {
          // delete old image from file system
          fs.unlinkSync(categoryImagePath + doc.image);
          // set image
          doc.image = fileName;
          doc.save((err, doc) => res.redirect("/pages"));
        }
      })
    }
  })
});

router.delete("/delete/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id, err => {
    if (err) {
      console.log(err);
      res.end(404);
    } else {
      res.redirect("/pages/categories");
    }
  })
})

router.get("/delete/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id, err => {
    if (err) {
      console.log(err);
      res.end(404);
    } else {
      res.redirect("/pages/categories");
    }
  })
})


module.exports = router;