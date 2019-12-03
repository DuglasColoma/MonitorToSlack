var request = require("request");

var urlWebHook = "https://hooks.slack.com/services/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"; 
//var urlWebHook = ""; 
//the URL you get on your "incoming web hooks" page.

function send(message, theUsername, theIconUrl, theIconEmoji, theChannel) {
	var payload = {
		text: message
		};
	if (theUsername !== undefined) {
		payload.username = theUsername;
		}
	if (theIconUrl !== undefined) {
		payload.icon_url = theIconUrl;
		}
	if (theIconEmoji !== undefined) {
		payload.icon_emoji = theIconEmoji;
		}
	if (theChannel !== undefined) {
		payload.channel = theChannel;
		}
	var theRequest = {
		url: urlWebHook,
		method: "POST",
		json: payload
		};
	request(theRequest, function (error, response, body) {
		if (!error && (response.statusCode == 200)) {
			console.log ("sendToSlack: " + message);
			}
		else {
			console.log ("sendToSlack: error, code == " + response.statusCode + ", " + response.body + ".\n");
			}
		});
	}
module.exports = {send};