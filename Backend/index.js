const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");

app.use(fileupload());
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: [process.env.FRONTEND_BASE_URL], credentials: true}));

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}...`);
});

app.get("/", (req, res) => {
    res.send("SkillUp backend is up and running...");
});

const authRoutes = require("./routes/auth.js");
app.use("/api/v1", authRoutes);

const courseRoutes = require("./routes/courses.js");
app.use("/api/v1", courseRoutes);

const quizRoutes = require("./routes/quizzes.js");
app.use("/api/v1", quizRoutes);

const discussionRoutes = require("./routes/discussions.js");
app.use("/api/v1", discussionRoutes);

const paymentRoutes = require("./routes/payments.js");
app.use("/api/v1", paymentRoutes);

const dbConnect = require("./config/dbConnect.js");
dbConnect();

const cloudinaryConnect = require("./config/cloudinaryConnect.js");
cloudinaryConnect();