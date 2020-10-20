const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


const svgToSchemaRoutes = require('./api/routes/svgToSchema');
const storageFunction = require('./utils/storageFunction');
const fetchFromDB = require('./utils/fetchFromDB');
const Event = require('./api/models/event');
const createEvent = require('./utils/createEvent');

const conn = require('./utils/connection');
const mongoURI = 'mongodb+srv://eirplan:eirplan@eirplan.dprmb.mongodb.net/Eirplan?retryWrites=true&w=majority';


var cors = require('cors')
const app = express();

app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_methode'));


let gfs_floors;
let gfs_event_logo;
let gfs_host_logo;


conn.once('open', () => {
    console.log("\nConnected to DB !");
    //Init stream svg
    gfs_floors = Grid(conn.db, mongoose.mongo);
    gfs_floors.collection('floor');

    //Init stream event logo
    gfs_event_logo = Grid(conn.db, mongoose.mongo);
    gfs_event_logo.collection('event_logo');

    //Init stream host logo
    gfs_host_logo = Grid(conn.db, mongoose.mongo);
    gfs_host_logo.collection('host_logo');

    console.log('Created collections');
});

// *************************** Upload SVG to Data Base *****************************************//


const floorStorage = storageFunction('floor', mongoURI);
const eventLogoStorage = storageFunction('event_logo', mongoURI);
const hostLogoStorage = storageFunction('host_logo', mongoURI);

// async function uploadWrapper(req, res) {
//   try{
//     console.log('start try');
//     // console.log('request',req);
//     // await eventLogoStorage.single('file_event_logo');
//     // console.log('event');

//     // await hostLogoStorage.single('file_host_logo');
//     // console.log('host');
//     await floorStorage.array(req.body.file_floor);
//     console.log('file floor');

//     res.redirect('/');
//     res.end('done');

//   } catch(err) {
//     console.log('Post error:', err)
//   }
// }

async function getEventLogos (req, res){
  try {
    let logos = await fetchFromDB.getLogos(gfs_event_logo, gfs_host_logo);


    if (logos.status === 404) {
      errMsg = 'Error while fetching Logos from database'
        + 'logos.status: ' + logos.status;
      throw new Error(errMsg);
    }

    var eventLogos = {
      eventLogo: logos.eventLogo,
      hostLogo: logos.hostLogo
    }
    return(res.status(200).json(eventLogos));

  } catch (error) {
    console.log(error);
    return res.status(404).json({err:'Oops, there was an error while fetching event Logos!'})
  }
}

createEventCallBack = async function (){
  try{

  let floors = await fetchFromDB.getFloors(gfs_floors);
  let logos = await fetchFromDB.getLogos(gfs_event_logo, gfs_host_logo);
  let eventName = 'Ingénib';
  let hostName = 'Enseirb-Matmeca';

  let floorXmls = []
  let fileNames = []
  for (const floor of floors.data) {
    floorXmls.push(floor.stringData);
    fileNames.push(floor.filename);
  }
// console.log('create event params',eventName, hostName, logos.eventLogo._id, logos.hostLogo._id, floorXmls, fileNames);
  event = createEvent(eventName, hostName, logos.eventLogo._id, logos.hostLogo._id, floorXmls, fileNames);
  console.log(event);
  return (event);
} catch(err){
  console.log(err);
}
}



// app.get('/interactiveDisplay', getFloors);
app.get('/getEventLogos', cors(), getEventLogos);

app.get('/interactiveDisplay', cors(), (req, res) => {
  Event.findOne({}, (err, file) => {
    if(!file || file.length === 0 ){
      return res.status(404).json({
        err : 'No file exists'
      });
    }
    return res.json(file);
  });
});

// @route GET /
// @desc Loads form
app.get('/', (req, res) => {
  console.log("you are in /")
  gfs_floors.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('index', { files: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/svg+xml' || file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('index', { files: files });
      }
    });
});

app.post('/floors',floorStorage.array('file_floor'),(req,res) =>{
  res.redirect('/');
});
app.post('/eventLogo',eventLogoStorage.single('file_event_logo'),(req,res) =>{
  res.redirect('/');
});

app.post('/hostLogo',hostLogoStorage.single('file_host_logo'),(req,res) =>{
  res.redirect('/');
});

app.post('/createEvent', async (req, res, next) =>  {
  try{

  let event = await createEventCallBack();
  console.log(event);

  event 
  .save()
  .then(result => {
    console.log(result);
    // res.status(200).json({
    //   message : 'Successfuly created /events table',
    //   createdData: event
    // });
    res.redirect('/');
  })
  .catch(err => console.log(err)) ;

 
  }catch(err){
    console.log(err);
  }
})


app.use('/svgToSchema', svgToSchemaRoutes);


// // @route GET /files
// // @desc Display all files in JSON
// app.get('/files', (req, res) => {
//   gfs_floors.files.find().toArray((err, files) => {
//       if(!files || files.length === 0){
//           return res.status(404).json({
//               err : 'No files exist'
//           });
//       }

//       return res.json(files);
//   });
// });


// // @route GET /file/:filename
// // @desc Display one file in JSON
// app.get('/files/:filename', (req, res) => {
//   gfs_floors.files.findOne({filename : req.params.filename}, (err, file) => {
//       if(!file || file.length === 0 ){
//           return res.status(404).json({
//               err : 'No file exists'
//           });
//       }
//       return res.json(file);
//   });
// });


// // @route GET /Image/:filename
// // @desc Display one file in JSON
// app.get('/image/:filename', (req, res) => {
//   gfs_floors.files.findOne({filename : req.params.filename}, (err, file) => {
//     if(!file || file.length === 0 ){
//         return res.status(404).json({
//             err : 'No file exists'
//         });
//     }
//     //check if image
//     if(file.contentType === 'image/svg+xml'){
//         //Read output tp browser
//         const readstream = gfs_floors.createReadStream(file.filename);
//         console.log('File',file);
//         readstream.pipe(res);
        
//     } else {
//         res.status(404).json({
//             err : 'Not an SVG'
//         });
//     }      
//   });
// });

// // @route DELETE /files/:id
// // @desc Delete file
// app.delete('/files/:id', (req, res) => {
//   gfs_floors.remove({_id: req.params.id, root: 'floor'}, (err, gridStore) => {
//       if (err){
//           return res.status(404).json({err: err});
//       }
//       res.redirect('/');
//   });
// });


// // @route DELETE /image/:id
// // @desc Delete file
// app.delete('/image/:id', (req, res) => {
//   gfs_floors.remove({_id: req.params.id, root: 'floor'}, (err, gridStore) => {
//       if (err){
//           return res.status(404).json({err: err});
//       }
//       res.redirect('/');
//   });
// });

// app.get('/download', function(req, res){
//   const file = `${__dirname}/upload-folder/`;
//   res.download(file); // Set disposition and send it.
// });


// ****************************************************************************** //




// app.use((req, res, next) => {
//     const error = new Error('Not found');
//     error.status(404);
//     next(error);
// });

// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({
//         error: {
//             message: error.message,
//         }
//     });
// });

// exports.getEventData = getEventData;
module.exports = app;