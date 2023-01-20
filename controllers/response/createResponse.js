// functions for 'reading' step.txt and 'writing' to step.txt
const { readData, writeData } = require('../step/updateStep');
const { selectStep, setStep } = require("../step/selectStep");

// This is the full list of all the steps and image urls
const stepList = {
  1:  {text: "First, you need to get tools. These are located in the Red Container near the entrance door.", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247412/step1_e5o7j5.jpg"},
  2:  {text: "After getting the tools, you need to get materials for the beam B-3 subassembly. This material is in the Blue Container that is located near the exit door.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247674/step2_bsy9t5.jpg"},
  3:  {text: "Connect the beam B-3 and the two A-6 angles by using 6 bolts of 5/8 inch diameter. Here is a tip: place the bolts in opposite sides starting from the top and put one washer on the nut side. Tight the bolts by hand.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247677/step3_dt3vza.jpg"},
  4:  {text: "Now, you need to get materials for the other beam subassembly, S-4. This material is located in the Yellow container that is near the sink.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247680/step4_g2rkor.jpg"},
  5:  {text: "Connect beam S-4 and the two A-8 angles by using 2 bolts of half inch diameter. Remember to put washers on both sides of the bolts. Then, adjust the torque wrench to 10 pounds per feet and tight the bolts to quarter of a turn.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247682/step5_b7n30m.jpg"},
  6:  {text: "Now you will connect the B-3 subassembly to the main column C-1. Use 3 bolts with 5/8 inch diameter on both sides and tighten by hand. Remember to put the washer only on the nut side.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247685/step6_awbkvk.jpg"},
  7:  {text: "You will now connect the beam S-4 to the column. Use 2 bolts with 1/2 inch dimensions on both sides of the angles to connect to the C-1 column. Put washers on both sides of the bolts. Lastly, adjust the torque wrench to 10 pounds per feet and tight the bolts to a quarter of a turn. This is the last step.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247687/step7_erjrve.jpg"},
};

// Variable used to store the current step within the switch statement
let currStep;

// Functions exported to 'main.js'
module.exports = {

  // Put the text into a readable format for DialogFlow
  response: function(text, imgURL = "") {
    return ({
      "payload": {
        "google": {
          "expectUserResponse": true,
          "richResponse": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": text
                }
              },
              {
                "basicCard": {
                  "image": 
                  {
                    "url": imgURL,
                    "accessibilityText": ""
                  },
                }
              }
            ]
          }
        }
      }
    });
  },

  // Determine the intent of the user based on the response we get
  intent: async function(res, stepNum = "") {
    switch(parseInt(res)){

      // Welcome intent -----------------------------------------------------------------------------------------------------
      case 1:
        return {text: "Hello, how can I help you?", url: ""};

      // Step intent --------------------------------------------------------------------------------------------------------
      case 2:
        currStep = await readData("../controllers/step/step.txt");
        console.log("Current Step: " + currStep);
        return stepList[currStep];

      // Next Step Intent ---------------------------------------------------------------------------------------------------
      case 3:
        currStep = await readData("../controllers/step/step.txt");

        // Check if they have already reached the last step
        if(currStep == 7)
          return {text: "You have completed all the steps for assembly, is there anything else I can help with?", url: ""};

        // If not, give the user the next step
        currStep = parseInt(currStep) + 1;
        await writeData("../controllers/step/step.txt", currStep.toString());
        console.log("Current Step: " + currStep);
        return stepList[currStep];

      // Go Back Intent ---------------------------------------------------------------------------------------------------
      case 4:
        currStep = await readData("../controllers/step/step.txt");

        // Check if they have already reached the last step
        if(currStep == 1)
          return {text: "There is no step before step one ...", url: ""};

        // If not, give the user the next step
        currStep = parseInt(currStep) - 1;
        await writeData("../controllers/step/step.txt", currStep.toString());
        console.log("Current Step: " + currStep);
        return stepList[currStep];


      // Select Step Intent --------------------------------------------------------------------------------------------------
      case 5:
        currStep = await setStep(selectStep(stepNum));
        console.log("Step Interpreted: " + currStep);
        if(currStep == -1)
          return {text: "Sorry I didn't catch that.", url: ""};

        return stepList[currStep];
      
      // Help intent ---------------------------------------------------------------------------------------------------------
      case 6:
        /**
         * Currently not needed.
         * Keep for testing purposes.
         */
        return {text: "Here is the help you need ...", url: ""};

      // Bad Input Intent ----------------------------------------------------------------------------------------------------
      default:
        return {text: "Sorry I didn't catch that.", url: ""};
                  
    }
  },
}
