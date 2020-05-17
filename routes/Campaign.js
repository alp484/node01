var express = require("express");
const Campaign = require("../controllers/CampaignController");

var router = express.Router();

router.get("/", Campaign.campaignList);
router.get("/:id", Campaign.campaignDetail);
router.post("/", Campaign.campaignStore);
router.put("/:id", Campaign.campaignUpdate);
router.delete("/:id", Campaign.campaignDelete);

module.exports = router;