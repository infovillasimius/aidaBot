/* *
 * Querying AIDA database from an Alexa skill 
 * */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const axios = require('axios');
const api = require('./api');
const languageStrings = require('./localisation');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('WELCOME_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HowManyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HowManyIntent';
    },
    handle(handlerInput) {
        const subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
        const prep = Alexa.getSlotValue(handlerInput.requestEnvelope, 'prep');
        const queryable_objects = Alexa.getSlotValue(handlerInput.requestEnvelope, 'queryable_objects');
        const verb = Alexa.getSlotValue(handlerInput.requestEnvelope, 'verb');
        const instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance_of_querable_object');
        
        const subject_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'subject');
        const prep_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'prep');
        const queryable_objects_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'queryable_objects');
        const verb_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'verb');
        const instance_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'instance_of_querable_object');
        
        var subject_slot_id = 0
        var prep_slot_id = 0 
        var queryable_objects_slot_id = 0
        var verb_slot_id = 0
        var instance_value = "zero"
        
        if (typeof subject !== 'undefined') {
            subject_slot_id = subject_slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        
        if (typeof prep !== 'undefined') {
            prep_slot_id = prep_slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        
        if (typeof queryable_objects !== 'undefined') {
            queryable_objects_slot_id = queryable_objects_slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        
        if (typeof verb !== 'undefined') {
            verb_slot_id = verb_slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        
        if (typeof instance !== 'undefined') {
            instance_value = instance;
        }
        
        //const speakOutput = " " + subject_slot_id + " " + prep_slot_id + " " + queryable_objects_slot_id + " " + verb_slot_id + " " + instance_value;
        
        const speakOutput = handlerInput.t('QUERY_TYPE_1_MSG', {sub: subject_slot_id, prep: prep_slot_id, obj:queryable_objects_slot_id, ver: verb_slot_id, inst: instance_value}); 

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const WhoAreIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WhoAreIntent';
    },
    handle(handlerInput) {
        const subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
        const verb = Alexa.getSlotValue(handlerInput.requestEnvelope, 'verb');
        const verb_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'verb');
        const id=verb_slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        
        const nome = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance_of_querable_object');
        const speakOutput = "you said: how many "+subject+" " + verb+ id;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LocalisationRequestInterceptor = {
  process(handlerInput){
      i18n.init({
          lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings,
            returnObjects: true
      }).then((t) => {
          handlerInput.t = (...args) => t(...args);
      });
  }  
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HowManyIntentHandler,
        WhoAreIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addRequestInterceptors(
        LocalisationRequestInterceptor)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();