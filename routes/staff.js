let router = require("express").Router();
let Staff = require("../models/staff");

router.get("/", (req, res) => {
  Staff.find({}, (err, staff) => {
    if (err) res.end(404);
    else res.send(200, JSON.stringify(staff));
  });
});

router.get("/:id", (req, res) => {
  Staff.findById(req.params.id, (err, staff) => {
    if (err) res.end(404);
    else res.send(200, JSON.stringify(staff));
  });
});

router.post("/new", (req, res) => {
  const {surname, othername, staffid, password, phone} = req.body;
  Staff.create({name: {surname, othername}, staffid, password, phone}, (err, staff) => {
    if (err) {
      console.log(err);
      res.end(404);
    } else {
      res.redirect("/pages");
    }
  });
});

router.post("/edit/:id", (req, res) => {
  Staff.findById(req.params.id, (err, staff) => {
    staff.name = {"surname": req.body.surname, "othername": req.body.othername};
    staff.password = req.body.password;
    staff.phone = req.body.phone;
    
    staff.save((err, doc) => {
      if (err) res.end(404);
      else res.send(200, JSON.stringify(doc));
    });
  });
});

router.delete("/delete/:id", (req, res) => {
  Staff.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.end(404);
    } else {
      res.end(404);
    }
  });
});

module.exports = router;