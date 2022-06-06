let router = require("express").Router();
const Product = require("../models/product");
const Category = require("../models/category");
const Staff = require("../models/staff");
const Invoice = require("../models/invoice");

let authenticateAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.admin) {
    next();
  }
  console.log("Not authenticated as an Administrator");
  res.redirect("/pages/login");
}

let authenticateStaff = (req, res, next) => {
  if (req.session && req.session.user) {
    next()
  } else {
    res.redirect("/pages/login");
  }
}

router.get("/login", (req, res) => {
  res.render("login");
});

// perform staff authentication
// router.use(authenticateStaff);

router.get("/sales", (req, res) => {
  Category.find({})
    .sort("name")
    .exec((err, categories) => {
      Product.find({})
        .limit(25)
        .sort("-name")
        .exec((err, products) => {
          res.render("sales-dashboard", {categories, products});
        })
    })
});

router.get("/", (req, res) => {
  Invoice.find({})
    .select("_id total date")
    .sort("-_id")
    .exec((err, invoices) => {
      Product.find({})
        .sort("-_id")
        .exec((err, products) => {
          Staff.find({})
            .exec((err, staff) => {
              Category.find({})
              .exec((err, categories) => {
                res.render("dashboard", {
                  numberOfSales: invoices.length,
                  numberOfProducts: products.length,
                  numberOfStaff: staff.length,
                  numberOfCategories: categories.length,
                  categories
                })
              })
            })
        })
    })
});

router.get("/categories", (req, res) => {
  Category.find({})
    .sort("-_id")
    .limit(20)
    .exec((err, categories) => {
      res.render("categories", { categories });
    })
});

router.get("/invoices", (req, res) => {
  Invoice.find({})
    .sort("-_id")
    .limit(20)
    .exec((err, invoices) => {
      res.render("invoices", { invoices });
    });
});

router.get("/products", (req, res) => {
  Category.find({})
    .sort("-name")
    .exec((err, categories) => {
      Product.find({})
      .sort("-_id")
      .limit(40)
      .exec((err, products) => {
        res.render("products", { products, categories });
      })
    })
});

router.get("/staff", (req, res) => {
  Staff.find({})
    .sort("-_id")
    .limit(20)
    .exec((err, staff) => {
      res.render("staff", { staff });
    })
});

module.exports = router;