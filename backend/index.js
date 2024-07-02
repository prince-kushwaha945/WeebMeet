import express from "express"
import cors from 'cors'
import mongoose from "mongoose"

const app = express()
let PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/vclogin&signUp");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    verifytoken: {
        type: String,
    }
})

const User = new mongoose.model("User", userSchema)



app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if a user with the same email already exists
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
            // Handle any errors that may occur during the query
            res.status(500).send({ message: "An error occurred" });
        });
});


app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            res.send({ message: "User already registerd" })
        } else {
            // Create a new user instance
            const newUser = new User({
                name,
                email,
                password
            });

            // Save the new user to the database
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
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'email does not exist. Please check your email address and try again.' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});


import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import "dotenv/config";


const keysecret = process.env.SECRET_KEY;

// email config

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "princeku945@gmail.com",
        pass: "ukcl ploj pmvq wvyt"
    }
})


// send email Link for reset Password 

app.post("/sendpasswordlink", async (req, res) => {
    console.log(req.body)

    const { email } = req.body;

    if (!email) {
        res.status(401).json({ status: 401, message: "Enter Your Email" })
    }

    try {
        const userfind = await User.findOne({ email: email });
        // console.log("userfind",  userfind)

        // token generate for reset password
        const token = jwt.sign({ _id: userfind._id }, keysecret, {
            expiresIn: "120s"
        });
        // console.log("token", token);

        const setusertoken = await User.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token }, { new: true });
        // console.log("setusertoken", setusertoken);

        if (setusertoken) {
            const mailOptions = {
                from: "princeku945@gmail.com",
                to: email,
                subject: "Sending Email for passwoed Reset",
                text: `This Link Valid For 2 MINUTES http://localhost:3000/forget-pass/${userfind.id}/${setusertoken.verifytoken}`
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error", error);
                    res.status(401).json({ status: 401, message: "Email not send" });

                } else {
                    console.log("Email send", info.response);
                    res.status(201).json({ status: 201, message: "Email send Succsfully" });
                }
            })
        }

    } catch (error) {

        res.status(401).json({ status: 401, message: "Invalid User" });
    }
})

// verify user for forgot passwoed time

app.get("/forget-pass/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    try {
        const validuser = await User.findOne({ _id: id, verifytoken: token });

        const verifyToken = jwt.verify(token, keysecret);

        if (validuser && verifyToken._id) {
            res.status(201).json({ status: 201, validuser })

        } else {
            res.status(401).json({ status: 401, message: "user not exist" })
        }

    } catch (error) {
        res.status(401).json({ status: 401, error })
    }
})


// change password 

app.post("/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    const { password } = req.body;

    try {
        const validuser = await User.findOne({ _id:id, verifytoken:token });

        const verifyToken = jwt.verify(token, keysecret);

        if (validuser && verifyToken._id) {

            const setnewuserpass = await User.findByIdAndUpdate({_id:id}, {password:password });

            setnewuserpass.save();

            return res.status(201).json({ status:201, setnewuserpass});

        } else {
            res.status(401).json({ status: 401, message: "user not exist" })
        }

    } catch (error) {
        res.status(401).json({ status: 401, error })
    }
})



app.listen(PORT, () => {
    console.log(`listening on port -> ${PORT}`)
})




