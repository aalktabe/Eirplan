const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');


const localizedKeywordsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    name: String,
    desc: String,
    path: String,
});

const floorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, unique: true},
    viewBox: String,
    label: String,
    locations: [localizedKeywordsSchema]
});
floorSchema.plugin(mongooseUniqueValidator);


const planSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    floors: [floorSchema]
});

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : String,
    logoEvent : String,
    logoHost : String,
    plan: planSchema
});

module.exports = mongoose.model('Event', eventSchema);