const express = require("express");
const wrapAsync = require("../utils/wrapasync.js");
const router = express.Router();
const { listingSchema, reviewSchema } = require("../sechema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listings.js")
const multer = require("multer");
const limits = {fileSize:1000*1000 *4}
const {storage} = require("../cloudeConfig.js");
const upload = multer({storage,limits})
// validate listing
const validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validatelisting,
  wrapAsync(listingController.createListing)
)
// create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);
// show routes
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);
// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validatelisting,
  wrapAsync(listingController.updataeListing)
);
// delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);
module.exports = router;
