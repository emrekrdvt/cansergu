const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const app = express();

//my
const apiRouter = require("./router/apiRouter");

//middleware
app.use(
  cors({
    origin: ["http://localhost:5500"],
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/postimg", express.static(path.join(__dirname, "post-images")));
app.use("/images", express.static(path.join(__dirname, "pics")));
app.use("/api", apiRouter);
//env
const port = process.env.port;
const ATLAS = process.env.DBURL;
const dbName = ATLAS.split("/")[3];

//server listening
app.listen(port, async () => {
  console.log(`Server started PORT: ${port} `);

  try {
    await mongoose
      .connect(ATLAS, { useNewUrlParser: true })
      .then(() => console.log(`${dbName} db is online`))
      .catch((error) => {
        console.log("Error : ", error);
      });
  } catch (error) {
    console.error(error);
  }
});
