// process.env.NODE_ENV !== "production" && require("dotenv").config())
const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes");
const morgan = require('morgan')

app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(routes);

module.exports = app;
