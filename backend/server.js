const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend working");
});

app.post("/generate-questions", (req, res) => {

    console.log("Route hit!");

    const { role, skills } = req.body;

    const questions = [
        `Explain the core concepts of ${role}.`,
        `What projects have you built using ${skills}?`,
        `What challenges did you face while working with ${skills}?`,
        `Explain a real-world use case of ${skills}.`,
        `Why do you want to become a ${role}?`
    ];

    res.json({ questions });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});