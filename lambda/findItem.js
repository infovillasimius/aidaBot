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

/**
 * Handler executed when there are empty required slots
 */
const FindItemIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FindItemIntent'
            && handlerInput.requestEnvelope.request.intent.confirmationStatus !== 'CONFIRMED';
    },
    async handle(handlerInput) {
        const lng = Alexa.getLocale(handlerInput.requestEnvelope); 
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var updatedIntent = handlerInput.requestEnvelope.request.intent;
        var item = Alexa.getSlotValue(handlerInput.requestEnvelope, 'item');
        var question={};
        
        sessionAttributes.FindItem={};
        
        let msg='I don\'t know what you want';
        let n;
        let word={};
        let s=item.split(' ');
        
        
        for (let k in s){
            
            if (!question.cmd){
                for (let i in cmds['list'][lng]){
                    if(s[k]===cmds['list'][lng][i]){
                        word={'value':'list','pos':k};
                        break;
                    }
                }
                
                for (let i in cmds['count'][lng]){
                    if(s[k]===cmds['count'][lng][i]){
                        word={'value':'count','pos':k};
                        break;
                    }
                }
                
                if (word.value){
                    question['cmd']=word;
                    word={}
                }
            }
            
            if(question.cmd && !question.subject && !isNaN(s[k])){
                question['num']={'value':s[k],'pos':k};
            }
            
            if (question.cmd && !question.subject){
                for (let i in subjects[question.cmd.value][lng]){
                    if(s[k]===subjects[question.cmd.value][lng][i]){
                        word={'value':subjects[question.cmd.value][lng][i],'pos':k};
                        break;
                    }
                }
                if (word.value){
                    question['subject']=word;
                    word={}
                }
            }
            
            if (question.subject && !question.object && k>parseInt(question.subject.pos)){
                for (let i in objects[lng]){
                    if(s[k]===objects[lng][i]){
                        word={'value':objects[lng][i],'pos':k};
                        break;
                    }
                }
                if (word.value){
                    question['object']=word;
                    word={}
                }
            }
            
            if (question.subject && !question.order && k>parseInt(question.subject.pos)){
                let i=orders[lng].indexOf(s[k]);
                if(i!==-1){
                    word={'value':orders[lng][i],'pos':k};
                }
                
                if (word.value){
                    question['order']=word;
                    word={}
                }
            }
            
            if (question.order && k>parseInt(question.order.pos) && !isNaN(s[k]) && parseInt(s[k])===5){
                question['order']={'value':orders[lng][orders[lng].indexOf(question.order.value)+2],'pos':question.order.pos};
            }
        }
        
        
        if(question.subject){
            let instance;
            if(question.object){
                instance=s.slice(parseInt(question.subject.pos)+1,parseInt(question.object.pos))
            } 
            
            else if(!question.object && question.order){
                instance=s.slice(parseInt(question.subject.pos)+1,parseInt(question.order.pos))
            } 
            
            else if(!question.object && !question.order){
                instance=s.slice(parseInt(question.subject.pos)+1,s.length)
            }
            let temp=[];
            for(let i in instance){
                if (prepositions[lng].indexOf(instance[i])===-1){
                    temp.push(instance[i]);
                }
            }
            instance=temp;
            if(s.indexOf(instance[0])!==-1){
                question['instance']={'value':instance.join(' '), 'pos':s.indexOf(instance[0])}
            } 
            
            else {
                question['instance']={'value':'all', 'pos':-1}
            }
        }
        
        if (!question.order){
            question['order']={'value':orders[lng][1],'pos':-1}
        }
        
        let intentName;
        let slots={}
        let newIntent;
        
        if (question.cmd){
            if(question.cmd.value==='list'){
                intentName='ListTheTopIntent';
                newIntent= {
        			"name": "ListTheTopIntent",
        			"confirmationStatus": "NONE",
        			"slots": {
        				"number": {
        					"name": "number",
        					"confirmationStatus": "NONE"
        				},
        				"item": {
        					"name": "item",
        					"confirmationStatus": "NONE"
        				},
        				"list_subject": {
        					"name": "list_subject",
        					"confirmationStatus": "NONE"
        				},
        				"instance": {
        					"name": "instance",
        					"confirmationStatus": "NONE"
        				},
        				"order": {
        					"name": "order",
        					"confirmationStatus": "NONE"
        				},
        				"object": {
        					"name": "object",
        					"confirmationStatus": "NONE"
        				}
        			}
		        }
            } else if (question.cmd.value==='count'){
                intentName='HowManyIntent';
                newIntent= {
					"name": "HowManyIntent",
					"confirmationStatus": "NONE",
					"slots": {
						"instance_of_querable_object": {
							"name": "instance_of_querable_object",
							"confirmationStatus": "NONE"
						},
						"item": {
							"name": "item",
							"confirmationStatus": "NONE"
						},
						"queryable_objects": {
							"name": "queryable_objects",
							"confirmationStatus": "NONE"
						},
						"subject": {
							"name": "subject",
							"confirmationStatus": "NONE"
						}
					}
				}
            }
        }
        
        if (question.num){
            newIntent.slots.number['value']=question.num.value;
        } 
        
        else if (question.cmd.value==='list') {
            newIntent.slots.number['value']=5;
        }
        
        if (question.subject && question.cmd.value==='list'){
            newIntent.slots.list_subject['value']=question.subject.value;
        }
        
        if (question.subject && question.cmd.value==='count'){
            newIntent.slots.subject['value']=question.subject.value;
        }
        
        if (question.instance){
            newIntent.slots.item['value']=question.instance.value;
            
        }
        
        if (question.order && question.cmd.value==='list'){
            newIntent.slots.order['value']=question.order.value;
        }
        
        
        if (question.cmd){
            msg='you want to ' + question.cmd.value;
        }
        
        if (question.num){
            msg=msg+' the top '+question.num.value;
        }
        
        if (question.subject){
            msg=msg +' ' + question.subject.value;
        }
        
        if (question.object){
            msg=msg +' ' + question.object.value;
        }
        
        if (question.order){
            msg=msg +' order by ' + question.order.value;
        }
        
        sessionAttributes.FindItem.question=question;
        sessionAttributes.FindItem.question=newIntent;
        sessionAttributes.FindItem.go=1;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
        
        return handlerInput.responseBuilder
            .addConfirmIntentDirective(newIntent)
            .speak(msg)
            .reprompt()
            .getResponse();
    }
};


module.exports = {
    FindItemIntentHandler
}
