require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookie());

const PORT = process.env.SERVER_PORT;
const KEY = process.env.JWT_KEY;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const Users = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  mobileNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bookingType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bookingCategory: {
    type: Sequelize.STRING,
    allowNull: false, // Set to true if optional
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

connectToDatabase();

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({ message: "Token expired" });
  jwt.verify(token, KEY, (err, user) => {
    if (err) return res.json({ message: "Token expired" });
    req.user = { id: user.id };
    console.log("User is ", req.user);
    next();
  });
};

app.post("/save-order", async (req, res) => {
  try {
    const { mobileNumber, bookingType, bookingCategory, email } = req.body;

    if (!mobileNumber || !bookingType || !bookingCategory) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    console.log(
      "Order Details ",
      mobileNumber,
      bookingType,
      bookingCategory,
      email
    );

    const newOrder = await Order.create({
      mobileNumber: mobileNumber,
      bookingType: bookingType,
      bookingCategory: bookingCategory,
      email: email,
    });

    res
      .status(201)
      .json({ message: "Order created successfully!", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/user-orders", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required!" });
    }

    const userOrders = await Order.findAll({
      where: { email: email },
    });

    if (userOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this email." });
    }

    res.status(200).json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const order = await razorpay.orders.create({
      amount,
      currency,
      payment_capture: 1,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const hmac = crypto
    .createHmac("sha256", process.env.RAZORPAY_TEST_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (hmac === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await Users.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser.id }, KEY, { expiresIn: "1d" });
    console.log("Token is", token);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production (requires HTTPS)
        sameSite: "lax",
      })
      .json(newUser);

    console.log("User registered in successfully");
    // res.json(newUser);
  } catch (error) {
    console.log("Error adding user to the database ", error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Users.findOne({ where: { email: email } });

    if (!user) {
      // If there's no password, it's a Google login, so create a new user
      user = await Users.create({
        email: email,
        password: password, // Google users won't have passwords
      });
    }

    // If a password exists, verify traditional login
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user.id }, KEY, { expiresIn: "1d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production (requires HTTPS)
        sameSite: "lax",
      })
      .json(user);

    console.log("User logged in successfully");
  } catch (error) {
    console.log("Error during login", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login-google", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await Users.findOne({ where: { email: email } });

    if (!user) {
      // If there's no password, it's a Google login, so create a new user
      user = await Users.create({
        name: name,
        email: email,
        password: password, // Google users won't have passwords
      });
    }

    console.log("Google user", user);

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user.id }, KEY, { expiresIn: "1d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production (requires HTTPS)
        sameSite: "lax",
      })
      .json(user);

    console.log("User logged in successfully");
  } catch (error) {
    console.log("Error during login", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/auth/me", async (req, res) => {
  console.log("Cookies received: ", req.cookies.token);
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token expired" });
    }

    try {
      const user = await Users.findOne({ where: { id: decoded.id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

app.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "Lax",
    })
    .json({ message: "Logged out successfully" });

  console.log("User logged out, cookie cleared.");
});

app.get("/dashboard", authenticate, (req, res) => {
  res.json({ message: "Welcome to your dashboard", userId: req.user.id });
});

const syncAndStartServer = async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error during sync or user creation:", err);
  }
};

syncAndStartServer();
