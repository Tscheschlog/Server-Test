const { writeData } = require('../update/updateText');


module.exports =  {

    // Interpret user response -> return the step number (int)
    selectStep: function(userNum) {
        
        // If this is not overwritten than -1 means bad input
        let stepNum = -1;
        const numbers = ["one", "1", "two", "2", "three", "3", "four", "4", "five", "5", "six", "6", "seven", "7"];
        
        numbers.forEach((num, index) => {
            if(num === userNum.trim()){
                if(index % 2 == 0)
                    stepNum = parseInt(numbers[index + 1]);
                else
                    stepNum = parseInt(numbers[index]);
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