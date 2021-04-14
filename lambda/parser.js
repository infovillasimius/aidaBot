const Alexa = require('ask-sdk-core');
const api = require('./api');

/**
 * Language translation constants
 */
const logic = require('./language_logic');
const cmds = logic.cmds;
const subjects = {'list':logic.list_subject_categories,'count':logic.subject_categories};
const objects = logic.object_categories;
const orders = logic.orders;
const prepositions = logic.prepositions;


async function parser(handlerInput,query){
    const intent = Alexa.getIntentName(handlerInput.requestEnvelope)
    const lng = Alexa.getLocale(handlerInput.requestEnvelope); 
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let updatedIntent = handlerInput.requestEnvelope.request.intent;
    let item = Alexa.getSlotValue(handlerInput.requestEnvelope, 'query');
    
}







module.exports = {
    parser
}














