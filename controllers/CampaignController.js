const Campaign = require("../models/Campaign");
const {body, validationResult} = require("express-validator");
const {sanitizeBody} = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Campaign Schema
function CampaignData(data) {
    this.id = data._id;
    this.campaignName = data.campaignName;
    this.itemCategories = data.itemCategories;
    this.campaignType = data.campaignType;
    this.minItemCount = data.minItemCount;
    this.discountPrice = data.discountPrice;
    this.numOfDays = data.numOfDays;
}

/**
 * Campaign List.
 *
 * @returns {Object}
 */
exports.campaignList =
    function (req, res) {
        console.log("boklist 李攀")
        try {
            Campaign.find().then((campaigns) => {
                if (campaigns.length > 0) {

                    const campaignsTemp = campaigns.map(v => {
                        return {...v._doc, id: v._doc._id}
                    })
                    return apiResponse.successResponseWithData(res, "Operation success", campaignsTemp);
                } else {
                    return apiResponse.successResponseWithData(res, "Operation success", []);
                }
            });
        } catch (err) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err);
        }
    }
;

/**
 * Campaign Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.campaignDetail =
    function (req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return apiResponse.successResponseWithData(res, "Operation success", {});
        }
        try {
            Campaign.findOne({_id: req.params.id}, "_id").then((campaign) => {
                if (campaign !== null) {
                    let campaignData = new CampaignData(campaign);
                    return apiResponse.successResponseWithData(res, "Operation success", campaignData);
                } else {
                    return apiResponse.successResponseWithData(res, "Operation success", {});
                }
            });
        } catch (err) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err);
        }
    }
;

/**
 * campaign store.
 *
 *
 * @returns {Object}
 */
exports.campaignStore =
    (req, res) => {
        try {
            const errors = validationResult(req);
            const {campaignName, itemCategories, campaignType, minItemCount, discountPrice, numOfDays, discountType, validTill} = req.body
            var campaign = new Campaign({campaignName, itemCategories, campaignType, minItemCount, discountPrice, numOfDays, discountType, validTill})

            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }
            else {
                //Save book.

                campaign.save(function (err) {
                    if (err) {

                        return apiResponse.ErrorResponse(res, err);
                    }
                    let campaignData = new CampaignData(campaign);

                    return apiResponse.successResponseWithData(res, "Campaign add Success.", campaignData);
                });
            }
        } catch (err) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err);
        }
    }

/**
 * Campaign update.
 *
 *
 * @returns {Object}
 */
exports.campaignUpdate =
    (req, res) => {
        try {
            const errors = validationResult(req);
            console.log("测试重要新")

            const {campaignName, itemCategories, campaignType, minItemCount, discountPrice, numOfDays, discountType, validTill, id} = req.body
            var campaign = new Campaign({campaignName, itemCategories, campaignType, minItemCount, discountPrice, numOfDays, discountType, validTill, _id:id})


            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }
            else {
                if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                    return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
                } else {
                    Campaign.findById(req.params.id, function (err, foundCampaign) {
                        if (foundCampaign === null) {
                            return apiResponse.notFoundResponse(res, "Campaign not exists with this id");
                        } else {
                            //update book.
                            Campaign.findByIdAndUpdate(req.params.id, campaign, {}, function (err) {
                                if (err) {
                                    console.log("我的测试", req.params.id, campaign)
                                    return apiResponse.ErrorResponse(res, err);
                                } else {
                                    let campaignData = new CampaignData(campaign);
                                    return apiResponse.successResponseWithData(res, "campaign update Success.", campaignData);
                                }
                            });

                        }
                    });
                }
            }
        } catch (err) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err);
        }
    }

/**
 * Campaign Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.campaignDelete =
    function (req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
        }
        try {
            Campaign.findById(req.params.id, function (err, foundCampaign) {
                if (foundCampaign === null) {
                    return apiResponse.notFoundResponse(res, "Campaign not exists with this id");
                } else {

                    //delete book.
                    Campaign.findByIdAndRemove(req.params.id, function (err) {
                        if (err) {
                            return apiResponse.ErrorResponse(res, err);
                        } else {
                            return apiResponse.successResponse(res, "Campaign delete Success.");
                        }
                    });

                }
            });
        } catch (err) {
            //throw error in json response with status 5
            // 00.
            return apiResponse.ErrorResponse(res, err);
        }
    }
;