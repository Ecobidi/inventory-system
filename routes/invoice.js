let router = require("express").Router();
let Invoice = require("../models/invoice");

router.get("/", (req, res) => {
  Invoice.find({})
    .limit(50)
    .sort("-_id")
    .exec((err, docs) => {
      if (err) {
        console.log(err);
        res.end(404);
      } else {
        res.send(200, JSON.stringify(docs));
      }
    });
})

router.post("/new/:staffid", (req, res) => {
  let itemsArray = [];
  let items = req.body;
  let total = 0;
  for (const key in items) {
    itemsArray.push(items[key]);
    total += (items[key].price * items[key].qty);
  }
  let invoice = new Invoice();
  invoice.items = itemsArray;
  invoice.total = total;
  invoice.date = Date.now();
  invoice.staff = req.params.staffid;
  invoice.save((err, doc) => {
    if (err) {
      console.log(err);
      res.end(404);
    } else {
      res.json(JSON.stringify(doc));
    }
  });
})

router.delete("/delete/:id", (req, res) => {
  Invoice.findByIdAndDelete(id, err => {
    if (err) {
      console.log(err);
      res.end(404);
    } else {
      res.end(200);
    }
  });
});

router.get("/delete/:id", (req, res) => {
    Invoice.findByIdAndDelete(id, err => {
      if (err) {
        console.log(err);
        res.end(404);
      } else {
        res.end(200);
      }
    });
});

module.exports = router;