'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./const.js');
const Dat = require('./data.js');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Bot actions
const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);

    // Bot testing mode, run cb() and return
    if (require.main === module) {
      cb();
      return;
    }

    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to from context
    const recipientId = context._fbid_;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      //FB.fbMessage(recipientId, message, (err, data) => {
      FB.sendCardMessage(recipientId, message, (err, data) => {
        if (err) {
          console.log(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err
          );
        }

        // Let's give the wheel back to our bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
      // Giving the wheel back to our bot
      cb();
    }
  },
  
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the entities and store it into a context field
    const ques = firstEntityValue(entities, 'question');
    if (ques) {
      context.question = ques;
    }

    cb(context);
  },

  error(sessionId, context, error) {
    console.log(error.message);
  },

  getAnswer(context,cb){

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

    context.answer = messageEducation;

    cb(context);
  }

};


const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}