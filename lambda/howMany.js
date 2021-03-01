const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor'); 
const axios = require('axios');
const api = require('./api');
const languageStrings = require('./localisation');

const subject_categories = ['authors', 'papers', 'conferences', 'organizations', 'citations'];
const object_categories = ['topics','conferences','organizations','authors','papers'];
const cancel_words = ['cancel','stop', 'enough','no','stop it'];

const legal_queries = {
    'authors':{
        'topics': [true, false],
        'conferences': [true,true],
        'organizations': [true,false],
        'authors': [false,false],
        'papers': [false,true],
    },
    'papers':{
        'topics': [true, false],
        'conferences': [true,true],
        'organizations': [true,false],
        'authors': [true,false],
        'papers': [false,true],
    },
    'conferences':{
        'topics': [true, false],
        'conferences': [false,true],
        'organizations': [true,false],
        'authors': [true,false],
        'papers': [false,false],
    },
    'organizations':{
        'topics': [true, false],
        'conferences': [true,false],
        'organizations': [false,true],
        'authors': [true,false],
        'papers': [false,false],
    },
    'citations':{
        'topics': [true, false],
        'conferences': [true,false],
        'organizations': [true,false],
        'authors': [true,false],
        'papers': [false,false],
    }
}

const dict = {
    'sub':{
        'authors':{
            'topics':'authors',
            'conferences':'authors',
            'organizations':'authors',
            'authors':'authors',
            'papers':'authors'
        },
        'papers':{
            'topics':'papers',
            'conferences':'papers',
            'organizations':'papers',
            'authors':'papers',
            'papers':''
        },
        'conferences':{
            'topics':'conferences',
            'conferences':'conferences',
            'organizations':'conferences',
            'authors':'conferences',
            'papers':''
        },
        'organizations':{
            'topics':'organizations',
            'conferences':'organizations',
            'organizations':'organizations',
            'authors':'organizations',
            'papers':''
        },
        'citations':{
            'topics':'citations',
            'conferences':'citations',
            'organizations':'citations',
            'authors':'citations',
            'papers':''
        }
    },
    'prep':{
        'authors':{
            'topics':'who have written papers on',
            'conferences':'who have written papers for',
            'organizations':'affiliated to the',
            'authors':'are called',
            'papers':'of'
        },
        'papers':{
            'topics':'on',
            'conferences':'from',
            'organizations':'from authors affiliated to the',
            'authors':'written by the author',
            'papers':''
        },
        'conferences':{
            'topics':'with papers on',
            'conferences':'',
            'organizations':'with papers by authors affiliated to the',
            'authors':'with papers written by the author',
            'papers':''
        },
        'organizations':{
            'topics':'with papers on', //'with affiliated authors who have written papers on'
            'conferences':'with papers at',
            'organizations':'',
            'authors':'with', //'that have the author'
            'papers':''
        },
        'citations':{
            'topics':'of papers on',
            'conferences':'of papers from',
            'organizations':'of papers written by authors affiliated to the',
            'authors':'of papers written by the author',
            'papers':''
        }
    },
    'obj':{
        'authors':{
            'topics':'topics',
            'conferences':'conferences',
            'organizations':'',
            'authors':'',
            'papers':'papers'
        },
        'papers':{
            'topics':'topics',
            'conferences':'conferences',
            'organizations':'',
            'authors':'',
            'papers':'papers'
        },
        'conferences':{
            'topics':'topics',
            'conferences':'conferences',
            'organizations':'',
            'authors':'',
            'papers':''
        },
        'organizations':{
            'topics':'',
            'conferences':'conferences',
            'organizations':'',
            'authors':'among their affiliated authors',
            'papers':''
        },
        'citations':{
            'topics':'topics',
            'conferences':'conferences',
            'organizations':'',
            'authors':'',
            'papers':''
       }
    }
};


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
    
    if(!handlerInput.requestEnvelope.request.intent.slots.yes_or_no.value) {
        
        updatedIntent.slots.yes_or_no.value = 'yes';
        return handlerInput.responseBuilder
            .speak(handlerInput.t('ASK_FOR_INSTANCE_MSG', {sub:subject}))
            .addConfirmSlotDirective('yes_or_no',updatedIntent)
            .getResponse();
    } 
    
    if(handlerInput.requestEnvelope.request.intent.slots.yes_or_no.value && handlerInput.requestEnvelope.request.intent.slots.yes_or_no.confirmationStatus==="DENIED") {
        
        const subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject')
        const object = Alexa.getSlotValue(handlerInput.requestEnvelope, 'queryable_objects');
        let updatedIntent = handlerInput.requestEnvelope.request.intent;
        updatedIntent.slots.yes_or_no.value = 'no';
        updatedIntent.slots.instance_of_querable_object.value='no'
        
        if (!handlerInput.requestEnvelope.request.intent.slots.queryable_objects.value){
            
            return handlerInput.responseBuilder
            .speak(handlerInput.t('OBJ_MSG'))
            .reprompt(handlerInput.t('OBJ_REPROMPT_MSG'))
            .addElicitSlotDirective('queryable_objects')
            .getResponse();
            
        } else if(handlerInput.requestEnvelope.request.intent.slots.queryable_objects.value && handlerInput.requestEnvelope.request.intent.slots.queryable_objects.resolutions.resolutionsPerAuthority[0].status.code==='ER_SUCCESS_NO_MATCH'){
            
            return handlerInput.responseBuilder
            .speak(handlerInput.t('OBJECT_WRONG_MSG', {obj: handlerInput.t(object)}))
            .addElicitSlotDirective('queryable_objects')
            .getResponse();
        }
        
         if(!legal_queries[subject][object][1]){
            let updatedIntent = handlerInput.requestEnvelope.request.intent;
            updatedIntent.slots.instance_of_querable_object.value='';
            updatedIntent.slots.queryable_objects.value=''
            updatedIntent.slots.subject.value=''
            return handlerInput.responseBuilder
                .speak(handlerInput.t('NO_SENSE_MSG'))
                .reprompt()
                .getResponse();
        }
        
        return handlerInput.responseBuilder
            .speak(handlerInput.t('INTENT_CONFIRMATION_1_MSG', {sub: handlerInput.t(dict['sub'][subject][object]), prep: dict['prep'][subject][object], obj:dict['obj'][subject][object]}))
            .addConfirmIntentDirective(updatedIntent)
            .getResponse();
    } 
    
    if(handlerInput.requestEnvelope.request.intent.slots.yes_or_no.confirmationStatus==="CONFIRMED" && !handlerInput.requestEnvelope.request.intent.slots.item.value) {
        
        delete updatedIntent.slots.queryable_objects.value;
        
        return handlerInput.responseBuilder
            .speak(handlerInput.t('INSTANCE_MSG'))
            .addElicitSlotDirective('item',updatedIntent)
            .getResponse();
    } 
    
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
   
   
    if(handlerInput.requestEnvelope.request.intent.slots.item.value && handlerInput.requestEnvelope.request.intent.slots.yes_or_no.confirmationStatus==="CONFIRMED") {
         let updatedIntent = handlerInput.requestEnvelope.request.intent;
         updatedIntent.slots.instance_of_querable_object.value=handlerInput.requestEnvelope.request.intent.slots.item.value;
         return handlerInput.responseBuilder
            .addDelegateDirective(updatedIntent)
            .getResponse();
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
    if (instance==='no'){
        n=1    
    }

    if(!legal_queries[subject][object][n]){
        let updatedIntent = handlerInput.requestEnvelope.request.intent;
        updatedIntent.slots.instance_of_querable_object.value='';
        updatedIntent.slots.queryable_objects.value=''
        updatedIntent.slots.subject.value=''
        return handlerInput.responseBuilder
            .speak(handlerInput.t('NO_SENSE_MSG'))
            .reprompt()
            .getResponse();
    }
    return handlerInput.responseBuilder
        .speak(handlerInput.t('INTENT_CONFIRMATION_2_MSG', {sub: handlerInput.t(dict['sub'][subject][object]), inst: instance, prep: dict['prep'][subject][object], obj:dict['obj'][subject][object]}))
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
                    .reprompt()
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
            .reprompt()
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