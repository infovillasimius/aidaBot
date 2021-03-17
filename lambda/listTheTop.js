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
const lst = logic.lst;
const list_verbs=logic.list_verbs;

/**
 * Handler executed when there are empty required slots
 */
const ListTheTopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListTheTopIntent'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED'
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
   
        else if (!number && !sessionAttributes.listTheTop.number){
            number = "5";
            sessionAttributes.listTheTop.number="5"
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
            updatedIntent.slots.number.value=number;
        } 
        
        else if (number && (parseInt(number)>5 || parseInt(number)<2)){
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_WRONG_NUMBER_MSG', {number: number.toString()}))
                .reprompt(handlerInput.t('LIST_WRONG_NUMBER_MSG', {number: number.toString()}))
                .addElicitSlotDirective('number',updatedIntent)
                .getResponse();
        }
        
        else if (number && sessionAttributes.listTheTop!==number){
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
            
        if(subject && subject_categories[lng].indexOf(subject)===-1){
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_SUBJECT_WRONG_MSG', {sub: handlerInput.t(subject)}))
                .addElicitSlotDirective('list_subject',updatedIntent)
                .getResponse();
        } 
        
        if(subject && (!sessionAttributes.listTheTop.subject || sessionAttributes.listTheTop.subject!==subject)){
            sessionAttributes.listTheTop.subject=subject;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }
        
        if(!item && !instance && !sessionAttributes.listTheTop.instance) {
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_INSTANCE_MSG', {list:item_question(subject,lng), sub:article(lng,subject), number:number}))
                .addElicitSlotDirective('item',updatedIntent)
                .getResponse();
        }
        
        if(!order && subject_categories[lng].indexOf(subject)!==1) {
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_ORDER_MSG', {number:number, subject:article(lng,subject)}))
                .addElicitSlotDirective('order',updatedIntent)
                .getResponse();
        } 
        
        if(!order && subject_categories[lng].indexOf(subject)===1) {
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_PAPERS_ORDER_MSG', {number:number, subject:article(lng,subject)}))
                .addElicitSlotDirective('order',updatedIntent)
                .getResponse();
        } 
        
        if(orders[lng].indexOf(order)===-1 && subject_categories[lng].indexOf(subject)!==1){
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_ORDER_WRONG_MSG', {order: article(lng,order)}))
                .addElicitSlotDirective('order',updatedIntent)
                .getResponse();
        } 
        
        if(orders[lng].indexOf(order)===-1 && subject_categories[lng].indexOf(subject)===1){
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_PAPERS_ORDER_WRONG_MSG', {order: article(lng,order)}))
                .addElicitSlotDirective('order',updatedIntent)
                .getResponse();
        } 
        
        let en_subject=swap(lng,subject);
        let en_object=swap2(lng,object);
        
        if(!legal_queries[en_subject][en_object][orders[lng].indexOf(order.split(' ')[0])]){
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
            .speak(handlerInput.t('LIST_INTENT_CONFIRMATION_2_MSG', {order:order, number:number, sub: handlerInput.t(dict[lng]['sub'][subject][object]), inst: instance, prep: dict[lng]['prep'][subject][object], obj:dict[lng]['obj'][subject][object] }))
            .addConfirmIntentDirective(updatedIntent)
            .getResponse();
    }
};


/**
 * Handler esecuted when instance or item slot has a value 
 * and object slot is not filled
 * It finds value for query object with a request to the database server
 */
const ItemListTheTopIntentHandler = {
    
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListTheTopIntent'
            && (handlerInput.requestEnvelope.request.intent.slots.instance.value
            || handlerInput.requestEnvelope.request.intent.slots.item.value)
            && !handlerInput.requestEnvelope.request.intent.slots.object.value
            && (handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED' 
            || (sessionAttributes.FindItem && sessionAttributes.FindItem.go
            && sessionAttributes.FindItem.go===1 
            && handlerInput.requestEnvelope.request.intent.slots.instance.value!=='all' 
            && handlerInput.requestEnvelope.request.intent.slots.instance.value!=='no name' 
            && handlerInput.requestEnvelope.request.intent.slots.instance.value!=='no'));
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
            
            if(!order && subject_categories[lng].indexOf(subject)!==1) {
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('LIST_ORDER_MSG', {number:number, subject:article(lng,subject)}))
                    .addElicitSlotDirective('order')
                    .getResponse();
            } 
            
            if(!order && subject_categories[lng].indexOf(subject)===1) {
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('LIST_PAPERS_ORDER_MSG', {number:number, subject:article(lng,subject)}))
                    .addElicitSlotDirective('order')
                    .getResponse();
            } 
            
            if(orders[lng].indexOf(order)===-1 && subject_categories[lng].indexOf(subject)!==1){
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('LIST_ORDER_WRONG_MSG', {order: article(lng,order)}))
                    .addElicitSlotDirective('order')
                    .getResponse();
            } 
            
            if(orders[lng].indexOf(order)===-1 && subject_categories[lng].indexOf(subject)===1){
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('LIST_PAPERS_ORDER_WRONG_MSG', {order: article(lng,order)}))
                    .addElicitSlotDirective('order')
                    .getResponse();
            }
            
            if(!legal_queries[en_subject]['all'][orders[lng].indexOf(order.split(' ')[0])]){
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
            
            let updatedIntent = handlerInput.requestEnvelope.request.intent;
            updatedIntent.slots.instance.value='all';
            updatedIntent.slots.object.value='all';
            let object=en_subject;
            
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
            
            delete updatedIntent.slots.item.value
            return handlerInput.responseBuilder
            .addDelegateDirective(updatedIntent)
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
        
        if(typeof(instance)==='undefined'){
            instance='all';
        }

        let en_subject=swap(lng,subject);
        let en_object=swap2(lng,object);
        
        
        var subject_id=subject_categories['en-US'].indexOf(en_subject)+1;
        var object_id=object_categories['en-US'].indexOf(en_object)+1;
        let order_id=orders[lng].indexOf(order)+1
        
        var url='cmd=lst&sub='+subject_id+'&obj='+object_id+'&ins='+instance+'&ord='+order_id+'&num='+number;
        
        var speak='';
        
        try{
            speak=await api.AccessApi(url);
        } catch(error){
            console.log(error);
        }

        var message='';
        var msg;
        var verb=list_verbs[lng][1];

        if (speak.result==='ok'){
            
            if(object==='all'){
                en_object=en_subject;
                instance='';
            }
            
            let sub=dict[lng]['sub'][en_subject][en_object];
            
            if(number>speak.lst.length){
                number=speak.lst.length;
            }
            
            if (speak.lst.length===1){
                sub = singular(lng,sub);
                number='';
                verb=list_verbs[lng][0];
            }
            
            message=handlerInput.t('LIST_QUERY_MSG', {num: number, sub:sub, obj:dict[lng]['obj'][en_subject][en_object], inst:instance, prep: dict[lng]['prep'][en_subject][en_object], order: order, lst: lst(speak,order,lng), verb:verb})
        } 
        
        else {
            message=handlerInput.t('NO_QUERY_MSG');
        }
        
        delete sessionAttributes.listTheTop;
        delete sessionAttributes.ListTheTopIntent;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        
        return handlerInput.responseBuilder
            .speak(message)
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