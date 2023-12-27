const express = require("express");
const router = require("./routes/web.js");
const connectDb = require("./db/connectDb.js");
const MongoStore = require("connect-mongo");
const session = require("express-session");
//Addition By Pranjal Shrivastava
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/User.js");
const Tiffin = require("./models/TiffinForm.js");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/kitchen1", async (req, res) => {
  const { email, location, type } = req.body;
  console.log(req.body);
  let data = [];
  try {
    let docs;
    if (type === "admin") {
      docs = await Tiffin.find({});
    } else if (type === "kitchen") {
      docs = await Tiffin.find({ location }).exec();
    }

    docs.forEach((doc) => {
      let name = doc.name;
      let emailField = doc.email;
      let password = doc.password;
      let tiffin = doc.tiffin;
      let response = doc.response;
      let totalcost = doc.totalcost;
      let SubmitDate = doc.SubmitDate;
      let location = doc.location;
      let day = doc.day;
      let address = doc.address;
      let time = doc.time;
      let todate = doc.todate;
      let fromdate = doc.fromdate;
      let quantity = doc.quantity;
      let cost = doc.cost;
      let phone = doc.phone;
      data.push({
        name,
        email: emailField,
        password,
        tiffin,
        response,
        totalcost,
        SubmitDate,
        location,
        day,
        address,
        time,
        todate,
        fromdate,
        quantity,
        cost,
        phone,
      });
    });
    console.log(data.length);
    res.json(data);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send("Error retrieving patient data from the database");
  }
});
app.post("/tiffin1", async (req, res) => {
  console.log(req.body);
  const data = req.body;
  console.log(data);
  const {
    CustomerName1,
    Email1,
    Contact1,
    ChooseLocation1,
    Address1,
    Tiffin1,
    Time1,
    ToDate1,
    fromDate,
    TotalDays1,
    Quantity1,
    Cost1,
  } = req.body;
  try {
    const tiffin = new Tiffin({
      name: CustomerName1,
      email: Email1,
      tiffin: Tiffin1,
      response: "",
      totalcost: Cost1,
      SubmitDate: new Date(),
      location: ChooseLocation1,
      day: TotalDays1,
      address: Address1,
      time: Time1,
      todate: ToDate1,
      fromdate: fromDate,
      quantity: Quantity1,
      cost: Cost1,
      phone: Contact1,
    });
    const d = await tiffin.save();
    res.json({
      TiffinAdded: true,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
app.post("/login1", async (req, res) => {
  const data = req.body;
  console.log(data);
  //   res.send("Data received!");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        error: "This Email-Id is not exits. please try with another one. ",
      });
    }
    const compare = bcrypt.compareSync(password, user.password);
    if (!compare) {
      return res.json({ error: "Password is not match." });
    }
    res.json({
      name: user.name,
      email: user.email,
      loginSuccess: true,
      tel: user.phone,
      type: user.role,
      location: user.location,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.post("/signup1", async (req, res) => {
  const data = req.body;
  console.log(data);
  //   res.send("Data received!");
  const { email, password, phone, name } = req.body;
  try {
    const a = await User.findOne({ email: email });
    if (a) {
      return res.json({
        error:
          "request with this email id already exists. please try with another one.",
      });
    }
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    const data = new User({
      name,
      email,
      password: hash,
      phone,
    });
    const data1 = await data.save();
    res.json({
      signupSuccess: true,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
//Addition By Pranjal Shrivastava
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// MongoDB Session
const sessionStorage = MongoStore.create({
  mongoUrl: "mongodb+srv://aksh2137:aksh2137@cluster0.jpqpxva.mongodb.net",
  dbName: "Assignment",
  collectionName: "session",
  ttl: 604800000,
  autoRemove: "native",
});

//session
app.use(
  session({
    name: "sessionkey",
    secret: "iamkey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 604800000 },
    store: sessionStorage,
  })
);

connectDb();

app.use(router);

//Define Static Css and Js directory.
app.use(express.static("./public"));

app.listen(PORT, () => {
  console.log("Connected Successfully.");
});
