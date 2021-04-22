const Alexa = require('ask-sdk-core');
const api = require('./api');

/**
 * Language constants
 */
const logic = require('./language_logic');
const cmds = logic.cmds;
const subjects = {'list':logic.list_subject_categories,'count':logic.subject_categories};
const objects = logic.object_categories;
const orders = logic.orders;
const prepositions = logic.prepositions;


async function slot_parser(handlerInput){
    const intent = Alexa.getIntentName(handlerInput.requestEnvelope)
    const lng = Alexa.getLocale(handlerInput.requestEnvelope); 
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let updatedIntent = handlerInput.requestEnvelope.request.intent;
    let item = Alexa.getSlotValue(handlerInput.requestEnvelope, 'query');
    
    /*
    sessionAttributes.parser_passed=Alexa.getIntentName(handlerInput.requestEnvelope);
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
    */
    
    
    
    
    
    
    
    
    
    
    
    
}

module.exports = {
    slot_parser
}














