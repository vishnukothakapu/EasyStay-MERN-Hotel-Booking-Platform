const express = require("express");
const app = express();
const cors = require("cors");
const download = require("image-downloader");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require('./models/Booking.js');
require("dotenv").config();

const PORT = 3030;
const bcryptSalt = bcrypt.genSaltSync(10);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  "/uploads/profile_pics",
  express.static(__dirname + "/uploads/profile_pics")
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = userData;
    next();
  });
};
// ProfilePic Middleware
const profilePicMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `${__dirname}/uploads/profile_pics`;
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${ext}`;
      cb(null, uniqueName);
    },
  }),
});
// Routes
app.get("/test", (req, res) => {
  res.json("Hello, from the backend!");
});

app.post(
  "/register",
  profilePicMiddleware.single("profilePic"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const profilePicPath = req.file
        ? `/uploads/profile_pics/${req.file.filename}`
        : null;
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const token = "6deufefbgur";
      const content = `Dear ${name}, Click here to <a href="http://localhost:3030/verify/${token}">Verify Email</a>`;
      const resetLink = {
        from: '"EasyStay❤️" <vishnukothakapu467@gmail.com',
        to: email,
        subject: "EasyStay Email Verification",
        text: "Verify your email address",
        html: content,
      };
      await transporter.sendMail(resetLink);
      console.log("Mail sent successfully");
      const userData = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
        profilePic: profilePicPath,
      });
      res.json(userData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "User registration failed" });
    }
  }
);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userData = await User.findOne({ email });
  if (userData && bcrypt.compareSync(password, userData.password)) {
    jwt.sign(
      { email: userData.email, id: userData._id },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json(userData);
      }
    );
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

app.get("/profile", authenticateJWT, async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  res.json({
    name: user?.name,
    email: user?.email,
    id: user?._id,
    profilePic: user?.profilePic,
  });
});
app.put("/profile", authenticateJWT, async (req, res) => {
  const { id } = req.user;
  const { name, email, password, profilePic } = req.body;
  try {
    const updatedData = { name, email, profilePic };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );
    res.json(user);
  }
  catch (error) {
    res.status(400).json({ error: "Failed to update profile" });
  }
});
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    const newName = `photo_${Date.now()}.jpg`;
    await download.image({
      url: link,
      dest: `${__dirname}/uploads/${newName}`,
    });
    res.json(newName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload image by link" });
  }
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 50), (req, res) => {
  const uploadedFiles = req.files.map((file) => {
    const { path, originalname } = file;
    const ext = originalname.split(".").pop();
    const newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);
    return newPath.replace(/\\/g, "/").replace("uploads/", "");
  });
  res.json(uploadedFiles);
});

app.post("/places", authenticateJWT, async (req, res) => {
  try {
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
      maxGuests,
      extraInfo,
      price,
    } = req.body;
    const placeDoc = await Place.create({
      owner: req.user.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
      maxGuests,
      extraInfo,
      price,
    });
    res.json(placeDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create place" });
  }
});

app.get("/user-places", authenticateJWT, async (req, res) => {
  try {
    const places = await Place.find({ owner: req.user.id });
    res.json(places);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

app.get("/places/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.json(place);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch place" });
  }
});

// update places
app.put("/places/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
      maxGuests,
      extraInfo,
      price,
    } = req.body;

    const placeDoc = await Place.findById(id);
    if (!placeDoc) {
      return res.status(404).json({ error: "Place not found" });
    }

    if (req.user.id.toString() === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        checkIn,
        checkOut,
        maxGuests,
        extraInfo,
        price,
      });

      await placeDoc.save();
      return res.json({ message: "Place updated successfully" });
    } else {
      return res.status(403).json({ error: "Unauthorized to edit this place" });
    }
  } catch (err) {
    console.error("Error updating place:", err);
    res.status(500).json({ error: "Failed to update place" });
  }
});
app.get("/places", async (req, res) => {
  res.json(await Place.find());
});
app.get("/place/:id", async (req, res) => {
  const { id } = req.params;
  try {
    
    const place = await Place.findById(id).populate('owner');
    res.json(place);
  }
  catch (err) {
    console.error('Error fetching place:', err);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});
app.post("/bookings",authenticateJWT,async (req, res) => {
  const { place, checkIn, checkOut, guests, name, mobile, price } = req.body;
  try {
    const newBooking = await Booking.create({
      place, checkIn, checkOut, guests, name, mobile, price, user: req.user.id
    });
    const bookingDoc = await Booking.findById(newBooking._id);
    res.json(bookingDoc);
  }
  catch (err) {
    console.log("Error creating booking:", err);
    res.status(500).json({ error: "An error occurred while booking" });
  }
});
app.get("/bookings", authenticateJWT, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "place"
    );
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
