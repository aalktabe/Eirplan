const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Event = require('../models/event');
const XmlReader = require('../../utils/xmlReader');

let svgFile = XmlReader.svgReader('RDC.svg');
let Stands = svgFile.svg.g.g.path;
// console.log('x',Stands.d);

var localizedKeywords = [];
Stands.forEach(function(item) {
    if(item.desc){
        const localKeyword = {
            name: item.id,
            description: item.desc.$t,
            position : item.d
        };
        localizedKeywords.push(localKeyword);
    }
});

var floor1 = {
    name: 'RDC',
    svg: 'xml String here',
    keywords : localizedKeywords
}
var floor2 = {
    name: '1er',
    svg: 'xml String here',
    keywords : localizedKeywords
}

var plan = {
    name: 'ENSEIRB-Matmeca',
    floors: [floor1, floor2]
}

var event = new Event ({
    _id: new mongoose.Types.ObjectId(),
    name: 'Forum Ingénib',
    logoEvent: 'logo Ingénib',
    logoHost: 'logo ENSEIRB',
    plan: plan

});
// console.log(localizedKeywords);

router.get('/', (req, res, next) => {
    res.status(200).json({
        message : "Handeling GET requests to /datas",
    });
});

router.post('/', (req, res, next) => {
    event 
    .save()
    .then(result => {
        console.log(result);
    })
    .catch(err => console.log(err)) ;
    res.status(200).json({
        message : 'Handeling POST requests to /events',
        createdData: event
    });



});

router.get("/:eventId", (req, res, next) => {
    const id = req.params.eventId;
    event.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error :err});
    });
})

// router.post('/:dataId', (req, res, next) => {
//     const id = req.params.dataId,
    
// });
module.exports = router;