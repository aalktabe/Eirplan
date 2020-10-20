const xmlParser = require('xml2json');
const fs = require('fs');


var svgReader = function(filename) {
    let xmlString = fs.readFileSync(filename, 'utf8');
    return(JSON.parse(xmlParser.toJson(xmlString)));
}


module.exports.svgReader = svgReader;