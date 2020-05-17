var express = require("express");
var CampaignRouter = require("./Campaign");

var app = express();

app.use("/campaign/", CampaignRouter);

module.exports = app;