const Alexa = require('ask-sdk-core');
const api = require('./api');

/**
 * Language translation constants
 */
const logic = require('./language_logic');
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
const dict = logic.dict;
const in_prep = logic.in_prep;
const cancel_words =logic.cancel_words;
const orders=logic.orders;
const singular=logic.singular;

const ListTheTopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListTheTopIntent'
            && !handlerInput.requestEnvelope.request.intent.slots.item.value;
    },
    handle(handlerInput) {
        const lng = Alexa.getLocale(handlerInput.requestEnvelope); 
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var updatedIntent = handlerInput.requestEnvelope.request.intent;
        var number = Alexa.getSlotValue(handlerInput.requestEnvelope, 'number');
        var subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'list_subject');
        var object = Alexa.getSlotValue(handlerInput.requestEnvelope, 'object');
        var instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance');
        var order = Alexa.getSlotValue(handlerInput.requestEnvelope, 'order');
        var item = Alexa.getSlotValue(handlerInput.requestEnvelope, 'item');
        
        if (!sessionAttributes.listTheTop){
             sessionAttributes.listTheTop={};
        }
   
        if (!number && sessionAttributes.listTheTop.number){
             number = sessionAttributes.listTheTop.number;
             updatedIntent.slots.number.value=sessionAttributes.listTheTop.number;
              
        }
        
        else if (!number && !sessionAttributes.listTheTop.number){
            number = "5";
            sessionAttributes.listTheTop.number="5"
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
            updatedIntent.slots.number.value=number;
        } 
        
        else if (number && parseInt(number)>5){
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_WRONG_NUMBER_MSG', {number: number.toString()}))
                .reprompt(handlerInput.t('LIST_WRONG_NUMBER_MSG', {number: number.toString()}))
                .addElicitSlotDirective('number',updatedIntent)
                .getResponse();
        }
        
        else if (number){
            sessionAttributes.listTheTop.number=number
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        }
        
        if (!subject){
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_SUBJECT_REQUEST_MSG'))
                .reprompt(handlerInput.t('LIST_SUBJECT_REQUEST_REPROMPT_MSG'))
                .addElicitSlotDirective('list_subject',updatedIntent)
                .getResponse();
        }
            
        if(subject  && (handlerInput.requestEnvelope.request.intent.slots.list_subject.resolutions.resolutionsPerAuthority[0].status.code==='ER_SUCCESS_NO_MATCH' 
            || subject_categories[lng].indexOf(subject)===-1)){
           
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_SUBJECT_WRONG_MSG', {sub: handlerInput.t(subject)}))
                .addElicitSlotDirective('list_subject',updatedIntent)
                .getResponse();
        } 
        
        else if(!sessionAttributes.listTheTop.subject){
            sessionAttributes.listTheTop.subject=subject;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }
        
        if(!order) {
            
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_ORDER_MSG', {number:number, subject:article(lng,subject)}))
                .addElicitSlotDirective('order',updatedIntent)
                .getResponse();
        } 
        
        if(order  && (handlerInput.requestEnvelope.request.intent.slots.order.resolutions.resolutionsPerAuthority[0].status.code==='ER_SUCCESS_NO_MATCH' 
            || orders[lng].indexOf(order)===-1)){
           
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_ORDER_WRONG_MSG', {order: article(lng,order)}))
                .addElicitSlotDirective('order',updatedIntent)
                .getResponse();
        } 
        
        if(subject_categories[lng].indexOf(subject)===1 && orders[lng].indexOf(order)===0){
                let updatedIntent = handlerInput.requestEnvelope.request.intent;
                updatedIntent.slots.instance.value='';
                updatedIntent.slots.object.value='';
                updatedIntent.slots.list_subject.value='';
                delete sessionAttributes.listTheTop;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_SENSE_MSG'))
                    .reprompt(handlerInput.t('REPROMPT_END_MSG'))
                    .getResponse(updatedIntent);
        }
        
        if(!item && !instance) {
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_INSTANCE_MSG', {list:item_question(subject,lng), sub:article(lng,subject), number:number}))
                .addElicitSlotDirective('item',updatedIntent)
                .getResponse();
        } 
        
        //sessionAttributes.confirmed=0;
        //handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        return handlerInput.responseBuilder
            .speak('you say '+ number)
            .reprompt('REPROMPT_END_MSG')
            .getResponse(updatedIntent);
    }
};


/**
 * Handler esecuted when instance_of_querable_object slot or item slot has a value and the first isn't 'no'
 * and queryable_objects slot is not filled
 * It finds value for query object with a request to the database server
 */
const ItemListTheTopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListTheTopIntent'
            && (handlerInput.requestEnvelope.request.intent.slots.instance.value
            || handlerInput.requestEnvelope.request.intent.slots.item.value)
            && !handlerInput.requestEnvelope.request.intent.slots.object.value
            && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED';
    },
    async handle(handlerInput) {
        const lng = Alexa.getLocale(handlerInput.requestEnvelope);
        let subject = Alexa.getSlotValue(handlerInput.requestEnvelope,'list_subject');
        subject=swap(lng,subject);
        let updatedIntent = handlerInput.requestEnvelope.request.intent;
        var number = Alexa.getSlotValue(handlerInput.requestEnvelope, 'number');
        var order = Alexa.getSlotValue(handlerInput.requestEnvelope, 'order');
        var instance;
        if(!handlerInput.requestEnvelope.request.intent.slots.item.value){
            instance = Alexa.getSlotValue(handlerInput.requestEnvelope,'instance');
        } else {
            instance = Alexa.getSlotValue(handlerInput.requestEnvelope,'item');
        }
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        let en_subject=swap(lng,subject);
        if (instance==='all' || instance==='no name' || instance==='no'){
            
           if(!legal_queries[en_subject]['all'][orders[lng].indexOf(order)]){
                let updatedIntent = handlerInput.requestEnvelope.request.intent;
                updatedIntent.slots.instance.value='';
                updatedIntent.slots.object.value='';
                updatedIntent.slots.list_subject.value='';
                updatedIntent.slots.order.value='';
                updatedIntent.slots.number.value='';
                delete sessionAttributes.listTheTop;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_SENSE_MSG'))
                    .reprompt(handlerInput.t('REPROMPT_END_MSG'))
                    .getResponse(updatedIntent);
            }
            
            let updatedIntent = handlerInput.requestEnvelope.request.intent;
            updatedIntent.slots.instance.value='all';
            updatedIntent.slots.object.value='all'
            let object=en_subject
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_INTENT_CONFIRMATION_1_MSG', {order:order, number:number, sub: handlerInput.t(dict[lng]['sub'][en_subject][object]), prep: dict[lng]['prep'][en_subject][object], obj:dict[lng]['obj'][en_subject][object]}))
                .addConfirmIntentDirective(updatedIntent)
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
        
        if (speak.result==='ok'){
            updatedIntent.slots.instance.value = speak.item 
            updatedIntent.slots.object.value=speak.object;
            
            if(!legal_queries[subject][speak.object][orders[lng].indexOf(order)]){
                let updatedIntent = handlerInput.requestEnvelope.request.intent;
                updatedIntent.slots.instance.value='';
                updatedIntent.slots.object.value=''
                updatedIntent.slots.list_subject.value=''
                delete sessionAttributes.listTheTop;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_SENSE_MSG'))
                    .reprompt(handlerInput.t('REPROMPT_END_MSG'))
                    .getResponse();
            }
            
            return handlerInput.responseBuilder
            .speak(handlerInput.t('LIST_INTENT_CONFIRMATION_2_MSG', {order:order, number:number, sub: handlerInput.t(dict[lng]['sub'][subject][speak.object]), inst: speak.item, prep: dict[lng]['prep'][subject][speak.object], obj:dict[lng]['obj'][subject][speak.object] }))
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
                    message = message+in_prep[lng]+ article(lng,object_categories[i]) + ', '
                }
            }
            return handlerInput.responseBuilder
                .speak(handlerInput.t('ITEM_MSG',{inst: instance, msg:message}))
                .addElicitSlotDirective('item')
                .getResponse();
        }
        
        if (cancel_words[lng].indexOf(instance)!==-1){
            let updatedIntent = handlerInput.requestEnvelope.request.intent;
            updatedIntent.slots.instance.value='';
            updatedIntent.slots.object.value=''
            updatedIntent.slots.list_subject.value=''
            updatedIntent.slots.item=''
            delete sessionAttributes.listTheTop;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(handlerInput.t('REPROMPT_MSG'))
                .reprompt()
                .getResponse(updatedIntent);
        }
        
        return handlerInput.responseBuilder
                .speak(message)
                .addElicitSlotDirective('item')
                .getResponse();
        
    }
};


const DeniedListTheTopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListTheTopIntent'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus === 'DENIED';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let updatedIntent = handlerInput.requestEnvelope.request.intent;
            updatedIntent.slots.instance.value='';
            updatedIntent.slots.object.value=''
            updatedIntent.slots.list_subject.value=''
            updatedIntent.slots.item=''
            delete sessionAttributes.listTheTop;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return handlerInput.responseBuilder
            .speak(handlerInput.t('REPROMPT_MSG'))
            .reprompt(handlerInput.t('REPROMPT_END_MSG'))
            .getResponse();
    }
};


/**
 * Handler esecuted when all slots are acquired and it's time to get the data from the database
 */
const ConfirmedListTheTopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListTheTopIntent'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus === 'CONFIRMED'; 
    },
    async handle(handlerInput) {
        
        const lng = Alexa.getLocale(handlerInput.requestEnvelope); 
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var updatedIntent = handlerInput.requestEnvelope.request.intent;
        var number = Alexa.getSlotValue(handlerInput.requestEnvelope, 'number');
        var subject = Alexa.getSlotValue(handlerInput.requestEnvelope, 'list_subject');
        var object = Alexa.getSlotValue(handlerInput.requestEnvelope, 'object');
        var instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'instance');
        var order = Alexa.getSlotValue(handlerInput.requestEnvelope, 'order');

        
        let en_subject=swap(lng,subject);
        let en_object=swap2(lng,object);
        
        var subject_id=subject_categories['en-US'].indexOf(en_subject)+1;
        var object_id=object_categories['en-US'].indexOf(en_object)+1;
        let order_id=orders[lng].indexOf(order)
        
        var url='cmd=lst&sub='+subject_id+'&obj='+object_id+'&ins='+instance+'&ord='+order_id+'&num='+number;
        
        var speak='';
        
        try{
            speak=await api.AccessApi(url);
        } catch(error){
            console.log(error);
        }

        var message='';
        var msg;
        
        if (instance==='no'){
            msg ='LIST_QUERY_2_MSG'
        } else {
            msg ='LIST_QUERY_1_MSG'
        }
        
        if (speak.result==='ok'){
            
            let sub=dict[lng]['sub'][en_subject][en_object];
            
            if(speak.hits === '1'){
                sub = singular(lng,sub);
            }
            //TODO to implement result msg
            message=handlerInput.t(msg, {num: number})
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



module.exports = {
    DeniedListTheTopIntentHandler,
    ListTheTopIntentHandler,
    ItemListTheTopIntentHandler,
    ConfirmedListTheTopIntentHandler
}