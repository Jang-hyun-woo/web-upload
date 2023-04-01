const express = require("express");
const multer = require("multer");

const db = require("../data/database");

const router = express.Router();

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//파일업로드를 위해
const upload = multer({ storage: storageConfig });

router.get("/", async function (req, res) {
  const user = await db.getDb().collection("user").find().toArray();
  res.render("profiles", { users: user });
});

router.get("/new-user", function (req, res) {
  res.render("new-user");
});

//파일업로드를 위해
router.post("/profiles", upload.single("image"), async function (req, res) {
  const uploadedImageFile = req.file;
  const userData = req.body;

  // console.log(uploadedImageFile);
  // console.log(userData);
  await db.getDb().collection("user").insertOne({
    name: userData.username,
    imagePath: uploadedImageFile.path,
  });
  res.redirect("/");
});

module.exports = router;
