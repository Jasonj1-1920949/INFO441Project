import express from 'express';
var router = express.Router();
import cache from 'memory-cache'

/*
Response format:
JSON
{
  "first_name": String,
  "last_name": String,
  "phone_number": String,
  "email": String,
}
*/
// Get display information of user
router.get('/myprofile', async function(req, res, next) {
  let session = req.session
  if (session.isAuthenticated) {
    try {
      let email = req.session.account.username;
      let name = req.session.account.name

      // Send relevant information as JSON for frontend to use (include itinerary IDs!)
      res.json({
        status: "loggedin",
        userInfo: {
          name: name,
          email: email
      }
      });
    } catch (err) {
      res.status(500).json({status: "User not found", error: err})
    }
  } else {
    res.json({status: "loggedout"});
  }
});

// Get display information of user
router.get('/', async function(req, res, next) {
    let email = req.query.user;
    try {
      // Get user information
      let userInfo = await req.models.User.findOne({email: email});
      
      // Get itineraries
      let itineraries = await req.models.Itinerary.find({username: email});

      // Send relevant information as JSON for frontend to use (include itinerary IDs!)
      res.json({
        userInfo: {
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          phone_number: userInfo.phone_number,
          email: userInfo.email,
          itineraries: itineraries
      }
      });
    } catch (err) {
      res.status(500).json({status: "User not found", error: err})
    }
  
});

/*
Expected request format:
JSON
{
  "first_name": String,
  "last_name": String,
  "phone_number": String,
  "email": String,
}
*/
// Create new account
router.post('/new', async function(req, res, next) {
  let session = req.session;
  let body = req.body;
  let first_name = body.first_name;
  let last_name = body.last_name;
  let phone_number = body.phone_number;
  let email = body.email;

  if(!session.isAuthenticated) {
    // Add new account to database
    try {
      // Create and save new user
      const newUser = new req.models.User({
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        email: email
      });
      await newUser.save()
      res.json({status: "success"});
    } catch (error ){
      res.status(500).json({status: "failure", error: error});
    } 
  } else {
    res.json({status: "failure", error: "Logged in user cannot create new account"});
  };
});

// Find the currently logged in user information from the session and remove the user and their itineraries from the database
router.delete("/", async (req, res, next) =>{
  let session = req.session;
  if (session.isAuthenticated) {
    try {
      let email = req.session.account.username;
      // delete the user and associated itineraries
      await req.models.Itinerary.deleteMany({username: email});
      await req.models.UserInfo.deleteOne({email: email});
      res.json({status: "success"});
    } catch (error) {
      res.status(500).json({error: error});
    }
  } else {
    res.status(401).json({status: "unauthorized"});
  }
});

export default router;
