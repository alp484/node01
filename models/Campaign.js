var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CampaignSchema = new Schema({
    campaignName: {type: String},
    itemCategories: {type: String},
    discountType: {type: String},
    campaignType: {type: String},
    minItemCount: {type: Object},
    discountPrice: {type: Object},
    numOfDays: {type: Object},
    validTill:{type: String},
}, {timestamps: true});

module.exports = mongoose.model("Campaign", CampaignSchema);