import mongoose from 'mongoose';
let COLLECTION = 'nightplanner'
let DATABASE = `mongodb+srv://arjunsrivastava01:arjunsrivastava01@info441.o2o9t.mongodb.net/${COLLECTION}?retryWrites=true&w=majority` // MongoDB url
let models = {};

main();

async function main() {
    // MongoDB database url
    await mongoose.connect(DATABASE);
    console.log('connected to mongodb database: ' + COLLECTION);

    // User information
    const UserSchema = new mongoose.Schema({
        email: String,
        first_name: String,
        last_name: String,
        phone_number: String,
        last_updated: Date,
    });

    const User = mongoose.model('User', UserSchema);
    models.User = User;

    // Event
    const EventSchema = new mongoose.Schema({
        name: String,
        address: String,
        city: String,
        neighborhood: String,
        state: String,
        zip: String,
        categories: [String],
        price: Number,
        phone: String,
        business_img_url: String,
        hours_of_operation: String
    });

    const Event = mongoose.model('Event', EventSchema);
    models.Event = Event;

    // Itinerary
    const ItinerarySchema = new mongoose.Schema({
        username: String,
        created_date: Date,
        Event_0: Object,
        Event_1: Object,
        Event_2: Object,
    });

    const Itinerary = mongoose.model('Itinerary', ItinerarySchema);
    models.Itinerary = Itinerary;
}


export default models;