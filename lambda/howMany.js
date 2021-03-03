const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor'); 
const axios = require('axios');
const api = require('./api');
const languageStrings = require('./localisation');
const logic = require('./logic');

const subject_categories = ['authors', 'papers', 'conferences', 'organizations', 'citations'];
const object_categories = ['topics','conferences','organizations','authors','papers'];
const cancel_words = ['cancel','stop', 'enough','stop it'];
const legal_queries = logic.legal_queries;
const dict = logic.dict;
const combinations=logic.combinations;

const StartHowManyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "HowManyIntent"
      && ( !handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value
        || !handlerInput.requestEnvelope.request.intent.slots.subject.value
        || !handlerInput.requestEnvelope.request.intent.slots.queryable_objects.value)
      && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED';
  },
  handle(handlerInput) {
    
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    var updatedIntent = handlerInput.requestEnvelope.request.intent;
    var subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
    
    if(!handlerInput.requestEnvelope.request.intent.slots.subject.value){
        sessionAttributes.subject='';
        return handlerInput.responseBuilder
            .speak(handlerInput.t('SUBJECT_REQUEST_MSG'))
            .reprompt(handlerInput.t('SUBJECT_REQUEST_REPROMPT_MSG'))
            .addElicitSlotDirective('subject')
            .getResponse();
    } 
    
    if(handlerInput.requestEnvelope.request.intent.slots.subject.value && handlerInput.requestEnvelope.request.intent.slots.subject.resolutions.resolutionsPerAuthority[0].status.code==='ER_SUCCESS_NO_MATCH'){
       
        return handlerInput.responseBuilder
            .speak(handlerInput.t('SUBJECT_WRONG_MSG', {sub: handlerInput.t(subject)}))
            .addElicitSlotDirective('subject')
            .getResponse();
    } 
    
    if(!handlerInput.requestEnvelope.request.intent.slots.item.value) {
        
        delete updatedIntent.slots.queryable_objects.value;
        
        return handlerInput.responseBuilder
            .speak(handlerInput.t('INSTANCE_MSG', {list:logic.item_question(subject), sub:subject}))
            .addElicitSlotDirective('item',updatedIntent)
            .getResponse();
    } 
    
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
   
   
    if(handlerInput.requestEnvelope.request.intent.slots.item.value) {
        let instance=Alexa.getSlotValue(handlerInput.requestEnvelope, 'item');
        
        if (instance==='all' || instance==='no name' || instance==='no'){
            
           if(!legal_queries[subject][combinations[subject]][1]){
                let updatedIntent = handlerInput.requestEnvelope.request.intent;
                updatedIntent.slots.instance_of_querable_object.value='';
                updatedIntent.slots.queryable_objects.value=''
                updatedIntent.slots.subject.value=''
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_SENSE_MSG'))
                    .reprompt(handlerInput.t('REPROMPT_END_MSG'))
                    .getResponse();
            }
            
            let updatedIntent = handlerInput.requestEnvelope.request.intent;
            updatedIntent.slots.instance_of_querable_object.value='no';
            updatedIntent.slots.queryable_objects.value=combinations[subject]
            let object=combinations[subject]
            return handlerInput.responseBuilder
                .speak(handlerInput.t('INTENT_CONFIRMATION_1_MSG', {sub: handlerInput.t(dict['sub'][subject][object]), prep: dict['prep'][subject][object], obj:dict['obj'][subject][object]}))
                .addConfirmIntentDirective(updatedIntent)
                .getResponse();
        } else {
        
         let updatedIntent = handlerInput.requestEnvelope.request.intent;
         
         updatedIntent.slots.instance_of_querable_object.value=instance;
         return handlerInput.responseBuilder
            .addDelegateDirective(updatedIntent)
            .getResponse();
        }
    }
  }
};


const CompletedHowManyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
        && handlerInput.requestEnvelope.request.intent.name === "HowManyIntent"
        && handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value
        && handlerInput.requestEnvelope.request.intent.slots.subject.value
        && handlerInput.requestEnvelope.request.intent.slots.queryable_objects.value
        && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED';
  },
  handle(handlerInput) {
    let subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
    let object = Alexa.getSlotValue(handlerInput.requestEnvelope, 'queryable_objects');
    const instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance_of_querable_object');
    
    var n=0;
    var msg='INTENT_CONFIRMATION_2_MSG'
    if (instance==='no'){
        n=1
        msg='INTENT_CONFIRMATION_1_MSG'
    }

    if(!legal_queries[subject][object][n]){
        let updatedIntent = handlerInput.requestEnvelope.request.intent;
        updatedIntent.slots.instance_of_querable_object.value='';
        updatedIntent.slots.queryable_objects.value=''
        updatedIntent.slots.subject.value=''
        return handlerInput.responseBuilder
            .speak(handlerInput.t('NO_SENSE_MSG'))
            .reprompt(handlerInput.t('REPROMPT_END_MSG'))
            .getResponse();
    }
    return handlerInput.responseBuilder
        .speak(handlerInput.t(msg, {sub: handlerInput.t(dict['sub'][subject][object]), inst: instance, prep: dict['prep'][subject][object], obj:dict['obj'][subject][object]}))
        .addConfirmIntentDirective()
        .getResponse();
  }
};


/**
 * Handler esecuted when instance_of_querable_object slot or item slot has a value and the first isn't 'no'
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
        let subject = Alexa.getSlotValue(handlerInput.requestEnvelope,'subject');
        let updatedIntent = handlerInput.requestEnvelope.request.intent;
        var instance;
        if(!handlerInput.requestEnvelope.request.intent.slots.item.value){
            instance = Alexa.getSlotValue(handlerInput.requestEnvelope,'instance_of_querable_object');
        } else {
            instance = Alexa.getSlotValue(handlerInput.requestEnvelope,'item');
        }
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
       
        var url='cmd=fnd&ins='+instance;
        var speak='';
        
        try{
            speak=await api.AccessApi(url);
        } catch(error){
            console.log(error);
        }
        
        var message='';
        
        if (speak.result==='ok'){
            updatedIntent.slots.instance_of_querable_object.value = speak.item 
            updatedIntent.slots.queryable_objects.value=speak.object;
            
            if(!legal_queries[subject][speak.object][0]){
                let updatedIntent = handlerInput.requestEnvelope.request.intent;
                updatedIntent.slots.instance_of_querable_object.value='';
                updatedIntent.slots.queryable_objects.value=''
                updatedIntent.slots.subject.value=''
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_SENSE_MSG'))
                    .reprompt(handlerInput.t('REPROMPT_END_MSG'))
                    .getResponse();
            }
            
            return handlerInput.responseBuilder
            .speak(handlerInput.t('INTENT_CONFIRMATION_2_MSG', {sub: handlerInput.t(dict['sub'][subject][speak.object]), inst: speak.item, prep: dict['prep'][subject][speak.object], obj:dict['obj'][subject][speak.object] }))
            .addConfirmIntentDirective(updatedIntent)
            .getResponse();
            
        } else if (speak.result==='ko' && parseInt(speak.num)>1 && parseInt(speak.num)<4){
            var msg=""
            var n=speak.keys.length-1
            for(let i in speak.keys){
               msg=msg+speak.keys[i]
               if (i==(n-1)){
                   msg=msg+' and '
               } else if(i==(n)) {
                   msg=msg+'. '
               } else {
                   msg=msg+', '
               }
            }
            
            message=handlerInput.t('ITEM_MSG', {inst: instance, msg: msg})
            return handlerInput.responseBuilder
                .speak(message)
                .addElicitSlotDirective('item')
                .getResponse();
            
        } else if (speak.result==='ko' && parseInt(speak.num)===0){
            message=(handlerInput.t('NO_RESULT_MSG', {item: instance}))
            
        } else if (speak.result==='kk'){
            message='';
            for (let j in speak.num){
                if (speak.num[j]>0){
                    message = message + speak.num[j] + ' hits among the '+ object_categories[j] + ', ';
                }
            }
            return handlerInput.responseBuilder
                .speak(handlerInput.t('TOO_GENERIC_MSG',{item: instance, results:message}))
                .addElicitSlotDirective('item')
                .getResponse();
        } else if (speak.result==='k2'){
            message='';
            for(let i in speak.num){
                if (speak.num[i]>0){
                    for(let j in speak.keys[i]){
                        message = message + speak.keys[i][j] + ', ';
                    }
                    message = message+' among the '+ object_categories[i] + ', '
                }
            }
            return handlerInput.responseBuilder
                .speak(handlerInput.t('ITEM_MSG',{inst: instance, msg:message}))
                .addElicitSlotDirective('item')
                .getResponse();
        }
        
        if (cancel_words.indexOf(instance)!==-1){
            let updatedIntent = handlerInput.requestEnvelope.request.intent;
            updatedIntent.slots.instance_of_querable_object.value='';
            updatedIntent.slots.queryable_objects.value=''
            updatedIntent.slots.subject.value=''
            updatedIntent.slots.item=''
            return handlerInput.responseBuilder
                .speak(handlerInput.t('REPROMPT_MSG'))
                .reprompt()
                .getResponse();
        }
        
        return handlerInput.responseBuilder
                .speak(message)
                .addElicitSlotDirective('item')
                .getResponse();
        
    }
};


const HowManyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HowManyIntent'
            && handlerInput.requestEnvelope.request.intent.slots.instance_of_querable_object.value
            && handlerInput.requestEnvelope.request.intent.slots.subject.value
            && handlerInput.requestEnvelope.request.intent.slots.queryable_objects.value
            && handlerInput.requestEnvelope.request.intent.confirmationStatus === 'CONFIRMED'; 
    },
    async handle(handlerInput) {
        var subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
        var object = Alexa.getSlotValue(handlerInput.requestEnvelope, 'queryable_objects');
        var instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance_of_querable_object');
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var subject_id=subject_categories.indexOf(subject)+1;
        var object_id=object_categories.indexOf(object)+1;
        
        
        var url='cmd=how&sub='+subject_id+'&obj='+object_id+'&ins='+instance;
        var speak='';
        
        try{
            speak=await api.AccessApi(url);
        } catch(error){
            console.log(error);
        }

        var message='';
        var msg;
        
        if (instance==='no'){
            msg ='QUERY_2_MSG'
        } else {
            msg ='QUERY_1_MSG'
        }
        
        if (speak.result==='ok'){
            let sub=dict['sub'][subject][object];
            if(speak.hits === '1'){
                sub = sub.substring(0, subject.length - 1);
            } 
            message=handlerInput.t(msg, {num: speak.hits, sub:handlerInput.t(sub), obj:dict['obj'][subject][object], inst:instance, prep: dict['prep'][subject][object]})
        } else {
            message=handlerInput.t('NO_QUERY_MSG');
        }
        
        var speakOutput = message;
        
        delete sessionAttributes.queryable_objects;
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
        
        return handlerInput.responseBuilder
            .speak(handlerInput.t('REPROMPT_MSG'))
            .reprompt(handlerInput.t('REPROMPT_END_MSG'))
            .getResponse();
    }
};



module.exports = {
    DeniedHowManyIntentHandler,
    ItemHowManyIntentHandler,
    StartHowManyIntentHandler,
    HowManyIntentHandler,
    CompletedHowManyIntentHandler
}