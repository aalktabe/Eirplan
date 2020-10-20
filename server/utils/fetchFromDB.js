const Event = require('../api/models/event');
// const parseXML = require('xml-parse-from-string');
// const stringify = require('xml-stringify');
// var DOMParser = require('xmldom').DOMParser;


function streamToString (stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
}
  
async function getKeyWords (eventId = 0){
    let event = await Event.findOne();
    if(!event || event.length === 0){
        return { 
        status : '404',
        err : 'Error: event does not exist'
        };
    }
    let keywords = [];
    for (floor of event.plan.floors){
        keywords = keywords.concat(floor.keywords);
    }
    if(!keywords || keywords.length === 0){
        return { 
        status : '404',
        err : 'Error: keywords do not exist'
        };
    }
    return { 
        status:'200',
        data: keywords
    };
}
  
  
async function getLogos(gfs_event_logo, gfs_host_logo, eventId=0){
    eventLogo = await gfs_event_logo.files.findOne();
    if(!eventLogo || eventLogo.length === 0){
      return { 
        status : '404',
        err : 'Error: Event logo does not exist'
      };
    }
  
    const eventLogoStream = gfs_event_logo.createReadStream(eventLogo.filename);
    const eventLogoData = await streamToString(eventLogoStream);
  
    hostLogo = await gfs_host_logo.files.findOne();
    if(!hostLogo || hostLogo.length === 0){
      return { 
        status : '404',
        err : 'Error: Host logo does not exist'
      };
    }
  
    return { 
      status:'200',
      eventLogo: eventLogoData,
      hostLogo: hostLogo
    };
}
  
async function getFloors(gfs_floors, eventId=0){
    files = await gfs_floors.files.find().toArray();
    
    if(!files || files.length === 0){
      return { 
        status : '404',
        data : 'No floors exist'
      };
    }
    
    let data = []
    for (const file of files) {
      try {
        if(file && file.length != 0){
          // console.log(file.filename);
          const readstream = gfs_floors.createReadStream(file.filename);
          file.stringData = await streamToString(readstream);
          data.push(file);
        }
      } catch (error) {
        console.log(error)
      }
    }
  
    return { 
      status:'200',
      data : data
    };
}

exports.getKeyWords = getKeyWords;
exports.getLogos = getLogos;
exports.getFloors = getFloors;