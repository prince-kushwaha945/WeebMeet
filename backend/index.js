import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mongoURI = process.env.MONGO_URI;

console.log('Mongo URI:', mongoURI); // Log the URI to check if it is retrieved correctly

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  verifytoken: {
    type: String,
  }
});

const User = mongoose.model('User', userSchema);

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.send({ message: 'Login Successful', user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: 'User not registered' });
    }
  } catch (err) {
    res.status(500).send({ message: 'An error occurred', error: err.message });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.send({ message: 'User already registered' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: 'Successfully registered. Please login now.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email does not exist. Please check your email address and try again.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

const keysecret = process.env.SECRET_KEY;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/sendpasswordlink', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(401).json({ status: 401, message: 'Enter Your Email' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: 401, message: 'Invalid User' });
    }

    const token = jwt.sign({ _id: user._id }, keysecret, { expiresIn: '2m' });
    await User.findByIdAndUpdate(user._id, { verifytoken: token }, { new: true });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Sending Email for password Reset',
      text: `This Link Valid For 2 MINUTES http://localhost:3000/forget-pass/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(401).json({ status: 401, message: 'Email not send' });
      } else {
        res.status(201).json({ status: 201, message: 'Email send Successfully' });
      }
    });
  } catch (error) {
    res.status(401).json({ status: 401, message: 'Invalid User', error: error.message });
  }
});

app.get('/forget-pass/:id/:token', async (req, res) => {
  const { id, token } = req.params;

  try {
    const user = await User.findOne({ _id: id, verifytoken: token });

    if (!user) {
      return res.status(401).json({ status: 401, message: 'User not exist' });
    }

    jwt.verify(token, keysecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 401, message: 'Token expired or invalid' });
      }
      res.status(201).json({ status: 201, validuser: user });
    });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
});

app.post('/forget-pass/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ _id: id, verifytoken: token });

    if (!user) {
      return res.status(401).json({ status: 401, message: 'User not exist' });
    }

    jwt.verify(token, keysecret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 401, message: 'Token expired or invalid' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(201).json({ status: 201, message: 'Password changed successfully' });
    });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
});

app.listen(9002, () => {
  console.log('BE started at port 9002');
});
