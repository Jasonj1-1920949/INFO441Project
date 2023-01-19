import express from 'express';
var router = express.Router();
import cache from 'memory-cache'
import mongoose from 'mongoose';

// Get a user's itineraries
router.get('/p', async (req, res) => {
  let username = req.query.username;
  try {
    let itineraries = await req.models.Itinerary.find({username: username});
    res.json({itineraries: itineraries});
  } catch (error) {
    res.status("500").json({error: error});
  }
});

// Get itinerary based on preferences.
router.get('/', async function(req, res, next) {
    let session = req.session;
    let body = {
      itinerary_id: req.query.id,
      logistical: {
        location: req.query.location.trim(),
        day: req.query.day.trim(),
        time: req.query.time.trim(),
        budget: req.query.budget.trim()
      },
      preferences: {

      }
    }
    let email = "";
    if (session.isAuthenticated) {
      email = session.account.username;
    }
      try {
        // Get quiz results from request body
        let searchFilter = getEventPreferences(body);
        
        let potentialEvents = await req.models.Event.find(searchFilter);
        let eventData = potentialEvents.map(eventPost => {
          let name = eventPost.name;
          let address = eventPost.address;
          let city = eventPost.city;
          let neighborhood = eventPost.neighborhood;
          let state = eventPost.state;
          let zip = eventPost.zip;
          let categories = eventPost.categories;
          let price = eventPost.price;
          let phone = eventPost.phone;
          let business_img_url = eventPost.business_img_url;
          let hours_of_operation = eventPost.hours_of_operation;
          let id = eventPost._id;
          return {
            name: name,
            address: address,
            city: city,
            neighborhood: neighborhood,
            state: state,
            zip: zip,
            categories: categories,
            price: price,
            phone: phone,
            business_img_url: business_img_url,
            hours_of_operation: hours_of_operation,
            _id: id
          };
      });
        // let eventSet = new Set(eventData);
        const itinerary_id = body.itinerary_id;   
        req.session.current_id = itinerary_id;       
        res.json({
          _id: itinerary_id,
          username: email,
          // TODO: make random
          Event_0: eventData[0],
          Event_1: eventData[1],
          Event_2: eventData[2],
        });
        res.end("Success!");
        } catch (error){
          res.status(500).json({status: "error", error: error});
          res.end("Error!");
        }
});


// Delete itinerary with requested ID
router.delete("/", async (req, res, next) =>{
  // ID of itinerary to delete
  let itinerary_id = req.body.itinerary_id;
  let session = req.session;
  if (session.isAuthenticated) {
    let email = session.account.username;
    // delete itinerary
    try {
      await req.models.Itinerary.deleteOne({_id: itinerary_id, username: email});
      res.json({status: "success"});
    } catch (err) {
      res.status(404).json({error: err})
    }
  } else {
    res.status(401).json({status: "unauthorized"});
  }
});

// Post new itinerary to database under currently logged in user
router.post('/', async (req, res, next) => {
  let session = req.session;
  let body = req.body;
  if (session.isAuthenticated) {
    const newItinerary = new req.models.Itinerary({
      username: session.account.username,
      Event_0: body.Event_0,
      Event_1: body.Event_1,
      Event_2: body.Event_2,
      _id: mongoose.Types.ObjectId(body._id)
    });

    await newItinerary.save();
    res.status(200).json({status: "success"});
  } else {
    res.status(401).json({status: "unauthorized"});
  }
});


router.get("/new_id", async (req, res, next) =>{
  const itinerary_id = new mongoose.Types.ObjectId();
  res.json({itinerary_id: itinerary_id});
});

// Returns relevant preferences to match with event
function getEventPreferences(body) {
  let logisticalResponses = body.logistical;
  let location = logisticalResponses.location;
  let day = logisticalResponses.day;
  let time = logisticalResponses.time;
  let budget = logisticalResponses.budget;
  let searchFilter = {};
  if (location != "any") {
    searchFilter['neighborhood'] = location;
  }
  if (budget != "any") {
    searchFilter['price'] = budget;
  }
  if (time != "any") {
    // searchFilter['hours_of_operation'] = time;
  }
  return searchFilter;
} 

export default router;