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
const subject_categories = logic.list_subject_categories;
const object_categories = logic.object_categories;
const item_question=logic.list_item_question;
const article=logic.article;
const swap=logic.list_swap;
const swap2=logic.swap_o;
const legal_queries=logic.list_legal_queries;
const hits = logic.hits;
const hit = logic.hit;
const conjunction=logic.conjunction;
const dict = logic.list_dict;
const in_prep = logic.in_prep;
const cancel_words =logic.cancel_words;
const singular=logic.singular;
const singular_words=logic.singular_words;
const lst = logic.lst;
const list_verbs=logic.list_verbs;
const intent_confirmation_articles=logic.intent_confirmation_articles;
const get_number = logic.get_number;
const homonyms = logic.homonyms;
const homonyms_objects = logic.objects
const choice_list = logic.choice_list;
const get_choice = logic.get_choice;
const kk_message = logic.kk_message;


async function slot_parser(handlerInput){
    const intent = Alexa.getIntentName(handlerInput.requestEnvelope)
    const lng = Alexa.getLocale(handlerInput.requestEnvelope); 
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let updatedIntent = handlerInput.requestEnvelope.request.intent;
    let query = Alexa.getSlotValue(handlerInput.requestEnvelope, 'query');
    let intent_name = Alexa.getIntentName(handlerInput.requestEnvelope);
    let speak;
    let cmd = intent_name==='HowManyIntent' ? 'count' : 'list';
    
    let res={};

    let url='cmd=parser&lng='+lng+'&ins='+cmd+' '+query;
    try{
        speak=await api.AccessApi(url);
    } catch(error){
        console.log(error);
    }
    
    return speak;
}



async function item_checker(handlerInput,updatedIntent) {
    
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const lng = Alexa.getLocale(handlerInput.requestEnvelope);
    let subject = Alexa.getSlotValue(handlerInput.requestEnvelope,'list_subject');
    var number = Alexa.getSlotValue(handlerInput.requestEnvelope, 'number');
    var order = Alexa.getSlotValue(handlerInput.requestEnvelope, 'order');
    var instance;
    if(!handlerInput.requestEnvelope.request.intent.slots.item.value){
        instance = Alexa.getSlotValue(handlerInput.requestEnvelope,'instance');
    } else {
        instance = Alexa.getSlotValue(handlerInput.requestEnvelope,'item');
    }
    
    var url='cmd=fnd&ins='+instance;
    var speak='';
    
    try{
            speak=await api.AccessApi(url);
    } catch(error){
            console.log(error);
    }
   
    var message='';
    
    if (speak.result==='ok'){
        updatedIntent.slots.instance.value = speak.item 
        updatedIntent.slots.object.value=speak.object;
        if(speak.obj_id===4 || speak.obj_id===2){
            updatedIntent.slots.item.value=speak.id
        }
        
        delete sessionAttributes.ListTheTopIntentAuthors;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        
        return '1'
        
    } else if (speak.result==='ko'){
        
        message=(handlerInput.t('NO_RESULT_MSG', {item: instance}))
        
    } else if (speak.result==='kk'){
        message=kk_message(speak,lng,1);
        
        return handlerInput.responseBuilder
            .speak(handlerInput.t('TOO_GENERIC_MSG',{item: instance, results:message}))
            .addElicitSlotDirective('item',updatedIntent)
            .getResponse();
            
    } else if (speak.result==='k2'){
        sessionAttributes.listTheTop.ItemList=speak;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        message=choice_list(speak,lng);
        
        return handlerInput.responseBuilder
            .speak(handlerInput.t('ITEM_MSG',{inst: instance, msg:message}))
            .addElicitSlotDirective('item',updatedIntent)
            .getResponse();
            
    } else if (speak.result==='ka'){
        sessionAttributes.listTheTop.Homonyms=speak;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        let msg=homonyms(speak,lng);
        
        return handlerInput.responseBuilder
            .speak(handlerInput.t('HOMONYMS_MSG',{msg:msg, obj:homonyms_objects[lng][speak.obj_id-1]}))
            .addElicitSlotDirective('item',updatedIntent)
            .getResponse();
    }
    
    return handlerInput.responseBuilder
            .speak(message)
            .addElicitSlotDirective('item',updatedIntent)
            .getResponse();
    
    
}


module.exports = {
    slot_parser,
    item_checker
}














