const Alexa = require('ask-sdk-core');
const api = require('./api');

/**
 * Language translation constants
 */
const logic = require('./language_logic');
const subject_categories = logic.subject_categories;
const object_categories = logic.object_categories;
const cancel_words =logic.cancel_words;
const legal_queries = logic.count_legal_queries;
const dict = logic.dict;
const combinations=logic.combinations;
const swap = logic.swap;
const swap2=logic.swap_o;
const article=logic.article;
const conjunction=logic.conjunction;
const hits = logic.hits;
const hit = logic.hit;
const singular=logic.singular;
const in_prep = logic.in_prep;


/**
 * Handler executed when there are empty required slots
 */
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
    const lng = Alexa.getLocale(handlerInput.requestEnvelope); 
    var updatedIntent = handlerInput.requestEnvelope.request.intent;
    var subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
    
    if(!handlerInput.requestEnvelope.request.intent.slots.subject.value){
        return handlerInput.responseBuilder
            .speak(handlerInput.t('SUBJECT_REQUEST_MSG'))
            .reprompt(handlerInput.t('SUBJECT_REQUEST_REPROMPT_MSG'))
            .addElicitSlotDirective('subject')
            .getResponse();
    }
    
    if(handlerInput.requestEnvelope.request.intent.slots.subject.value 
        && (handlerInput.requestEnvelope.request.intent.slots.subject.resolutions.resolutionsPerAuthority[0].status.code==='ER_SUCCESS_NO_MATCH' 
        || subject_categories[lng].indexOf(subject)===-1)){
       
        return handlerInput.responseBuilder
            .speak(handlerInput.t('SUBJECT_WRONG_MSG', {sub: handlerInput.t(subject)}))
            .addElicitSlotDirective('subject')
            .getResponse();
    } 
    
    if(!handlerInput.requestEnvelope.request.intent.slots.item.value) {
        delete updatedIntent.slots.queryable_objects.value;
        return handlerInput.responseBuilder
            .speak(handlerInput.t('INSTANCE_MSG', {list:logic.item_question(subject,lng), sub:article(lng,subject)}))
            .addElicitSlotDirective('item',updatedIntent)
            .getResponse();
    } 
    
    if(handlerInput.requestEnvelope.request.intent.slots.item.value) {
        let instance=Alexa.getSlotValue(handlerInput.requestEnvelope, 'item');
        let en_subject=swap(lng,subject);
        
        if (instance==='all' || instance==='no name' || instance==='no'){
            
           if(!legal_queries[en_subject][combinations[en_subject]][1]){
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
            updatedIntent.slots.queryable_objects.value=combinations[en_subject]
            let object=combinations[en_subject]
            return handlerInput.responseBuilder
                .speak(handlerInput.t('INTENT_CONFIRMATION_1_MSG', {sub: handlerInput.t(dict[lng]['sub'][en_subject][object]), prep: dict[lng]['prep'][en_subject][object], obj:dict[lng]['obj'][en_subject][object]}))
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
    let updatedIntent = handlerInput.requestEnvelope.request.intent;
    const lng = Alexa.getLocale(handlerInput.requestEnvelope);
    let subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
    let object = Alexa.getSlotValue(handlerInput.requestEnvelope, 'queryable_objects');
    const instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance_of_querable_object');
    
    let en_subject=swap(lng,subject);
    let en_object=swap2(lng,object);
    
    var n=0;
    var msg='INTENT_CONFIRMATION_2_MSG'
    if (instance==='no'){
        n=1
        msg='INTENT_CONFIRMATION_1_MSG'
    }

    if(!legal_queries[en_subject][en_object][n]){
        
        updatedIntent.slots.instance_of_querable_object.value='';
        updatedIntent.slots.queryable_objects.value=''
        updatedIntent.slots.subject.value=''
        return handlerInput.responseBuilder
            .speak(handlerInput.t('NO_SENSE_MSG'))
            .reprompt(handlerInput.t('REPROMPT_END_MSG'))
            .getResponse();
    }
    
    return handlerInput.responseBuilder
        .speak(handlerInput.t(msg, {sub: handlerInput.t(dict[lng]['sub'][en_subject][en_object]), inst: instance, prep: dict[lng]['prep'][en_subject][en_object], obj:dict[lng]['obj'][en_subject][en_object]}))
        .addConfirmIntentDirective(updatedIntent)
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
        const lng = Alexa.getLocale(handlerInput.requestEnvelope);
        let subject = Alexa.getSlotValue(handlerInput.requestEnvelope,'subject');
        subject=swap(lng,subject);
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
            .speak(handlerInput.t('INTENT_CONFIRMATION_2_MSG', {sub: handlerInput.t(dict[lng]['sub'][subject][speak.object]), inst: speak.item, prep: dict[lng]['prep'][subject][speak.object], obj:dict[lng]['obj'][subject][speak.object] }))
            .addConfirmIntentDirective(updatedIntent)
            .getResponse();
            
        } else if (speak.result==='ko' && parseInt(speak.num)>1 && parseInt(speak.num)<4){
            var msg=""
            var n=speak.keys.length-1
            for(let i in speak.keys){
               msg=msg+speak.keys[i]
               if (i==(n-1)){
                   msg=msg+conjunction[lng];
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
                    if(speak.num[j]>1){
                        message = message + speak.num[j] + hits[lng] + article(lng,object_categories[lng][j]) + ', ';
                    } else {
                        message = message + speak.num[j] + hit[lng] + article(lng,object_categories[lng][j]) + ', ';
                    }
                    
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
                    message = message+in_prep[lng]+ article(lng,object_categories[lng][i]) + ', '
                }
            }
            return handlerInput.responseBuilder
                .speak(handlerInput.t('ITEM_MSG',{inst: instance, msg:message}))
                .addElicitSlotDirective('item')
                .getResponse();
        }
        
        if (cancel_words[lng].indexOf(instance)!==-1){
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

/**
 * Handler esecuted when all slots are acquired and it's time to get the data from the database
 */
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
        
        const lng = Alexa.getLocale(handlerInput.requestEnvelope);
        var subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'subject');
        var object = Alexa.getSlotValue(handlerInput.requestEnvelope, 'queryable_objects');
        var instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance_of_querable_object');
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        let en_subject=swap(lng,subject);
        let en_object=swap2(lng,object);
        
        var subject_id=subject_categories['en-US'].indexOf(en_subject)+1;
        var object_id=object_categories['en-US'].indexOf(en_object)+1;
        
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
            
            let sub=dict[lng]['sub'][en_subject][en_object];
            
            if(speak.hits === '1'){
                sub = singular(lng,sub);
            } 
            message=handlerInput.t(msg, {num: speak.hits, sub:sub, obj:dict[lng]['obj'][en_subject][en_object], inst:instance, prep: dict[lng]['prep'][en_subject][en_object]})
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