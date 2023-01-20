const { writeData } = require('./updateStep');


module.exports =  {

    // Interpret user response -> return the step number (int)
    selectStep: function(userNum) {
        
        // If this is not overwritten than -1 means bad input
        let stepNum = -1;
        const numbers = ["one", "two", "three", "four", "five", "six", "seven"];
        
        numbers.forEach((num, index) => {
            if(num === userNum.trim()){
                stepNum = index + 1;
            }
        });
        return stepNum;
    },

    // Set the current step based on param, update step.txt to new step
    setStep: async function(stepNum) {

        if(stepNum == -1)
            return -1;

        await writeData("../controllers/step/step.txt", stepNum.toString());
        return stepNum;

    }

}