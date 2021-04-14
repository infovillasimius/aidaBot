const Alexa = require('ask-sdk-core');
const api = require('./api');

/**
 * Language constants
 */
const logic = require('./language_logic');
const conjunction=logic.conjunction;
const hits = logic.hits;
const hit = logic.hit;
const article=logic.article;
const object_categories = logic.object_categories;
const in_prep = logic.in_prep;
const cancel_words = logic.cancel_words;
const dsc_obj_cat = logic.dsc_obj_cat;
const dsc = logic.dsc;
const homonyms=logic.homonyms;
const get_number=logic.get_number;

const DescribeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DescribeIntent'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'DENIED';
    },
    async handle(handlerInput) {
        var updatedIntent = handlerInput.requestEnvelope.request.intent;
        let instance = Alexa.getSlotValue(handlerInput.requestEnvelope, 'query');
        const lng = Alexa.getLocale(handlerInput.requestEnvelope); 
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        if(!sessionAttributes.DescribeIntent){
           sessionAttributes.DescribeIntent={}; 
        }
        
        if (cancel_words[lng].indexOf(instance)!==-1){
            let updatedIntent = handlerInput.requestEnvelope.request.intent;
            updatedIntent.slots.query.value='';
            delete sessionAttributes.DescribeIntent;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(handlerInput.t('REPROMPT_MSG'))
                .reprompt()
                .getResponse(updatedIntent);
        }
        var url='cmd=dsc&ins='+instance;
        var speak='';
        
        if(sessionAttributes.DescribeIntent.Authors){
            let num=get_number(instance,lng)
            if(!isNaN(num) && num < (sessionAttributes.DescribeIntent.Authors.length)){
                let ins=sessionAttributes.DescribeIntent.Authors[num].id
                
                url='cmd=dsc&ins='+ins;
                try{
                    speak=await api.AccessApi(url);
                } catch(error){
                    console.log(error);
                }
                delete sessionAttributes.DescribeIntent.Authors;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
                
            } else {
                speak={"result": "ka", "object": "authors", "obj_id": 4, "item": sessionAttributes.DescribeIntent.Authors}
            }
        } else {
            try{
                speak=await api.AccessApi(url);
            } catch(error){
                console.log(error);
            }
        }
        
        var message='';
        
        if (speak.result==='ok'){
            sessionAttributes.DescribeIntent.query = speak; 
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
            .speak(handlerInput.t("DESCRIBE_CONFIRM_MSG",{ins:speak.item.name}))
            .addConfirmIntentDirective(updatedIntent)
            .getResponse();
            
        } else if (speak.result==='ko'){
            message=(handlerInput.t('NO_RESULT_MSG', {item: instance}))
            
        } else if (speak.result==='kk'){
            message='';
            for (let j in speak.num){
                if (speak.num[j]>0){
                    if(speak.num[j]>1){
                        message = message + speak.num[j] + hits[lng] + article(lng,dsc_obj_cat[lng][j]) + ', ';
                    } else {
                        message = message + speak.num[j] + hit[lng] + article(lng,dsc_obj_cat[lng][j]) + ', ';
                    }
                }
            }
            return handlerInput.responseBuilder
                .speak(handlerInput.t('TOO_GENERIC_MSG',{item: instance, results:message}))
                .addElicitSlotDirective('query')
                .getResponse();
                
        } else if (speak.result==='k2'){
            message='';
            for(let i in speak.num){
                if (speak.num[i]>0){
                    for(let j in speak.keys[i]){
                        message = message + speak.keys[i][j].name + ', ';
                    }
                    message = message+in_prep[lng]+ article(lng,dsc_obj_cat[lng][i]) + ', '
                }
            }
            return handlerInput.responseBuilder
                .speak(handlerInput.t('ITEM_MSG',{inst: instance, msg:message}))
                .addElicitSlotDirective('query')
                .getResponse();
        } else if (speak.result==='ka'){
            sessionAttributes.DescribeIntent.Authors=speak.item;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
            let msg=homonyms(speak.item,lng);
            
            return handlerInput.responseBuilder
                .speak(handlerInput.t('HOMONYMS_MSG',{msg:msg}))
                .addElicitSlotDirective('query')
                .getResponse();
        }
        
        return handlerInput.responseBuilder
                .speak(message)
                .addElicitSlotDirective('query')
                .getResponse();
        
    }
};


const DeniedDescribeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DescribeIntent'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus === 'DENIED';
    },
    handle(handlerInput) {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        delete sessionAttributes.DescribeIntent;
        let updatedIntent = handlerInput.requestEnvelope.request.intent;
            updatedIntent.slots.query.value='';
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return handlerInput.responseBuilder
            .speak(handlerInput.t('REPROMPT_MSG'))
            .reprompt(handlerInput.t('REPROMPT_END_MSG'))
            .getResponse();
    }
};

const ConfirmedDescribeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DescribeIntent'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus === 'CONFIRMED'; 
    },
    async handle(handlerInput) {
        
        const lng = Alexa.getLocale(handlerInput.requestEnvelope); 
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var updatedIntent = handlerInput.requestEnvelope.request.intent;
        let object_id=sessionAttributes.DescribeIntent.query.obj_id;
        let query=sessionAttributes.DescribeIntent.query;
        let message;
        
        if(query){
            message=dsc(query,lng)
        } 
        
        else {
            message=handlerInput.t('NO_QUERY_MSG');
        }
        
        delete sessionAttributes.DescribeIntent;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        
        return handlerInput.responseBuilder
            .speak(message)
            .reprompt(handlerInput.t('REPROMPT_END_MSG'))
            .getResponse();
    }
};

module.exports = {
    DescribeIntentHandler,
    DeniedDescribeIntentHandler,
    ConfirmedDescribeIntentHandler
}