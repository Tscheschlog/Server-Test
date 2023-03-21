const { writeData } = require('../update/updateText');


module.exports =  {

    // Interpret user response -> return the step number (int)
    selectStep: function(userNum) {
        
        let userIndex = parseInt(userNum) < 6 ? parseInt(userNum) : -2;
        return userIndex;

    },

    // Set the current step based on param, update step.txt to new step
    setStep: async function(stepNum) {

        if(stepNum == -1)
            return -1;

        await writeData("../controllers/step/step.txt", stepNum.toString());
        return stepNum;

    }

}