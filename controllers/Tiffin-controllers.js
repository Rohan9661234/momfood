const Contact = require("../models/Contact.js");
const TiffinForm = require("../models/TiffinForm.js");
const feedbackSchema = require("../models/feedback.js");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../db/emailconfig.js");

const Home = (req, res) => {
  if (req.session.name) {
    return res.render("index", { user: req.session.name });
  } else {
    return res.render("index", { user: "no user login" });
  }
};

const Login = async (req, res) => {
  if (req.session.name) {
    return res.redirect("/");
  } else {
    if (req.method == "GET") {
      return res.render("login");
      // return res.render("index");
    } else {
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
        req.session.name = user.name;
        req.session.email = email;
        req.session.role = user.role;
        req.session.location = user.location;
        req.session.phone = user.phone;

        return res.redirect("/profile");
      } catch (error) {
        return res.json({ error: error.message });
      }
    }
  }
};

const Signup = async (req, res) => {
  if (req.session.name) {
    return res.redirect("/");
  } else {
    if (req.method == "GET") {
      return res.render("signup");
    } else {
      const { name, email, password, phone } = req.body;
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
        // return res.redirect("/login");
        return res.redirect("/"); //change by rohan
      } catch (error) {
        return res.send(error);
      }
    }
  }
};

const contact = async (req, res) => {
  if (req.session.name) {
    const a = req.body;
    const data = new Contact(a);
    const data1 = await data.save();
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

const profile = async (req, res) => {
  if (req.session.name) {
    if (req.method == "GET") {
      const { name, email } = req.session;
      const a = await User.findOne({ email: email });
      req.session.phone = a.phone;
      const obj = {
        name,
        email,
        phone: req.session.phone,
      };
      res.render("profile", obj);
    } else {
      const { name, email } = req.session;
      const { phone } = req.body;
      req.session.phone = phone;
      const a = await User.findOne({ email: email });

      const obj = {
        name,
        email,
        phone,
      };
      const result = await User.findByIdAndUpdate(a._id, obj);
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/login");
};

const share = (req, res) => {
  return res.render("share");
};

const Tiffin = async (req, res) => {
  if (req.session.name) {
    role = req.session.role;
    if (role == "customer") {
      if (req.method == "GET") {
        const { name, email, phone } = req.session;
        const size = req.params["size"];
        const cost = req.params["cost"];
        const obj = { name, email, phone, success: false, size, cost };
        return res.render("TiffinForm.ejs", obj);
      } else {
        const { name, email, phone } = req.session;
        const obj = { name, email, phone, success: true };
        const data = new TiffinForm(req.body);
        const data1 = await data.save();

        const location = req.body.location;
        const usr = await User.find({
          $and: [{ role: "kitchen" }, { location: location }],
        });

        const htm = `<h2> ${data1.name} just submit tiffin form </h2> <br> 
                
                <b> Name <b>: ${data1.name} <br>
                <b> Email <b> : ${data1.email} <br>
                <b> Phone <b> : ${data1.phone} <br>
                <b> Tiffin <b> : ${data1.tiffin} <br>
                <b> Cost <b> : ${data1.cost} <br> 
                <b> Quantity <b> : ${data1.quantity} <br>
                <b> Total Cost <b> : ${data1.cost} <br>
                <b> Location <b> : ${data1.location} <br>

                <br> <br> 

                For Mor Details Please Check on Website.
                `;

        try {
          let info = await transporter.sendMail({
            from: "momfood629@gmail.com", // sender address
            to: usr[0].email, // list of receivers
            subject: "Password Reset Email", // Subject line
            html: htm,
            text: "",
          });

          const { name, email, phone } = req.session;
          const size = "small";
          const cost = 60;
          const obj = { name, email, phone, success: true, size, cost };

          return res.render("TiffinForm.ejs", obj);
        } catch (error) {
          console.log(error);
          return res.json({ status1: "failed", message: error.message });
        }
      }
    } else if (role == "kitchen") {
      location1 = req.session.location;
      console.log(location1);
      const a = await TiffinForm.find({ location: location1 });
      return res.render("kitchen.ejs", { a });
    } else if (role == "admin") {
      const a = await TiffinForm.find();
      return res.render("admin.ejs", { a });
    } else {
      return res.render("login.ejs");
    }
  } else {
    return res.redirect("/login");
  }
};

const policy = (req, res) => {
  return res.render("policy");
};

const feedback = async (req, res) => {
  if (req.method == "GET") {
    return res.render("feedback.ejs", { success: false });
  } else {
    const data = new feedbackSchema(req.body);
    await data.save();
    return res.render("feedback.ejs", { success: true });
  }
};

const history = async (req, res) => {
  if (req.session.name) {
    const usr = await TiffinForm.find({ name: req.session.name });

    return res.render("history.ejs", { usr });
  } else {
    return res.redirect("/login");
  }
};

const response = async (req, res) => {
  const id = req.params["id"];
  console.log("id", id);
  const data = await TiffinForm.findByIdAndUpdate(id, { response: "accept" });
  return res.redirect("/history");
};

const forgotPassword = async (req, res) => {
  if (req.method == "GET") {
    return res.render("forgotpassword.ejs", { success: false });
  } else {
    const { email } = req.body;
    console.log(email);
    if (email) {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.json({ status: "failed", message: "User Does not Exist." });
      }
      const secret =
        user._id +
        "GeekyShow Create this Website Backend Api using Node & Express Js, Jwt, Bcrypt and ... ";

      const data = {
        id: user._id,
      };
      const token = jwt.sign(data, secret, { expiresIn: "10m" });
      // const link = `http://localhost:3000/reset/${user._id}/${token}`;
      const link = `http://localhost:8000///reset/${user._id}/${token}`;

      // Send Email

      try {
        let info = await transporter.sendMail({
          from: "momfood629@gmail.com", // sender address
          to: email, // list of receivers
          subject: "Password Reset Email", // Subject line
          text: link, // plain text body
          html: `Password Reset Link. <a href=${link}> Reset Password Link </a> </h4>`,
        });
        return res.render("forgotpassword", { success: true });
      } catch (error) {
        console.log(error);
        res.json({ status1: "failed", message: error.message });
      }
    } else {
      return res.json({ status: "filled", message: "All Fields are Required" });
    }
  }
};

const userPasswordReset = async (req, res) => {
  if (req.method == "GET") {
    return res.render("resetpasswordform.ejs");
  } else {
    try {
      const { password, password_confirm } = req.body;
      if (password && password_confirm) {
        if (password === password_confirm) {
          const { id, token } = req.params;
          const user = await User.findById(id);

          if (!user) {
            return req.json({
              status: "Failed",
              "1message": "Request With this User is not Exist",
            });
          }

          try {
            const secret =
              user._id +
              "GeekyShow Create this Website Backend Api using Node & Express Js, Jwt, Bcrypt and ... ";
            const auth_token = jwt.verify(token, secret);

            bcrypt.genSalt(10, async function (err, salt) {
              bcrypt.hash(password, salt, async function (err, hash) {
                // Store hash in your password DB.
                await User.updateOne(
                  { _id: id },
                  {
                    $set: {
                      password: hash,
                    },
                  }
                );
                return res.redirect("/login");
              });
            });
          } catch (error) {
            res.json({ status: "failed", "3message": error.message });
          }
        } else {
          return res.json({
            status: "failed",
            "4message": "Password and Confirm Password are not Match.",
          });
        }
      } else {
        return res.json({
          status: "failed",
          "5message": "All Fileds are Required",
        });
      }
    } catch (error) {
      res.json({ status: "failed", "6message": "Internal Server Error" });
    }
  }
};

module.exports = {
  Home,
  Login,
  Signup,
  contact,
  profile,
  logout,
  Tiffin,
  share,
  policy,
  feedback,
  history,
  response,
  forgotPassword,
  userPasswordReset,
};
