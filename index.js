'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'shazy792resumebot') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

 // Webhook Postaback
 app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text == 'Yolo') {
            sendGenericMessage(messageSuggestions, sender) // Call to Button Message.
            continue
        }
        //sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
      if (event.postback) {
        // No need to stringify since getting payload by JSON!
        //let text = JSON.stringify(event.postback)
        //sendTextMessage(sender, "Recieved Post Back Call Payload= "+text["payload"]+event.postback["payload"], token)
        //sendTextMessage(sender, "Recieved Post Back Call Payload= "+event.postback["payload"], token);
        postbackHandler(sender, token, event.postback)
        continue
      }
    }
    res.sendStatus(200)
  })

const token = process.env.FB_PAGE_TOKEN;

//Function to Handle Postback Calls
function postbackHandler(sender, token, postback){
	console.log(postback["payload"])
	switch (postback["payload"]){
		case 'Education':
			//Card
			sendCardMessage(messageEducation, sender)
		case 'Skills':
			//Button
			sendGenericMessage(messageSkills, sender)
		case 'Experience':
			//Card
		case 'Personal':
			//Card
		case 'Projects':
			//Card
		case 'Achievements':
			//Card
		case 'sx1':
			sendCardMessage(messagePLangs, sender)
		case 'sx2':
			sendCardMessage(messageHBoards, sender)
		case 'sx3':
			sendCardMessage(messageDatabase, sender)

	}

}

// Text Message
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// Text with Buttons
function sendGenericMessage(messageData, sender) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// Card Message
function sendCardMessage(messageData, sender) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

let messageSuggestions = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                    "text": "What would you like to know about me?",
                    "buttons": [{
                        "type": "postback",
                        "title": "Education",
                        "payload": "Education"
                    }, {
                        "type": "postback",
                        "title": "Skills",
                        "payload": "Skills",
                    }, {
                        "type": "postback",
                        "title": "Experience",
                        "payload": "Experience",
                    }],
            }
        }
    }

let messageEducation = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Electrical Engineering",
                    "subtitle": "2019 at Illinois Institute of Technology",
                    //"image_url": "https://www.royalcanin.com/~/media/Royal-Canin/Product-Categories/cat-adult-landing-hero.ashx",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://web.iit.edu/",
                        "title": "My University"
                    }],
                }, {
                    "title": "A Levels",
                    "subtitle": "2015 at The City Schools",
                    //"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://thecityschool.edu.pk/category/central-region/iqbal-campus-sialkot/",
                        "title": "My School",
                    }],
                }]
            }
        }
    }

let messageSkills = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                    "text": "What of my skills would you like to know?",
                    "buttons": [{
                        "type": "postback",
                        "title": "Programming Languages",
                        "payload": "1"
                    }, {
                        "type": "postback",
                        "title": "Hardware Boards",
                        "payload": "2",
                    }, {
                        "type": "postback",
                        "title": "Database Engines",
                        "payload": "3",
                    }],
            }
        }
    }

let messagePLangs = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Java",
                    "image_url": "http://www.greycampus.com/system/courses/JAVA.jpg",
                   	"item_url": "https://en.wikipedia.org/wiki/Java_(programming_language)",
                }, {
                    "title": "Python",
                    "image_url": "https://realpython.com/learn/python-first-steps/images/pythonlogo.jpg",
                    "item_url": "https://en.wikipedia.org/wiki/Python_(programming_language)",
                }, {
                    "title": "Visual Basic .Net/6",
                    "image_url": "https://regmedia.co.uk/2013/11/13/visual_studio.jpg?x=1200&y=794",
                    "item_url": "https://en.wikipedia.org/wiki/Visual_Basic_.NET",
                },{
                    "title": "Android",
                    "image_url": "http://logok.org/wp-content/uploads/2014/06/Android-logo-wordmark.png",
                    "item_url": "https://en.wikipedia.org/wiki/Android_(operating_system)",
                }]
            }
        }
    }

    let messageHBoards = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Arduino",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Arduino_Logo.svg/1280px-Arduino_Logo.svg.png",
                   	"item_url": "https://www.arduino.cc/",
                }, {
                    "title": "Raspberry Pi",
                    "image_url": "http://www.instructables.com/files/orig/FYC/48KX/IJ1TY4LH/FYC48KXIJ1TY4LH.png",
                    "item_url": "https://www.raspberrypi.org/",
                }, {
                    "title": "ESP8266",
                    "image_url": "http://visystem.ddns.net:7442/imagenes/esp8266.png",
                    "item_url": "https://en.wikipedia.org/wiki/ESP8266",
                }]
            }
        }
    }

    let messageDatabase = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Microsoft Access",
                    "image_url": "http://www.accessrepairnrecovery.com/blog/wp-content/uploads/2015/07/Microsoft-Access-Course.jpg",
                   	"item_url": "https://en.wikipedia.org/wiki/Microsoft_Access",
                }]
            }
        }
    }

