const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files (index.html, style.css, etc.)

// Route to serve the index.html file at the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// POST Endpoint for Contact Form
app.post("/send-message", async (req, res) => {
    const { name, email, message } = req.body;

    // Validate form fields
    if (!name || !email || !message) {
        return res.status(400).send("All fields are required.");
    }

    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER, // Add your Gmail address in a .env file
            pass: process.env.EMAIL_PASS, // Add your Gmail app password in a .env file
        },
    });

    // Email Options
    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.RECEIVER_EMAIL, // Add your receiving email in the .env file
        subject: `New Contact Form Submission from ${name}`,
        text: `You have a new message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions); // Send the email
        res.status(200).send("Message sent successfully!");
    } catch (error) {
        console.error("Error sending email12:", error);
        res.status(500).send("Error sending message12.");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
