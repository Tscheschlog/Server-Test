// functions for 'reading' step.txt and 'writing' to step.txt
const { readData, writeData, appendData } = require('../update/updateText');
const { selectStep, setStep } = require("../step/selectStep");

// Project one = true, Project 2 = false
let proj = true;

// This is the full list of all the steps and image urls
const stepList = proj ? {
  1:  {text: "First, you need to get tools. These are located in the Red Container near the entrance door.", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247412/step1_e5o7j5.jpg"},
  2:  {text: "After getting the tools, you need to get materials for the beam B-3 subassembly. This material is in the Blue Container that is located near the exit door.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247674/step2_bsy9t5.jpg"},
  3:  {text: "Connect the beam B-3 and the two A-6 angles by using 6 bolts of 5/8 inch diameter. Here is a tip: place the bolts in opposite sides starting from the top and put one washer on the nut side. Tight the bolts by hand.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247677/step3_dt3vza.jpg"},
  4:  {text: "Now, you need to get materials for the other beam subassembly, S-4. This material is located in the Yellow container that is near the sink.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674251153/Step_4_u79n1c.png"},
  5:  {text: "Connect beam S-4 and the two A-8 angles by using 2 bolts of half inch diameter. Remember to put washers on both sides of the bolts. Then, adjust the torque wrench to 10 pounds per feet and tight the bolts to quarter of a turn.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674251150/Step_5_o9gtzi.png"},
  6:  {text: "Now you will connect the B-3 subassembly to the main column C-1. Use 3 bolts with 5/8 inch diameter on both sides and tighten by hand. Remember to put the washer only on the nut side.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247685/step6_awbkvk.jpg"},
  7:  {text: "You will now connect the beam S-4 to the column. Use 2 bolts with 1/2 inch dimensions on both sides of the angles to connect to the C-1 column. Put washers on both sides of the bolts. Lastly, adjust the torque wrench to 10 pounds per feet and tight the bolts to a quarter of a turn. This is the last step.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674247687/step7_erjrve.jpg"},
} : {
  1: {text: "Step 1", url: ""},
  2: {text: "Step 2", url: ""},
  3: {text: "Step 3", url: ""},
  4: {text: "Step 4", url: ""},
  5: {text: "Step 5", url: ""},
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
  intent: async function(req, stepNum = "") {

    // The response that will be returned to the user
    let res;

    // Intent variable for logging purposes
    let intent;

    // The current step the User is on
    currStep = await readData("../controllers/step/step.txt");

    switch(parseInt(req)){

      // Welcome intent -----------------------------------------------------------------------------------------------------
      case 1:
        intent = "Welcome";
        res = {text: "Hello, how can I help you?", url: ""};
        break;

      // Step intent --------------------------------------------------------------------------------------------------------
      case 2:
        intent = "Step";
        res = stepList[currStep];
        break;

      // Next Step Intent ---------------------------------------------------------------------------------------------------
      case 3:
        intent = "Next Step";

        // Check if they have already reached the last step
        if(currStep == 7) {
          res = {text: "You have completed all the steps for assembly, is there anything else I can help with?", url: ""};
          break;
        }

        // If not, give the user the next step
        currStep = parseInt(currStep) + 1;
        await writeData("../controllers/step/step.txt", currStep.toString());
        res = stepList[currStep];
        break;

      // Go Back Intent ---------------------------------------------------------------------------------------------------
      case 4:
        intent = "Go Back";

        // Check if they have already reached the last step
        if(currStep == 1) {
          res = {text: "There is no step before step one ...", url: ""};
          break;
        }

        // If not, give the user the next step
        currStep = parseInt(currStep) - 1;
        await writeData("../controllers/step/step.txt", currStep.toString());
        res = stepList[currStep];
        break;

      // Select Step Intent --------------------------------------------------------------------------------------------------
      case 5:
        intent = "Select Step";
        currStep = await setStep(selectStep(stepNum));
        if(currStep == -1) {
          res = {text: "Sorry I didn't catch that.", url: ""};
          break;
        }

        res = stepList[currStep];
        break;
      
      // Help intent ---------------------------------------------------------------------------------------------------------
      case 6:
        intent = "Help";
        /**
         * Currently not needed.
         * Keep for testing purposes.
         */
        res = {text: "Here is the help you need ...", url: ""};
        break;

      // Bad Input Intent ----------------------------------------------------------------------------------------------------
      default:
        intent = "Bad Input";
        res = {text: "Sorry I didn't catch that.", url: ""};
        break;
                  
    }

    // Get time of recieced user Intent & Format the information being logged
    let time  = new Date().toLocaleTimeString();
    let currentLog = "Time: " + time + "\nIntent: " + intent + "\nCurrent Step: " + currStep + "\n- - - - - - - - - - - - - - - - - - - -\n";

    // Log the user Intent & Print to Server console for testing
    await appendData("../resources/history/logs.txt", currentLog);
    console.log(currentLog);

    // Return the response to the user
    return res;
    
  },
}
