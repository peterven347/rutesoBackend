let d = {
    date: "Tue Mar 26 2024",
    orders: {
      "65b633052821e519a135d10f": [
        [
          {
            name: "ann",
            mini_unit: "ann",
            mini_price: 5,
            mini_quantity: 1,
            maxi_unit: "ann",
            maxi_price: 5,
            maxi_quantity: 0,
            cost: 5,
            _id: "6600ed2c185f4b2f6f8338b9"
          },
          {
            Total_Cost: 5,
            _id: "6602ae2805b83496c956edee"
          }
        ]
      ],
      "65bcby3052821e5t80asc9g": [
        [
          {
            name: "ann",
            mini_unit: "ann",
            mini_price: 5,
            mini_quantity: 1,
            maxi_unit: "ann",
            maxi_price: 5,
            maxi_quantity: 0,
            cost: 5,
            _id: "6600ed2c185f4b2f6f8338b9"
          },
          {
            Total_Cost: 5,
            _id: "6602ae2805b83496c956edee"
          }
        ]
      ]
    },
    "_id": "6602ae2805b83496c956edec"
  }

  router.patch('/orderr', async (req, res) => {
    const d = new Date(Date.now())
    date = d.toDateString()
    const id = date
    let userId;
    let cart;
    let cost;
    const authHeader = req.get("Authorization")
    if (!authHeader) {
        console.log("can't fetch for order")
    } else {
        const token = authHeader.split(" ")[1]
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "mysupersecrettoken")
            if (!decodedToken) {
                console.log("wrong token")
                return;
            }
            const { email } = decodedToken
            await Customer.findOne({ eMail: email }) //await is necessary for userId
                .then(result => {
                    if (result) {
                        userId = (result._id).toString()
                    }
                })
            cart = [].concat(Object.values({ ...req.body }))
            cost = cart.reduce((acc, i) => {
                return acc + ((i.maxi_price * i.maxi_quantity + i.mini_price * i.mini_quantity));
            }, 0)
            const record = new Order({
                date: date,
                orders: {
                    [userId]: [[...cart, { Total_Cost: cost }]],
                    // "user_id_2": [[{ "name": "maize" }, { Total_Cost: cost }], [{ "name": "maize" }]]
                },
            })
            // record.save()
            console.log(JSON.stringify(record, null, 2))
            console.log("ordered!")
            res.json({ costVal: cost })
        } catch (err) {
            console.log("an error occcured with jwt, order...")
        }
    }
});


await Order.findOneAndUpdate({ name: "Peter" }, { title : title })
.then(result => {
  if (result == null) {
    console.log("not found")
  } else {
      let resObj = result.toObject()
      const ordersMap = resObj.orders;
      function c() {
          ordersMap.forEach((value, key) => {
              if (key === "key") {
              return key
          } else {
              console.log("abort")
          }

      })
  }
  }
})

else {
  ordersMap = {...ordersMap, userId: cart} // _id that has not ordered today
  Order.findOneAndUpdate({ date: date }, { orders: ordersMap })
  console.log(99999)
}


const obj = {
  a: 1,
  b: 2,
  c: 3
}

let resObj = result.toObject()
let ordersMap = resObj.orders
console.log(resObj.orders.has('660994d7f9f27f74b65db74c'))
// console.log(ordersMap.orders.get('660994d7f9f27f74b65db74c'))
// console.log(ordersMap["660994d7f9f27f74b65db74c"])
ordersMap.forEach((value, key) => {
    // console.log(ordersMap.userId)
    // console.log(ordersMap[userId])
    if (key === userId) {   // _id already ordered today
        console.log(userId)
        // updatedCart = [...value, cart]
        // updatedOrder = { ...ordersMap, [userId]: updatedCart }
        // result.orders = updatedOrder
        // result.save().then(r => { console.log(r) })
        console.log(".................")
        console.log(".................")
        return
    } else {
        // result.userId = cart // _id that has not ordered today
        // result.save().then(r => { console.log(r) })
    }



  if (ordersMap.has(userId)) {
      updatedCart = [...ordersMap.get(userId), cart]
      updatedOrder = { ...ordersMap, [userId]: updatedCart }
      result.orders = updatedOrder
      result.save().then(r => { console.log(r) })
  } else {
      result.orders.set(userId, cart)
      result.save().then(r => { console.log(r) })
  }