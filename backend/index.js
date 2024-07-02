import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();
let PORT = process.env.PORT || 3000;
const keysecret = process.env.SECRET_KEY;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://kushwahaprince660:webmeet123@cluster0.cval27d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidCertificates: true // Only for development, use with caution
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    verifytoken: {
        type: String,
    }
});

const User = new mongoose.model("User", userSchema);

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                if (password === user.password) {
                    res.send({ message: "Login Successful", user: user });
                } else {
                    res.send({ message: "Password didn't match" });
                }
            } else {
                res.send({ message: "User not registered" });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "An error occurred" });
        });
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            res.send({ message: "User already registered" });
        } else {
            const newUser = new User({ name, email, password });
            await newUser.save();
            res.status(201).json({ message: "Successfully registered. Please login now." });
        }
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

app.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email does not exist. Please check your email address and try again.' });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "princeku945@gmail.com",
        pass: "ukcl ploj pmvq wvyt"
    }
});

app.post("/sendpasswordlink", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(401).json({ status: 401, message: "Enter Your Email" });
    }

    try {
        const userfind = await User.findOne({ email: email });

        const token = jwt.sign({ _id: userfind._id }, keysecret, { expiresIn: "120s" });
        const setusertoken = await User.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token }, { new: true });

        if (setusertoken) {
            const mailOptions = {
                from: "princeku945@gmail.com",
                to: email,
                subject: "Sending Email for password Reset",
                text: `This Link Valid For 2 MINUTES http://localhost:3000/forget-pass/${userfind.id}/${setusertoken.verifytoken}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.status(401).json({ status: 401, message: "Email not send" });
                } else {
                    res.status(201).json({ status: 201, message: "Email send Successfully" });
                }
            });
        }

    } catch (error) {
        res.status(401).json({ status: 401, message: "Invalid User" });
    }
});

app.get("/forget-pass/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    try {
        const validuser = await User.findOne({ _id: id, verifytoken: token });
        const verifyToken = jwt.verify(token, keysecret);

        if (validuser && verifyToken._id) {
            res.status(201).json({ status: 201, validuser });
        } else {
            res.status(401).json({ status: 401, message: "User not exist" });
        }

    } catch (error) {
        res.status(401).json({ status: 401, error });
    }
});

app.post("/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const validuser = await User.findOne({ _id: id, verifytoken: token });
        const verifyToken = jwt.verify(token, keysecret);

        if (validuser && verifyToken._id) {
            const setnewuserpass = await User.findByIdAndUpdate({ _id: id }, { password: password });
            setnewuserpass.save();

            return res.status(201).json({ status: 201, setnewuserpass });
        } else {
            res.status(401).json({ status: 401, message: "User not exist" });
        }

    } catch (error) {
        res.status(401).json({ status: 401, error });
    }
});

app.listen(PORT, () => {
    console.log(`listening on port -> ${PORT}`);
});
