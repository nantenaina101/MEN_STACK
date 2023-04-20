require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const routes = require("./routes/routes")

const app = express()
const PORT = process.env.PORT || 4000

// Database connection
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

const db = mongoose.connection

db.on("error", () => console.log("connection error"));
db.once("open", function () {
  console.log("Connected successfully to " + process.env.DB_URI);
});

//Middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false
}))

app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

app.use(express.static("uploads"))

// Set template engine
 app.set("view engine", "ejs")

// Routes
app.use("", routes)

app.listen(PORT, () => {
    console.log(`Server started at port http://localhost:${PORT}`)
})
