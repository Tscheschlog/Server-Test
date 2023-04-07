// functions for 'reading' step.txt and 'writing' to step.txt
const { readData, writeData, appendData } = require('../update/updateText');
const { selectStep, setStep } = require("../step/selectStep");

// Project 1 = true, Project 2 = false
let proj = true;

// This is the full list of all the steps and image urls
const stepList = proj ? {
  1:  {text: "First, connect the beam B3 and the two A6 angles by using 6 bolts of 5/8 inch diameter. Here is a hint: First tight a bolt at the top first, and then at the bottom on the opposite side. Then tight the rest of the bolts in any order. Put washer only on the nut side and tight the bolts by hand.", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842338/asm_1/A1S1_k8tpxj.png"},
  2:  {text: "Connect beam S4 and the two A9 angles by using 2 bolts of 1/2 inch diameter. Remember to put washers on both sides of the bolts and tight bolts by hand.",url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842338/asm_1/A1S2_werb4q.png"},
  3:  {text: "Now, you will connect the B3 subassembly to the main column C1. Use 3 bolts with 5/8 inch diameter on both sides and tighten by hand. Remember to put the washer only on the nut side." ,url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842338/asm_1/A1S3_yedg5r.png"},
  4:  {text: "You will now connect the beam S4 to the column. Use 2 bolts with 1/2 inch diameter on both sides of the angles to connect to the column C1. Put washers on both sides of the bolts.", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842338/asm_1/A1S4_ekllyf.png"},
  5:  {text: "For the bolts placed in the previous step, adjust the torque wrench to 10 pounds per feet and tight the bolts to a quarter of a turn.", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842338/asm_1/A1S5_dvkbkm.png"},
  // 5:  {text: "Lastly, adjust the torque wrench to 10 pounds per feet and tight the bolts to a quarter of a turn.", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842338/asm_1/A1S5_dvkbkm.png"},
} : {
  1: {text: "First, connect the beam B8 to the column C4 by using 6 bolts of 5/8 inch diameter. Support the top 2 bolts on each side with the plate 2. Remember: Washers go only on the nut side and tighten the bolts by hand.", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842347/asm_2/A2S1_w1rovc.png"},
  2: {text: "Connect PS3 to the beam B-8 by using 2 bolts of half an inch diameter. Remember to put washers on both sides and place the head of the bolts on the PS3 side." , url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842347/asm_2/A2S2_jya10h.png"},
  3: {text: "To connect PS3 and B8, put a washer on both sides of the bolts and tighten the bolts with the torque wrench to 10 pounds per foot. Only tighten a quarter of a turn", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842347/asm_2/A2S3_vi4crr.png"},
  4: {text: "Connect P2 and PS3 with two bolts half an inch in diameter. Put washer on both sides of the bolt and tight by hand", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842347/asm_2/A2S4_tf8fpv.png"},
  5: {text: "To connect PB-7, connect the bottom 5/8 inch bolt to the beam B-8, but do not tight it completely. Then, connect Pb-7 to P-2 with another 5/8 inch bolt, and tight it completely by hand. Remember to put washers only on the nut side.", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842347/asm_2/A2S5_khftom.png"},
  // 5: {text: "Connect PB7 to the beam B-8 with 1 bolt of 5/8-inch diameter. Then, put a washer only on the nut side and do not tight this bolt completely. Then connect PB7 and P2 with 1 bolt of 5/8 diameter. Put a washer only on the nut side. Then tight both bolts completely.", url: "https://res.cloudinary.com/djpg8rwkv/image/upload/v1674842346/asm_2/A2S5_khftom.png"},
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
  intent: async function(req, stepNum, query) {

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
        if(currStep == 5) {
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

        // If not, give the user the previous step
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
        else if(currStep == -2) {
          res = {text: "You've completed all the steps for assembly, is there anything else I can help with?", url: ""};
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
        res = {text: "Here is the help you need\u200B\u200B\u200B\u200B\u200B", url: ""};
        break;

      // Unhandled Input Intent ----------------------------------------------------------------------------------------------------
      default:
        intent = "Unhandled input";
        res = {text: req, url: ""};
        break;
                  
    }

    // Get time of recieced user Intent & Format the information being logged
    let time  = new Date().toLocaleTimeString();
    let currentLog = "Time: " + time + "\nIntent: " + intent + "\nUser Query: " + query + "\nSystem Res: " + "\"" + res.text + "\"" +  "\nCurrent Step: " + currStep + "\n- - - - - - - - - - - - - - - - - - - -\n";

    // Log the user Intent & Print to Server console for testing
    await appendData("../resources/history/logs.txt", currentLog);
    console.log(currentLog);

    // Return the response to the user
    return res;
    
  },
}

/*

  Track Errors
  Questions asked but not handled



*/
