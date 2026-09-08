require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");


const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const demoRoutes = require("./routes/demoRoutes");
const fileRoutes = require("./routes/fileRoutes");

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/demo", demoRoutes);
app.use("/file", fileRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
