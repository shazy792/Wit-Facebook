'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./const.js');

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
      FB.fbMessage(recipientId, message, (err, data) => {
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

  // Bot Executions
  ['getName'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    if (context.intiation) {
      context.name = 'Shahzil Sheikh';
    }
    
    cb(context);
  },

  ['getAnswer'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    console.log(context.question)

    switch(context.question){
      case 'School':
      case 'school':
        context.answer  = 'I am currently a 2019 canditate for Bachelors in\
         Electrical Engineering at the Illinois Institute of Technology'
      case 'Work':
      case 'work':
        context.answer = 'Currently I am working as a Student Assistant at the\
         Student Employement Office at the Illionois Institute of Technology. From 2012 to 2015 I have Interned at KeySports Pvt Ltd\
         and in the Summer of 2014 I Interned at the Standard Chartered Bank'
      case 'Skills':
      case 'skills':
        context.answer = 'I currently program in Java, Python, Visual Basic and Arduino\
        I am also comfortabble with various electroinc boards including Arduino, Raspberry Pi and ESP8266'
      case 'Achievements':
      case 'achievements':
        context.answer = 'I have been on the Deans list at my university in Fall 2015 and Spring 2016.\
        I have also won the CS2050 Hackathon at my university'
      case 'Projects':
      case 'projects':
        context.answer = 'I have developed a Home Automation System as a Hobby Project.\
        I also have built robots for my classes and am currently pursuing a Robotic Arm project with IEEE'
      case 'Contact':
      case 'contact':
        context.answer = 'You can contact me at shazy792@gmail.com'
      default:
        context.answer = 'Sorry I do not understand please contact Shazhil at shazy792@gmail.com for further details.'
    }

    cb(context);
  },
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