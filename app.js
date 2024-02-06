if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const app = express();
const flash = require("connect-flash")
const session = require("express-session")
const MongoStore = require('connect-mongo')
const ExpressError = require("./utils/ExpressError.js")
const dbUrl = process.env.ATLASDB_URL;
const Review = require("./models/reviws.js")
app.use(express.static(path.join(__dirname,"/public")))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
const listing = require("./routes/list.js")
const reviews = require("./routes/review.js")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
const userRouter = require("./routes/User.js")
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:"MyScreat",
  },
  touchAfter:24*3600
})

store.on("error",()=>{
  console.log("Error in MONGO Session store")
})
// session used 
const sessionOpt = {
  store,
  secret:"MyScreat",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 *1000,
    maxAge: 7 * 24 * 60 * 60 *1000,
    httpOnly:true,
  }
}


app.use(session(sessionOpt));
app.use(flash());

// passport implentation
app.use(passport.initialize());
app.use(passport.session())  // it used same user on diffrent pages 
passport.use(new LocalStrategy(User.authenticate())) // check user for locals
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.currUser = req.user;
  res.locals.error = req.flash("error");
  next();
})

app.use("/listings",listing)
app.use("/listings/:id/reviews",reviews)
app.use("/",userRouter)
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"))
})
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something Went Wrong"} = err;
  res.status(statusCode).render("error",{message})
  
})
app.listen(8080, () => {
  console.log(`Server listen on port 8080`);
});
