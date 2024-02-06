const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/reviws.js")
const {reviewSchema} = require("../sechema.js")
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controller/reviews.js")
// validate reviews
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
      throw new ExpressError(400,error)
    }
    else{
      next()
    }
  }
// review route
router.post(
  "/",
  isLoggedIn,
  wrapAsync(listingController.createReview)
);

// delete review
router.post(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(listingController.destroyReview)
);

module.exports = router;
