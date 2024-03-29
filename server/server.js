const express = require('express');
const bodyParser = require('body-parser');
const { response, intent } = require('../controllers/response/createResponse');
const app = express();

// parse application/json
app.use(bodyParser.json());

app.post('/', async (req, res) => {

  // Intent recieved from the user
  let userIntent = req.body.queryResult.fulfillmentText;

  // The query from the user
  let query = req.body.queryResult.queryText;
  query = '\"' + query + '\"';

  // THIS IS FOR SELECT STEP EXCLUSIVLY
  // Gets the last word spoken from the user intent
  let param = req.body.queryResult.parameters;
  let stepNum = param.hasOwnProperty('stepnumber') ? param.stepnumber : "";

  // Get a the step 'text' and image 'url'
  let stepIntentInfo = await intent(userIntent, stepNum, query);

  // Format response and send it 
  res.send(response(stepIntentInfo.text, stepIntentInfo.url));
});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});


// Just some notes and stuff
/*

  BASIC RESPONSE FOR DIALOGFLOW
  {
    "fulfillmentText": "This is the text that will be spoken or displayed to the user",
    "fulfillmentMessages": [
        {
            "text": {
                "text": [
                    "This is an additional message that will be spoken or displayed to the user"
                ]
            }
        }
    ],
    "source": "example.com",
    "payload": {
        "google": {
            "expectUserResponse": true,
            "richResponse": {
                "items": [
                    {
                        "simpleResponse": {
                            "textToSpeech": "This is the text that will be spoken to the user",
                            "displayText": "This is the text that will be displayed to the user"
                        }
                    }
                ]
            }
        }
    },
    "outputContexts": [
        {
            "name": "context name",
            "lifespanCount": 5,
            "parameters": {
                "param1": "value1",
                "param2": "value2"
            }
        }
    ],
    "followupEventInput": {
        "name": "event name",
        "languageCode": "en-US",
        "parameters": {
            "param1": "value1",
            "param2": "value2"
        }
    }
  }

  RESPONSE CARD (USE FOR SENDING IMAGES)
  {
    "fulfillmentMessages": [
      {
        "card": {
          "title": "Title of the Card",
          "subtitle": "Subtitle of the Card",
          "imageUri": "https://example.com/image.jpg",
          "buttons": [
            {
              "text": "Button text",
              "postback": "https://example.com"
            }
          ]
        }
      }
    ]
  }

  EXAMPLE OF A REQUEST
  {
    responseId: '686f1ce3-37a8-4e7d-b2af-aab6ea3121cd-1b6a75ff',
    queryResult: {
      queryText: 'hi',
      action: 'input.welcome',
      parameters: {},
      allRequiredParamsPresent: true,
      fulfillmentText: '1',
      fulfillmentMessages: [ [Object] ],
      outputContexts: [ [Object] ],
      intent: {
        name: 'projects/collector-iahl/agent/intents/eda06ee3-d8c6-4b94-9468-86556389e978',
        displayName: 'Default Welcome Intent'
      },
      intentDetectionConfidence: 1,
      languageCode: 'en',
      sentimentAnalysisResult: { queryTextSentiment: [Object] }
    },
    originalDetectIntentRequest: { source: 'DIALOGFLOW_CONSOLE', payload: {} },
    session: 'projects/collector-iahl/agent/sessions/06dea756-0f16-135e-bd08-733237378e6d'
  }
*/


