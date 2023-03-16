# Test Server

## Steps to Start
* Start the Express server
  * From the Server-Test Directory
  * <code>cd server</code>
  * <code>node .\server.js</code>
* Run ngrok
  * Open commande prompt
  * <code>ngrok http 3000</code>
* Add the ngrok address to the Dialogflow fulfillment
  * address: "http://some.address.ngrok.io/"
  * Be sure to include the '/'
  