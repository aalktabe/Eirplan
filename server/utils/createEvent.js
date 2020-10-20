const mongoose = require('mongoose');
const xmlParser = require('xml2json');
const Event = require('../api/models/event');
// const xmlToFloor = require('./xmlToFloorSchema');

var xmlToFloor =function ( xmlFloorString, fileName = "" ) {

    let JsonString = JSON.parse(xmlParser.toJson(xmlFloorString));
    // console.log(JsonString.svg.g.path);
    let Stands;

    if (JsonString.svg.g.path) {
        Stands = JsonString.svg.g.path;
    } else {
        if (JsonString.svg.g.g.path) {
            Stands = JsonString.svg.g.g.path;
        } else {
            console.log("xmlToFloor: Error can't find path object in svg" + fileName);
        }
    }
    

    // console.log('stands', Stands);
    
    var floorMap = {
        label: fileName,
        viewBox : JsonString.svg.viewBox,
        locations: []
    };

    // floorMap.viewBox = JsonString.svg.viewBox;
    // floorMap.label = fileName;

    for (const item of Stands) {
        var stand = {}
        if(item.desc){
            stand = {
                id: item.id,
                name: item.id,
                path: item.d,
                desc: item.desc.$t
            };
        } else {
            stand = {
                id: 'wall',
                name: 'wall',
                path: item.d,
                desc: ''
            };
        }
        floorMap.locations.push(stand);
        
    }
    
    return (floorMap);
}

var createEvent = function(eventName='', hostName='', eventID, hostID, floorXmls, fileNames){
    let floors = [];

    for (let index = 0; index < floorXmls.length; index++) {
        floors.push(xmlToFloor(floorXmls[index], fileNames[index]));    
    }
    
    var plan = {
        name: hostName,
        floors: floors
    }
    
    var event = new Event ({
        _id: new mongoose.Types.ObjectId(),
        name: eventName,
        logoEventID: eventID,
        logoHostID: hostID,
        plan: plan
    });

    return(event);
}

module.exports = createEvent;
