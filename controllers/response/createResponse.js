// functions for 'reading' step.txt and 'writing' to step.txt
const { readData, writeData } = require('../step/updateStep');
const { selectStep, setStep } = require("../step/selectStep");

// This is the full list of all the steps
const stepList = {
  1:  "First, you need to get tools. These are located in the Red Container near the entrance door.",
  2:  "After getting the tools, you need to get materials for the beam B-3 subassembly. This material is in the Blue Container that is located near the exit door.",
  3:  "Connect the beam B-3 and the two A-6 angles by using 6 bolts of 5/8 inch diameter. Here is a tip: place the bolts in opposite sides starting from the top and put one washer on the nut side. Tight the bolts by hand.",
  4:  "Now, you need to get materials for the other beam subassembly, S-4. This material is located in the Yellow container that is near the sink.",
  5:  "Connect beam S-4 and the two A-8 angles by using 2 bolts of half inch diameter. Remember to put washers on both sides of the bolts. Then, adjust the torque wrench to 10 pounds per feet and tight the bolts to quarter of a turn.",
  6:  "Now you will connect the B-3 subassembly to the main column C-1. Use 3 bolts with 5/8 inch diameter on both sides and tighten by hand. Remember to put the washer only on the nut side.",
  7:  "You will now connect the beam S-4 to the column. Use 2 bolts with 1/2 inch dimensions on both sides of the angles to connect to the C-1 column. Put washers on both sides of the bolts. Lastly, adjust the torque wrench to 10 pounds per feet and tight the bolts to a quarter of a turn. This is the last step.",
};

// Variable used to store the current step within the switch statement
let currStep;

// Functions exported to 'main.js'
module.exports = {

  // Put the text into a readable format for DialogFlow
  response: function(text) {
    return ({
      "fulfillmentText": text,
    });
  },

  // Determine the intent of the user based on the response we get
  intent: async function(res, stepNum = "") {
    switch(parseInt(res)){

      // Welcome intent -----------------------------------------------------------------------------------------------------
      case 1:
        return "Hello, how can I help you?";

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
          return "You have completed all the steps for assembly, is there anything else I can help with?";

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
          return "There is no step before step one ...";

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
          return "Sorry I didn't catch that.";

        return stepList[currStep];
      
      // Help intent ---------------------------------------------------------------------------------------------------------
      case 6:
        /**
         * Currently not needed.
         * Keep for testing purposes.
         */
        return "Here is the help you need ...";

      // Bad Input Intent ----------------------------------------------------------------------------------------------------
      default:
        return "Sorry I didn't catch that.";
                  
    }
  },
}
