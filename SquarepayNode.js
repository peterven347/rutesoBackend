require("dotenv/config")
const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express');
const app = express()
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const path = require('path')
const server = require('http').createServer(app)
const socketIO = require('socket.io');
const io = socketIO(server, {
    cors: {
        origin: "*"
    }
});

const item_fn = (collection, Schema) => {
    return mongoose.model(collection, productSchema)
}

const productSchema = require('./models/products')
const MONGODB_URI = process.env.MONGODB_URI

const adminRoutes = require("./routes/admin")
const userRoutes = require("./routes/user")

app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000")
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
})
app.use(express.static('public'))
app.use("/admin", adminRoutes)
app.use(userRoutes)

app.get("/", (req, res) => {
    res.send("<h1>Welcome!</h1>")
})

app.get("/food", async (req, res) => {
    try {
        const foodItems = await item_fn('food_item', productSchema).find({})
        res.json(foodItems)
        console.log("food items delivered")
    } catch (err) {
        // console.log(path.join(__dirname))
        console.log(err)
    }
})
app.get("/foood", async(req, res) => {
    const authHeader = req.get("Authorization")
    if (!authHeader) {
        console.log("can't fetch")
    } else {
        const token = authHeader.split(" ")[1]
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "mysupersecrettoken")
            if (!decodedToken) {
                console.log("wrong token")
                return;
            }
            const foodItems = await item_fn('food_item', productSchema).find({})
            res.json(foodItems)
            console.log("food items delivered")
        } catch (err) {
            console.log(err, "an error occcured with jwt...")
        }
    }
})


app.use((req, res) => {
    res.status(404).send("<h1>NOT FOUND!</h1>")
})


const PORT = process.env.PORT || 27017;
const DBoptions = {
    dbName: "ruteso",
    // user: 'username',
    // pass: 'password',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
}
mongoose.connect(MONGODB_URI, DBoptions)
    .then(() => {
        server.listen(PORT)

        io.on("connection", (socket) => {
            console.log("client connected! " + socket.id)
            socket.on("hello", (arg, callback) => {
                console.log(arg)
                // callback("got it")
            });

        });

    })
    .then(() => {
        console.log("Database Connection Successful!");
        console.log(`Server running... port ${PORT}`)
    })

