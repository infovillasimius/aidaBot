/* *
 * Querying AIDA database from an Alexa skill 
 * */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor'); 
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


const StartedInProgressHowManyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HowManyIntent"
      && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.queryable_objects = "";
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
    return handlerInput.responseBuilder
      .speak()
      .addDelegateDirective()
      .getResponse();
  }
};


const CompletedHowManyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HowManyIntent"
      && handlerInput.requestEnvelope.request.dialogState === 'COMPLETED'
      && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED';
  },
  handle(handlerInput) {
    let subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
    const instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance_of_querable_object');
    return handlerInput.responseBuilder
        .speak(handlerInput.t('INTENT_CONFIRMATION_2_MSG', {sub: handlerInput.t(subject), inst: instance}))
        .addConfirmIntentDirective()
      .getResponse();
  }
};


/**
 * Handler esecuted when instance_of_querable_object slot has a valid value and it isn't 'no'
 * and queryable_objects slot is not filled
 * It finds value for query object with a request to the database server
 */
const InProgressHowManyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HowManyIntent'
            && handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value
            && handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value !== 'no'
            && !handlerInput.requestEnvelope.request.intent.slots.queryable_objects.value
            && !handlerInput.requestEnvelope.request.intent.slots.item.value
            && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED';
    },
    async handle(handlerInput) {
        let subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
        const subject_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'subject');
         if (typeof subject !== 'undefined') {
            subject = subject_slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }
        let updatedIntent = handlerInput.requestEnvelope.request.intent;
        
        const instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance_of_querable_object');
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if (sessionAttributes.queryable_objects && sessionAttributes.queryable_objects !==''){
            return handlerInput.responseBuilder
            .addDelegateDirective()
            .getResponse();
        } 
        
        var url='cmd=fnd&ins='+instance;
        var speak='';
        
        try{
            speak=await api.AccessApi(url);
        } catch(error){
            console.log(error);
        }
        
         var message='';
        sessionAttributes.queryable_objects = speak;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        
        if (speak.result==='ok'){
            updatedIntent.slots.instance_of_querable_object.value = speak.item
            return handlerInput.responseBuilder
            .speak(handlerInput.t('INTENT_CONFIRMATION_2_MSG', {sub: handlerInput.t(subject), inst: speak.item}))
            .addConfirmIntentDirective(updatedIntent)
            .getResponse();
        } else if (parseInt(speak.num)>1 && parseInt(speak.num)<4){
            var msg=""
            var n=speak.keys.length-1
            for(var i in speak.keys){
               msg=msg+speak.keys[i]
               if (i==(n-1)){
                   msg=msg+' and '
               } else if(i==(n)) {
                   msg=msg+'. '
               } else {
                   msg=msg+', '
               }
            }
            message=('Searching for '+instance+', I got: ' +msg+'Which one is correct?')
            return handlerInput.responseBuilder
            .speak(message)
            .addElicitSlotDirective('item')
            .getResponse();
        } else if (parseInt(speak.num)===0){
            message=(handlerInput.t('NO_RESULT_MSG', {item: instance}))
        } else {
            message=(handlerInput.t('TOO_GENERIC_MSG', {item: instance}))
        }
        
        
        return handlerInput.responseBuilder
        .speak(message)
        .addElicitSlotDirective('item')
        .getResponse();
    }
};


/**
 * Handler esecuted when instance_of_querable_object slot and item slot have a value and the firs isn't 'no'
 * and queryable_objects slot is not filled
 * It finds value for query object with a request to the database server
 */
const ItemHowManyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HowManyIntent'
            && handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value
            && handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value !== 'no'
            && !handlerInput.requestEnvelope.request.intent.slots.queryable_objects.value
            && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED';
    },
    async handle(handlerInput) {
        let subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
        const subject_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'subject');
         if (typeof subject !== 'undefined') {
            subject = subject_slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }
        let updatedIntent = handlerInput.requestEnvelope.request.intent;
         
        const instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'item');
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
       
        var url='cmd=fnd&ins='+instance;
        var speak='';
        
        try{
            speak=await api.AccessApi(url);
        } catch(error){
            console.log(error);
        }
        
        var message='';
        sessionAttributes.queryable_objects = speak;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        
        if (speak.result==='ok'){
            updatedIntent.slots.instance_of_querable_object.value = updatedIntent.slots.item.value
            
            return handlerInput.responseBuilder
            .speak(handlerInput.t('INTENT_CONFIRMATION_2_MSG', {sub: handlerInput.t(subject), inst: instance}))
            .addConfirmIntentDirective(updatedIntent)
            .getResponse();
        } else if (parseInt(speak.num)>1 && parseInt(speak.num)<4){
            var msg=""
            var n=speak.keys.length-1
            for(var i in speak.keys){
               msg=msg+speak.keys[i]
               if (i==(n-1)){
                   msg=msg+' and '
               } else if(i==(n)) {
                   msg=msg+'. '
               } else {
                   msg=msg+', '
               }
            }
            message=('Searching for '+instance+', I got: ' +msg+'Which one is correct?')
            return handlerInput.responseBuilder
            .speak(message)
            .addElicitSlotDirective('item')
            .getResponse();
            
        } else if (parseInt(speak.num)===0){
            message=(handlerInput.t('NO_RESULT_MSG', {item: instance}))
        } else {
            message=(handlerInput.t('TOO_GENERIC_MSG', {item: instance}))
        } 
        
        return handlerInput.responseBuilder
        .speak(message)
        .addElicitSlotDirective('item')
        .getResponse();
        
    }
};




/**
 * Handler esecuted when instance_of_querable_object slot has a valid value and it is 'no'
 * and queryable_objects slot is not filled
 * It finds value for query object with a request to the database server
 */
const InProgressWithNoInstanceHowManyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HowManyIntent'
            && handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value
            && (handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value==='no'
            || handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value==='nothing'
            || handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value==='anyone'
            || handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value==='anything'
            || handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value==='nobody')
            && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED';
    },
    async handle(handlerInput) {
        const subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject')
        const object = Alexa.getSlotValue(handlerInput.requestEnvelope, 'queryable_objects');
        
        if (!handlerInput.requestEnvelope.request.intent.slots.queryable_objects.value){
            return handlerInput.responseBuilder
            .speak(handlerInput.t('OBJ_MSG'))
            .reprompt(handlerInput.t('OBJ_REPROMPT_MSG'))
            .addElicitSlotDirective('queryable_objects')
            .getResponse();
        } 
        
        return handlerInput.responseBuilder
            .speak(handlerInput.t('INTENT_CONFIRMATION_1_MSG', {sub: handlerInput.t(subject), obj: handlerInput.t(object)}))
            .addConfirmIntentDirective()
            .getResponse();
    }
};



const HowManyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HowManyIntent'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus === 'CONFIRMED'; 
    },
    async handle(handlerInput) {
        let subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
        const subject_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'subject');
        let queryable_objects = Alexa.getSlotValue(handlerInput.requestEnvelope, 'queryable_objects');
        const queryable_objects_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'queryable_objects');
        const instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance_of_querable_object');
        const instance_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'instance_of_querable_object');
        
        var subject_slot_id = 0
        var queryable_objects_slot_id = 0
        var instance_value = 0
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let obj = sessionAttributes.queryable_objects;
        
        if(obj && obj!=='undefined' && obj.obj_id){
            queryable_objects_slot_id = obj.obj_id
            queryable_objects = obj.object
        }
        
        if (typeof subject !== 'undefined') {
            subject_slot_id = subject_slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
            subject = subject_slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }
        
        if (typeof queryable_objects !== 'undefined' && queryable_objects_slot_id===0) {
            queryable_objects_slot_id = queryable_objects_slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        
        if(instance_slot.resolutions && instance_slot.resolutions.resolutionsPerAuthority && instance_slot.resolutions.resolutionsPerAuthority[0].status.code==='ER_SUCCESS_MATCH'){
            instance_value = 'no'
        } else {
            instance_value = instance
        }
        
        var url='cmd=how&sub='+subject_slot_id+'&obj='+queryable_objects_slot_id+'&ins='+instance_value;
        var speak='';
        
        try{
            speak=await api.AccessApi(url);
        } catch(error){
            console.log(error);
        }
        
        var s = subject.substring(subject.length - 1, subject.length);
        var s1 = queryable_objects.substring(queryable_objects.length - 1, queryable_objects.length);
        
        if(speak.hits === '1' && s==='s'){
            subject = subject.substring(0, subject.length - 1);
        } 

        if (s !== 's' && speak.hits !== '1'){
            subject=subject+'s'
        }
        
        var message='';
        var msg;
        
        if (instance_value==='no'){
            msg ='QUERY_2_MSG'
        } else {
            msg ='QUERY_1_MSG'
        }
        
        if (speak.result==='ok'){
            message=handlerInput.t(msg, {num: speak.hits , sub:handlerInput.t(subject), obj:handlerInput.t(speak.object), inst:instance_value, prep:speak.prep})
        } else {
            message=handlerInput.t('NO_QUERY_MSG');
        }
        
        var speakOutput = message;
        
        sessionAttributes.queryable_objects ="";
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(handlerInput.t('REPROMPT_END_MSG'))
            .getResponse();
    }
};

const DeniedHowManyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HowManyIntent'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus === 'DENIED';
    },
    handle(handlerInput) {
        
        const speakOutput = handlerInput.t('REPROMPT_MSG'); 

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const WhoAreIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WhoAreTheTopIntent';
    },
    handle(handlerInput) {
        /*
        const subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
        const verb = Alexa.getSlotValue(handlerInput.requestEnvelope, 'verb');
        const verb_slot = Alexa.getSlot(handlerInput.requestEnvelope, 'verb');
        const id=verb_slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        
        const nome = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance_of_querable_object');
        const speakOutput = "you said: how many "+subject+" " + verb+ id;
        */
        return handlerInput.responseBuilder
            .speak('if you say so!')
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const FreeQueryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FreeQueryIntent';
    },
    handle(handlerInput) {
        
        const query = Alexa.getSlotValue(handlerInput.requestEnvelope, 'query');

        
        return handlerInput.responseBuilder
            .speak('if you say so!')
            .reprompt()
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
    process(handlerInput) {
        const localisationClient = i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings,
            returnObjects: true
        });
        localisationClient.localise = function localise() {
            const args = arguments;
            const value = i18n.t(...args);
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };
        handlerInput.t = function translate(...args) {
            return localisationClient.localise(...args);
        }
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
        DeniedHowManyIntentHandler,
        InProgressWithNoInstanceHowManyIntentHandler,
        InProgressHowManyIntentHandler,
        ItemHowManyIntentHandler,
        StartedInProgressHowManyIntentHandler,
        HowManyIntentHandler,
        CompletedHowManyIntentHandler,
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
    .withCustomUserAgent('Aida_Query')
    .lambda();