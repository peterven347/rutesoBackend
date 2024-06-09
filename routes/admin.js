const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const fs = require('fs')
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dynamicDest = "uploads/images";
    // const dynamicDest = `uploads/${req.body.name}`;
    if (!fs.existsSync(dynamicDest)) {
      fs.mkdirSync(dynamicDest, { recursive: true });
    }
    cb(null, dynamicDest);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname)
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter })

const productSchema = require('../models/products')
const userSchema = require('../models/users')
const Order = require('../models/orders')

const item_fn = (collection, Schema) => {
  return mongoose.model(collection, productSchema)
}

router.get("/", (req, res) => {
  res.redirect("http://127.0.0.1:3000")
})

router.get("/history", async(req, res) => {
  await Order.findOne({date: "Fri Apr 05 2024"}).lean().exec()
  .then(r => res.json(r.orders))
  // .then(res.end())
})

router.post('/add-item', upload.single("img"), (req, res) => {
  const Item = item_fn("food_item", productSchema)
  const itemToAdd = new Item({
    name: req.body.name,
    mini_unit: req.body.mini_unit,
    mini_price: req.body.mini_price,
    maxi_unit: req.body.maxi_unit,
    maxi_price: req.body.maxi_price,
    category: req.body.category,
    img: path.normalize(req.file.path)
  })
  itemToAdd.save().then(() => console.log("Saved!"))
    .then(res.redirect("http://localhost:3000/#/stocks"))
    .then(res.end())

})

router.delete('/:_id', async(req, res) => {
  const Item = item_fn("food_item", productSchema)
  await Item.findByIdAndDelete({ "_id": req.params._id })
    .then(res.status(200).json({ status: true }))
})

router.get("/count", async(req, res) => {
  try{
    const noOfFoodItems = await item_fn('food_item', productSchema).countDocuments({})
    const noOfCustomers = await item_fn('customer', userSchema).countDocuments({})
    res.json({noOfFoodItems: noOfFoodItems, noOfCustomers: noOfCustomers})
  }catch(err){console.log("couldn't load counts")}
})

router.get("notification", async() => {
  res.send("<h1>Welcome!</h1>")
  socket.emit("event", { val: 33 })
})
module.exports = router
