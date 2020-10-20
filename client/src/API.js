import axios from "axios";
const burl = "http://localhost:3008";


export default {
    getEventData: async function(eventData){
        const output = await axios.get(
            burl + "/interactiveDisplay",
            {
                eventData: eventData
            }
        );
        console.log('eventData', output);
        return output;
    },

    getEventLogos: async function(eventLogos){
        const output = await axios.get(
            burl + "/getEventLogos",
            {
                eventLogos: eventLogos
            }
        );
        console.log('eventLogos', output);
        return output;
    },
}