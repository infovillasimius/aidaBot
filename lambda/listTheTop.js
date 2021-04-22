const Alexa = require('ask-sdk-core');
const api = require('./api');
const parser = require('./parser')

/**
 * Language constants
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
const dict = logic.list_dict;
const in_prep = logic.in_prep;
const cancel_words =logic.cancel_words;
const orders=logic.orders;
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

/**
 * Handler executed when there are empty required slots
 */
const ListTheTopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListTheTopIntent'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED'
            && (!handlerInput.requestEnvelope.request.intent.slots.item.value
            || handlerInput.requestEnvelope.request.intent.slots.object.value);
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
        
        if(handlerInput.requestEnvelope.request.intent.slots.query.value){
            parser.slot_parser(handlerInput)
        }
        
        if (!sessionAttributes.listTheTop){
             sessionAttributes.listTheTop={};
        }
   
        else if (!number && !sessionAttributes.listTheTop.number){
            number = "3";
            sessionAttributes.listTheTop.number="3"
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
        
        else if (number && sessionAttributes.listTheTop.number!==number){
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
                .speak(handlerInput.t('LIST_ORDER_WRONG_MSG', {order: order}))
                .addElicitSlotDirective('order',updatedIntent)
                .getResponse();
        } 
        
        if(orders[lng].indexOf(order)===-1 && subject_categories[lng].indexOf(subject)===1){
            return handlerInput.responseBuilder
                .speak(handlerInput.t('LIST_PAPERS_ORDER_WRONG_MSG', {order: order}))
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
        
        if (lng==='it-IT'){
            updatedIntent.confirmationStatus="CONFIRMED"
        }
        
        let art=intent_confirmation_articles[lng][subject_categories[lng].indexOf(subject)]
        
        return handlerInput.responseBuilder
            .speak(handlerInput.t('LIST_INTENT_CONFIRMATION_2_MSG', {art:art, order:order, number:number, sub: handlerInput.t(dict[lng][order.split(' ')[0]]['sub'][en_subject][en_object]), inst: instance, prep: dict[lng][order.split(' ')[0]]['prep'][en_subject][en_object], obj:dict[lng][order.split(' ')[0]]['obj'][en_subject][en_object] }))
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
            && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED';
    },
    async handle(handlerInput) {
        const lng = Alexa.getLocale(handlerInput.requestEnvelope);
        let subject = Alexa.getSlotValue(handlerInput.requestEnvelope,'list_subject');
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
                    .speak(handlerInput.t('LIST_ORDER_WRONG_MSG', {order: order}))
                    .addElicitSlotDirective('order')
                    .getResponse();
            } 
            
            if(orders[lng].indexOf(order)===-1 && subject_categories[lng].indexOf(subject)===1){
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('LIST_PAPERS_ORDER_WRONG_MSG', {order: order}))
                    .addElicitSlotDirective('order')
                    .getResponse();
            }
            
            if(!legal_queries[en_subject]['all'][orders[lng].indexOf(order.split(' ')[0])]){
                let updatedIntent = handlerInput.requestEnvelope.request.intent;
                updatedIntent.slots.instance.value='';
                updatedIntent.slots.object.value=''
                updatedIntent.slots.list_subject.value=''
                delete sessionAttributes.listTheTop;
                delete sessionAttributes.ListTheTopIntentAuthors
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_SENSE_MSG'))
                    .reprompt(handlerInput.t('REPROMPT_END_MSG'))
                    .getResponse();
            }
            
            updatedIntent.slots.instance.value='all';
            updatedIntent.slots.object.value='all';
            let object=en_subject;
            
            if (lng==='it-IT'){
                updatedIntent.confirmationStatus="CONFIRMED"
            }
        
            let art=intent_confirmation_articles[lng][subject_categories[lng].indexOf(subject)]
                
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('LIST_INTENT_CONFIRMATION_1_MSG', {art:art, order:order, number:number, sub: handlerInput.t(dict[lng][order.split(' ')[0]]['sub'][en_subject][object]), prep: dict[lng][order.split(' ')[0]]['prep'][en_subject][object], obj:dict[lng][order.split(' ')[0]]['obj'][en_subject][object]}))
                    .addConfirmIntentDirective(updatedIntent)
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
        
        var url='cmd=fnd&ins='+instance;
        var speak='';
        
        
        /**
         * disambiguazione autore
         */
         if(sessionAttributes.listTheTop.Homonyms){
            let num=get_number(instance,lng)
            if(!isNaN(num) && num <= (sessionAttributes.listTheTop.Homonyms.item.length-1)){
                if (sessionAttributes.listTheTop.Homonyms.obj_id===2){
                    instance=sessionAttributes.listTheTop.Homonyms.item[num].acronym
                } else {
                    instance=sessionAttributes.listTheTop.Homonyms.item[num].name
                }
                speak=JSON.parse(JSON.stringify(sessionAttributes.listTheTop.Homonyms));
                speak["result"]="ok";
                speak["id"]=sessionAttributes.listTheTop.Homonyms.item[num].id;
                speak["item"]=instance;
                delete sessionAttributes.listTheTop.Homonyms;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
            } else {
                speak=sessionAttributes.listTheTop.Homonyms
            }
        } 
        
        else if(sessionAttributes.listTheTop.ItemList){
            let num=get_number(instance,lng)
            if(!isNaN(num) && num <= sessionAttributes.listTheTop.ItemList.num.reduce((a, b) => a + b, 0)){
                
                let ins = get_choice(sessionAttributes.listTheTop.ItemList,num);
                
                url='cmd=fnd&ins='+ins;
                
                delete sessionAttributes.listTheTop.ItemList;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes)

                try{
                    speak=await api.AccessApi(url);
                } catch(error){
                    console.log(error);
                }
            }
        }
        
        else {
            try{
                speak=await api.AccessApi(url);
            } catch(error){
                console.log(error);
            }
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
            
            return handlerInput.responseBuilder
            .addDelegateDirective(updatedIntent)
            .getResponse();
            
        } else if (speak.result==='ko'){
            
            message=(handlerInput.t('NO_RESULT_MSG', {item: instance}))
            
        } else if (speak.result==='kk'){
            message=kk_message(speak,lng,1);
            
            return handlerInput.responseBuilder
                .speak(handlerInput.t('TOO_GENERIC_MSG',{item: instance, results:message}))
                .addElicitSlotDirective('item')
                .getResponse();
                
        } else if (speak.result==='k2'){
            sessionAttributes.listTheTop.ItemList=speak;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
            message=choice_list(speak,lng);
            
            return handlerInput.responseBuilder
                .speak(handlerInput.t('ITEM_MSG',{inst: instance, msg:message}))
                .addElicitSlotDirective('item')
                .getResponse();
                
        } else if (speak.result==='ka'){
            sessionAttributes.listTheTop.Homonyms=speak;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
            let msg=homonyms(speak,lng);
            
            return handlerInput.responseBuilder
                .speak(handlerInput.t('HOMONYMS_MSG',{msg:msg, obj:homonyms_objects[lng][speak.obj_id-1]}))
                .addElicitSlotDirective('item')
                .getResponse();
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
        var item = Alexa.getSlotValue(handlerInput.requestEnvelope,'item');
        
        if(typeof(instance)==='undefined'){
            instance='all';
        }

        let en_subject=swap(lng,subject);
        let en_object=swap2(lng,object);
        
        
        var subject_id=subject_categories['en-US'].indexOf(en_subject)+1;
        var object_id=object_categories['en-US'].indexOf(en_object)+1;
        let order_id=orders[lng].indexOf(order)+1
        
        let ins=instance;
        
         if(object_id===4 || object_id===2){
            ins=item
        }
        
        var url='cmd=lst&sub='+subject_id+'&obj='+object_id+'&ins='+ins+'&ord='+order_id+'&num='+number;
        
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
            
            let sub=dict[lng][order.split(' ')[0]]['sub'][en_subject][en_object];
            let obj=dict[lng][order.split(' ')[0]]['obj'][en_subject][en_object];
            let prep=dict[lng][order.split(' ')[0]]['prep'][en_subject][en_object];
            
            if(number>speak.lst.length){
                number=speak.lst.length;
            }
            
            let art=intent_confirmation_articles[lng][subject_categories[lng].indexOf(subject)+5]
            
            if (speak.lst.length===1){
                sub = singular(lng,sub);
                number='';
                verb=list_verbs[lng][0];
                art=intent_confirmation_articles[lng][subject_categories[lng].indexOf(subject)+10]
            }
            
            if (speak.lst.length===0){
                message=handlerInput.t('LIST_NO_RESULT_MSG', {sub:sub, obj:obj, inst:instance, prep: prep})
            } else {
                message=handlerInput.t('LIST_QUERY_MSG', {art:art, num: number, sub:sub, obj:obj, inst:instance, prep: prep, order: order, lst: lst(speak,order,lng), verb:verb})
            }
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