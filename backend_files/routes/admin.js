const { Admin } = require("../model/adminUserSchema.model");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); //For Password Hashing
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  const adminList = await Admin.find().select("-passwordHash");

  if (!adminList) {
    res.status(500).json({ success: false });
  }
  res.send(adminList);
});

//ADDING AN ADMIN
router.post("/register", async (req, res) => {
  let admin = new Admin({
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10), //10 is salt
    isAdmin: req.body.isAdmin,
  });
  admin = await admin.save();

  if (!admin) {
    return res.status(404).send("user cannot be created");
  }
  res.send(admin);
});

//LOGIN(JWT USAGE)
router.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  const secret = process.env.secret;
  //for admin validation(if admin doesn't exist)
  if (!admin) {
    return res.status(400).send("admin not found");
  }
  //for admin and password validation
  if (admin && bcrypt.compareSync(req.body.password, admin.passwordHash)) {
    const token = jwt.sign(
      {
        adminId: admin.id,
        isAdmin: admin.isAdmin,
      },
      secret, //PRIVATE_KEY
      { expiresIn: "1d" }
      //Expires your login, automatically logs you out after 1 day(token expires)
    );
    res.status(200).send({ admin: admin.email, token: token });
  } else {
    return res.status(400).send("Password is Wrong");
  }
});

module.exports = router;
