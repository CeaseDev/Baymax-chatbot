var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { async } = require("rxjs");
const User = require("../model/userSchema.model");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const user = await User.find();
  if (!user) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(user);
});

//ADDING AN USER
router.post("/add", async function (req, res, next) {
  const {
    firstName,
    lastName,
    email,
    mobile,
    communicationMedium,
    address,
    city,
    state,
    zipcode,
    dob,
    gender,
    socialSecurityNumber,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !mobile ||
    !communicationMedium ||
    !address ||
    !city ||
    !state ||
    !zipcode ||
    !dob ||
    !gender ||
    !socialSecurityNumber
  ) {
    return res.status(422).json({ error: "Please fill all the values" });
  }
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      communicationMedium,
      address,
      city,
      state,
      zipcode,
      dob,
      gender,
      socialSecurityNumber,
    });

    await user.save();
  } catch (err) {
    console.log(err);
  }
});

//Remove an user
router.delete("/delete/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "The user is deleted" });
      } else {
        return res.status(404).json({
          success: false,
          message: "The user not found",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
