const Listing = require("../models/listing");
const Review = require("../models/reviws");
module.exports.createReview = async function (req, res, next) {
  let listing = await Listing.findById(req.params.id);
  let newrev = new Review(req.body.review);
  listing.reviews.push(newrev);
  await newrev.save();
  await listing.save();
  req.flash("success", "Review Created successfully");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Delete successfully");
  res.redirect(`/listings/${id}`);
};
