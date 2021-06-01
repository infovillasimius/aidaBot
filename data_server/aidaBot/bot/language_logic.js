const api='http://aidabot.ddns.net/api?pass=123abc&';

const intents = {
	'cancel': ['stop','bye','goodbye'],
	'help': ['help'],
	'count': ['count', 'how many'],
	'list': ['list'],
	'describe': ['describe','who is','what about','what is','what','who'],
	'hello' : ['hello','hi']
}

const slots = {
	'count': ['sub','ins','obj'],
	'list' : ['num','sub','ins','obj','ord'],
	'describe' : ['ins']
}

const combinations = {
    'authors':'papers',
    'papers':'papers',
    'conferences':'conferences',
    'organizations':'organizations',
    'citations':'papers'
};

const subject_categories =['authors', 'papers', 'conferences', 'organizations', 'citations'];
const object_categories =['topics','conferences','organizations','authors','papers'];
const list_subject_categories = ['authors', 'papers', 'conferences', 'organizations', 'topics'];
const tags_list = ['<Br/>','<b>','</b>'];
const marks_list = ['.','?',';',','];


const templates = {
	WELCOME_MSG: ['<b>Hello!</b> You can ask me to <b>describe</b>, <b>list</b>, or <b>count</b> any scholarly entity.','Welcome, you can ask me to <b>describe</b>, <b>list</b>, or <b>count</b> any scholarly entity. What would you like to try?'],
	HELLO_MSG: ['Hello! What can I do for you?', 'Hi! what could i do for you?'],
	OK_MSG: 'Ok',
    HELP_MSG: ['You can ask to count or list authors, papers, conferences, organizations, topics and citations or to describe authors or conferences. Start a query with list, count or describe',
               'You can ask a query starting with count, list, describe, who or what'],
    GOODBYE_MSG: ['Goodbye!','Bye!','See you later!'],
	REFLECTOR_MSG: 'You just triggered ${intent}',
	FALLBACK_MSG: 'Sorry, I don\'t know that. Please try again.',
	ERROR_MSG: 'Sorry, there was an error. Please try again.',
	
	HOMONYMS_MSG:'I found different homonyms: ${msg} ',
	
	SUBJECT_REQUEST_MSG:'I can count papers, authors, conferences, organizations and citations. What do you want me to count?',
	SUBJECT_WRONG_MSG:"Sorry, I can\'t count ${sub}. I can count papers, authors, conferences, organizations and citations. What do you prefer?",
	SUBJECT_REQUEST_REPROMPT_MSG:'I can count papers, authors, conferences, organizations and citations. What do you prefer?',
	INSTANCE_MSG:"what is the name of the ${list} whose ${sub} I should count? You can say all for the full list",
	INSTANCE2_MSG:"what is the name of the ${list} whose ${sub} I should count?",
	ITEM_MSG:"Searching for ${ins}, I got ${msg}. To choose, say the number. Which one is correct?",
	INTENT_CONFIRMATION_1_MSG: "Do you want to know how many ${sub} ${prep} ${obj} are in the AIDA database?",
	INTENT_CONFIRMATION_2_MSG: "Do you want to know how many ${sub} ${prep} ${ins} ${obj} are in the AIDA database?",
	TOO_GENERIC_MSG:"Your search for ${ins} got ${results}. You need to try again and to be more specific. Could you tell me the exact name?",
	NO_RESULT_MSG:"Your search for ${ins} got no result. You need to try again. What could I search for you?",
	QUERY_1_MSG: "I found ${num} ${sub} ${prep} ${ins} ${obj}. You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?", 
	QUERY_2_MSG: "I found ${num} different ${sub} ${prep} ${obj}. You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?",

	REPROMPT_MSG: 'So, what would you like to ask?',
	NO_QUERY_MSG: 'Sorry, you asked for a query that is not yet implemented. You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',

	REPROMPT_END_MSG: 'You could ask me for another query or say stop to quit',
	NO_SENSE_MSG:'I\'m sorry but the query resulting from the chosen options doesn\'t make sense. Try again. You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',
	
	LIST_WRONG_NUMBER_MSG:'The number ${num} is too big or too small, you should tell me a number higher than one and smaller than six',
	LIST_SUBJECT_REQUEST_MSG:'I can list papers, authors, conferences, organizations and topics. What do you want me to list?',
	LIST_SUBJECT_WRONG_MSG:'Sorry, I can\'t list ${sub}. I can list papers, authors, conferences, organizations and topics. What do you prefer?',
	LIST_SUBJECT_REQUEST_REPROMPT_MSG:'I can list papers, authors, conferences, organizations and topics. What do you prefer?',
	LIST_ORDER_MSG:'Do you want your list of the top ${num} ${sub} to be sorted by publications, by publications in the last 5 years, by citations or by citations in the last 5 years?',
	LIST_PAPERS_ORDER_MSG:'Do you want your list of the top ${num} ${sub} to be sorted by citations or by citations in the last 5 years?',
	LIST_PAPERS_ORDER_WRONG_MSG:'Sorry, I can\'t list ${sub} sorted by ${order}. I can sort them by citations and by citations in the last 5 years. What do you prefer?',
	LIST_ORDER_WRONG_MSG:'Sorry, I can\'t list ${sub} sorted by ${order}. I can sort them by publications, by publications in the last 5 years, by citations and by citations in the last 5 years. What do you prefer?',
	LIST_INSTANCE_MSG:'what is the name of the ${list} for which ${sub} should be in the top ${num}? You can say all for the full list',
	LIST_INTENT_CONFIRMATION_1_MSG: 'Do you want to know which are the top ${num} ${sub} ${prep} ${obj}, by number of ${order}, in the AIDA database?',
	LIST_INTENT_CONFIRMATION_2_MSG: 'Do you want to know which are the top ${num} ${sub}, by number of ${order}, ${prep} ${ins} ${obj} in the Aida database?',
	LIST_QUERY_MSG:'In the AIDA database, the top ${num} ${sub} ${prep} ${ins} ${obj}, by number of ${order},  ${verb}: ${lst}. You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',
	LIST_NO_RESULT_MSG:'In the AIDA database, there are no ${sub} ${prep} ${ins} ${obj}. You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',
	
	DSC_TOO_GENERIC_MSG:'Your search for ${ins} got ${results}. You need to try again and to be more specific. What is the name of the author or conference you want to know about?',
	DSC_NO_RESULT_MSG:'Your search for ${ins} got no result. You need to try again. What is the name of the author or conference you want to know about?',
	DESCRIBE_INSTANCE_MSG: 'What is the name of the author or conference you want to know about?',
	DESCRIBE_CONFIRM_MSG : 'Do you want to know something about ${ins}?'
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
			'authors':'', 
			'papers':''
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
			'topics':'with papers on', 
			'conferences':'with papers at',
			'organizations':'',
			'authors':'with',
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
			'topics':'topic',
			'conferences':'conferences',
			'organizations':'',
			'authors':'',
			'papers':''
		},
		'papers':{
			'topics':'topic',
			'conferences':'conferences',
			'organizations':'',
			'authors':'',
			'papers':'papers'
		},
		'conferences':{
			'topics':'topic',
			'conferences':'',
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
			'topics':'topic',
			'conferences':'conferences',
			'organizations':'',
			'authors':'',
			'papers':''
	   }
	}
};

const count_legal_queries = {
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
};

const obj_cat = [
	['authors','conference acronyms','conference names'],
    ['topics', 'conferences', 'organizations', 'authors', 'papers']    
]

const item_question_object = {
    'topics':'topic or ',
    'conferences':'conference or ',
    'organizations':'organization or ',
    'authors':'author'    
};

const numbers=[
	'1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','1','2','3','4','5','6','7','8','9','10','one','two','three','four','five','six','seven','eight','nine','ten'
];

const list_legal_queries = {
    'authors':{
        'topics': [true, true],
        'conferences': [true,true],
        'organizations': [true,true],
        'authors': [false,false],
        'all': [true,true],
    },
    'papers':{
        'topics': [false, true],
        'conferences': [false,true],
        'organizations': [false,true],
        'authors': [false,true],
        'all': [false,true],
    },
    'conferences':{
        'topics': [true, true],
        'conferences': [false,false],
        'organizations': [true,true],
        'authors': [true,true],
        'all': [true,true],
    },
    'organizations':{
        'topics': [true, true],
        'conferences': [true,true],
        'organizations': [false,false],
        'authors': [false,false],
        'all': [true,true],
    },
    'topics':{
        'topics': [false, false],
        'conferences': [true,true],
        'organizations': [true,true],
        'authors': [true,true],
        'all': [true,true],
    }
};

const list_dict = {
	'publications':{
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
			'topics':{
				'topics':'topics',
				'conferences':'topics',
				'organizations':'topics',
				'authors':'topics',
				'papers':''
			}
		},
		'prep':{
			'authors':{
				'topics':'who have written papers on',
				'conferences':'who have written papers for',
				'organizations':'affiliated to the',
				'authors':'',
				'papers':''
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
				'topics':'with papers on',
				'conferences':'with papers at',
				'organizations':'',
				'authors':'with', 
				'papers':''
			},
			'topics':{
				'topics':'',
				'conferences':'of papers from',
				'organizations':'of papers written by authors affiliated to the',
				'authors':'of papers written by the author',
				'papers':''
			}
		},
		'obj':{
			'authors':{
				'topics':'topic',
				'conferences':'conferences',
				'organizations':'',
				'authors':'',
				'papers':''
			},
			'papers':{
				'topics':'topic',
				'conferences':'conferences',
				'organizations':'',
				'authors':'',
				'papers':'papers'
			},
			'conferences':{
				'topics':'topic',
				'conferences':'',
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
		   'topics':{
				'topics':'',
				'conferences':'conferences',
				'organizations':'',
				'authors':'',
				'papers':''
			}
		}
	},
	'citations':{
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
			'topics':{
				'topics':'topics',
				'conferences':'topics',
				'organizations':'topics',
				'authors':'topics',
				'papers':''
			}
		},
		'prep':{
			'authors':{
				'topics':'who have written papers on',
				'conferences':'who have written papers for',
				'organizations':'affiliated to the',
				'authors':'', 
				'papers':''
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
				'topics':'with papers on', 
				'conferences':'with papers at',
				'organizations':'',
				'authors':'with',
				'papers':''
			},
			'topics':{
				'topics':'',
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
				'papers':''
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
				'conferences':'',
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
		   'topics':{
				'topics':'',
				'conferences':'conferences',
				'organizations':'',
				'authors':'',
				'papers':''
			}
		}
	}
};

const orders = ['publications','citations','publications in the last 5 years', 'citations in the last 5 years'];

const homonyms_objects = ['topic','conference','organization','author','paper'];

const homonyms_list= [' affiliated with ',' author of the paper: ',', author with ',' publications']

const list_verbs = ['is','are'];

const list_order=['publication','citation','publication in the last 5 years', 'citation in the last 5 years']

const cancel_words = ['cancel','stop', 'enough','stop it','no'];

const dsc_list=[' is an author',' affiliated to ',' affiliated to the ','Author rating: ','Publications: ' ,'citations: ','Total number of co-authors: ','The top topic in terms of publications is: ','The top topics in terms of publications are: ','The top conference in terms of publications is: ', 'The top conferences in terms of publications are: ', 'The top journal in terms of publications is: ', 'The top journals in terms of publications are: ',', acronym of ',', is a conference whose focus areas are: ', 'Ratings: ','citations in the last 5 years: ','Years of activity: from ',' to ','Number of publications in the last year: ', 'The top country in terms of publications is: ', 'The top countries in terms of publications are: ', 'The top organization in education is: ', 'The top organizations in education are: ', 'The top organization in industry is: ', 'The top organizations in industry are: '];

function getIntent(msg){
	let message = msg.toLowerCase().split(" ");
	for(let key in intents){
		for(let i in message){
			for(let j in intents[key]){
				let words=intents[key][j].split(' ')
				let l = words.length
				for(let k in words){
					let z=(+i) + (+k)
					if(z < message.length && words[k]== message[z]){
						l -= 1
					}
				}
				if (l==0){
					return [key,intents[key][j]]
				}
			}
		}
	}
	return ['fallback','']
}

function getUserDescribeQueryText(msg){
	let query = msg;
	for(let i in intents['describe']){
		if (query.indexOf(intents['describe'][i])==0){
			query=query.substr(+intents['describe'][i].length+1,query.length);
			return query
		}
	}
	return query
}

function setUserMessage(msg){
	$('#bot').append('<div class="container"><img src="user.svg" alt="Avatar" class="right" style="width:100%;"><p>'+msg+'</p></div>')
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
	setAnimation();
}

function setAnimation(){
	$('#bot').append('<div class="container darker" id="thinker"><img src="spinner.gif" alt="Thinking" class="center" style="width:100%;"></div>')
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
}

function setMessage(msg,options){
	let value=templates[msg];
	if (Array.isArray(value)) {
        value = value[Math.floor(Math.random() * value.length)];
    }
	let lst=[];
	if(options){
		let n=0;
		let str = value;
		while(n>=0){
			n = str.indexOf("$",n+1);
			let n1 = str.indexOf("}",n)-n+1;
			let str1 = str.substr(n,n1);
			lst.push(str1);
		}
		lst.pop();
		for(let i in options){
			value = value.replace('${'+i+'}', options[i]);
		}
		for(let i in lst){
			value = value.replace(lst[i],'');
		}
	}
	appendMessage(value)
}	

function appendMessage(value){
	$('#thinker').remove();
	$('#bot').append('<div class="container darker"><div class="logo"><img src="nao.svg" alt="Avatar" style="width:100%;"></div><div class="msg"><p>' + value + '</p></div></div>');
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
	say(value);
}

function say(msg){
	if(!session.audio){
		window.speechSynthesis.cancel();
		return
	}
	for(let i in tags_list){
		msg = msg.replaceAll(tags_list[i],'');
	}
	/*
	if(window.speechSynthesis.speaking){
		window.speechSynthesis.cancel();
	}*/
	window.speechSynthesis.cancel();
	let voice_msg = new SpeechSynthesisUtterance(msg);
	voice_msg.lang = 'en-US';
	voice_msg.rate=0.90;
	window.speechSynthesis.speak(voice_msg);
}

function item_question(subject){
	let msg='';
	let sub=subject;
	if (count_legal_queries[sub]['topics'][0]){
		msg=msg+item_question_object['topics']
	}
	if (count_legal_queries[sub]['conferences'][0]){
		msg=msg+item_question_object['conferences']
	}
	if (count_legal_queries[sub]['organizations'][0]){
		msg=msg+item_question_object['organizations']
	}
	if (count_legal_queries[sub]['authors'][0]){
		msg=msg+item_question_object['authors']
	}
	let s = msg.substring(msg.length - 4, msg.length);
	if (s===' or '){
		msg=msg.substring(0,msg.length-3)
	} 
    return msg
}

function kk_message(speak,cmd){
    let message='';
    for (let j in speak.num){
        if (speak.num[j]>0){
            message = message + speak.num[j] + (speak.num[j]>1 ? 'hits' : 'hit') + ' among the ' + obj_cat[cmd][j] + ', ';
        }
    }
    message = message.substring(0,message.length-2);
    return message;
}

function choice_list(speak){
    let message='';
    let n=0;
    let cmd=(speak.cmd ? 0:1);
    for(let i in speak.num){
        if (speak.num[i]>0){
            for(let j in speak.keys[i]){
                message+=numbers[n]+', ' +(speak.cmd ? speak.keys[i][j]['name'] : speak.keys[i][j]) + ', ';
                n+=1
            }
            message +=' among the '+ obj_cat[cmd][i] + ', ';
        }
    }
    message=message.substring(0,message.length-2);
    return message;
}

function homonyms(speak){
    let msg='';
    let num=0;
    let item=speak.item;
    for(let i in item){
        num = '<Br/>say '+numbers[i]+' for '
        msg = msg+num+item[i].name
        if(item[i].affiliation){
            msg = msg + homonyms_list[0]+ item[i].affiliation+"; "
        } else if(item[i].paper) {
            msg = msg + homonyms_list[1]+ item[i].paper+"; "
        } else if(item[i].publications) {
            msg = msg + homonyms_list[2]+ item[i].publications+homonyms_list[3]+"; "
        } else {
            msg+="; "
        }
        if (i>8){
            return msg;
        }
    }
    return msg;
}

function get_number(item){
    let words=item.split(' ');
    for(let i in words){
        if (numbers.includes(words[i])){
            return (numbers.indexOf(words[i])%10)
        }
    }
    return NaN
}

function get_choice(speak,num){
    let n=0;
    for(let i in speak.num){
        n = num - speak.num[i];
        if(n<0 || i==speak.num.length-1){
            return speak.keys[i][num]
        } else {
            num = n
        }
    }
}

function list_item_question(subject){
    let msg='';
    let sub=subject;
    if (list_legal_queries[sub]['topics'][1]){
        msg=msg+item_question_object['topics']
    }
    if (list_legal_queries[sub]['conferences'][1]){
        msg=msg+item_question_object['conferences']
    }
    if (list_legal_queries[sub]['organizations'][1]){
        msg=msg+item_question_object['organizations']
    }
    if (list_legal_queries[sub]['authors'][1]){
        msg=msg+item_question_object['authors']
    }
    
	let s = msg.substring(msg.length - 4, msg.length);
	if (s===' or '){
		msg=msg.substring(0,msg.length-3)
	}
    return msg
}

function lst(result,order){
    let o=orders.indexOf(order);
    let msg=' ';
    let ord;
	let list = result.lst;
    if(o===1 || o===3){
        for(let i in list){
            let author=''
            if(list[i].author && list[i].author.length>0){
                author = ' by '+list[i].author
            }
            
            if(list[i].citations===1){
                list[i].citations='1'
                ord=list_order[o];
            } else { 
                ord=order;
            }
            
            msg = msg+' '+list[i].name+author+' with '+list[i].citations+' '+ord.split(' ')[0]+';'
        }
    } else {
        for(let i in list){
            let author=''
            if(list[i].author && list[i].author.length>0){
                author=' by '+list[i].author
            }
            
            if(list[i].papers===1){
                list[i].papers='1'
                ord=list_order[o];
            } else { 
                ord=order;
            }
            
            msg=msg+' '+list[i].name+author+' with '+list[i].papers+' '+ord.split(' ')[0]+';'
        }
    }
    msg = msg.substring(0,msg.length-1);
    return msg;
}

function list_elements(list,element){
    let blacklist=['computer science'];
	for (let i in list){
		if(blacklist.indexOf(list[i][element])!==-1){
			list.splice(i, 1); 
            i--;
		}
	}
    let msg='';
    let i=0;
    let j=0;
    let k=list.length;
    while(j<k && i<list.length){
        if(blacklist.indexOf(list[i][element])===-1){
            if(element.length>0){
                msg+=list[i][element]
            } else {
                msg+=list[i]
            }
            if(j==k-2){
                msg+=' and '
            } else if(j==k-1){
                msg+='; '
            } else {
                msg+=', '
            }
            j+=1
        }
        i+=1;
    }
    return msg;
}

function upper_first(str){
	s=str.split(' ');
	console.log(s)
	let result = ''
	for(let i in s){
		result+=' '+s[i][0].toUpperCase()+s[i].slice(1);
	}
	return result.slice(1);
}

function dsc(query){
    let msg='';
    let item=query.item;
    if (query.obj_id===1){
        msg=upper_first(item.name)+dsc_list[0];
        if(item.last_affiliation.affiliation_name){
            let s = item.last_affiliation.affiliation_name.split(' ');
            msg=msg+((s[0]==='the' || s[0]==='The') ? dsc_list[1]:dsc_list[2])+item.last_affiliation.affiliation_name
			if(item.last_affiliation.affiliation_country){
            msg+=', '+item.last_affiliation.affiliation_country+'. <Br/>'
			}
        } else {
            msg+='. <Br/>'
        }
        //msg+=dsc_list[3]+'<Br/>';
        if(item.publications){
            msg+=dsc_list[4]+item.publications+'; <Br/>';
        }
        if(item.citations){
            msg+=dsc_list[5]+item.citations+'; <Br/>';
        }
        if(item['h-index']){
            msg+='h-index: '+item['h-index']+'; <Br/>';
        }
        if(item['h5-index']){
            msg+='h5-index: '+item['h5-index']+'; <Br/>';
        }
        if (item['co_authors'] && item.co_authors>0){
            msg+=dsc_list[6] + item.co_authors+'; <Br/>'
        }
        if(item.top_pub_topics && item.top_pub_topics.length>0){
            msg+=(item.top_pub_topics.length==1 ? dsc_list[7]: dsc_list[8])
            msg+=list_elements(item.top_pub_topics,'topic')+'<Br/>'
        }
        if(item.top_pub_conf && item.top_pub_conf.length>0){
            msg+=(item.top_pub_conf.length==1 ? dsc_list[9]: dsc_list[10])
            msg+=list_elements(item.top_pub_conf,'name')+'<Br/>'
        }
        if(item.top_journals && item.top_journals.length>0){
            msg+=(item.top_journals.length==1 ? dsc_list[11]: dsc_list[12])
            msg+=list_elements(item.top_journals,'name')+'<Br/>'
        } 
    } else if (query.obj_id===2 || query.obj_id===3){
        msg+=item.acronym+dsc_list[13]+item.name+ dsc_list[14];
        msg+=list_elements(item.topics,'')+'<Br/>'
        //msg+='<Br/>'+dsc_list[15]+'<Br/>';
        if(item['h5_index']){
            msg+='h5-index: '+item['h5_index']+'; <Br/>';
        }
        if(item['citationcount_5']){
            msg+=dsc_list[16]+item['citationcount_5']+'; <Br/>';
        }
        if(item['activity_years']){
            msg+=dsc_list[17]+item['activity_years']['from']+dsc_list[18]+item['activity_years']['to']+'; <Br/>'
        }
        if(item.last_year_publications){
            msg+=dsc_list[19]+item.last_year_publications+'; <Br/>'
        }
        if(item.top_3_country.length>0){
            msg+=(item.top_3_country.length==1 ? dsc_list[20]: dsc_list[21])
            msg+=list_elements(item.top_3_country,'')+'<Br/>'
        }
        if(item.top_3_edu.length>0){
            msg+=(item.top_3_edu.length==1 ? dsc_list[22]: dsc_list[23])
            msg+=list_elements(item.top_3_edu,'')+'<Br/>'
        }
        if(item.top_3_company.length>0){
            msg+=(item.top_3_company.length==1 ? dsc_list[24]:dsc_list[25])
            msg+=list_elements(item.top_3_company,'')+'<Br/>'
        }
        
    } else {
        msg+='Sorry, Query not yet implemented!'
        return msg;
    }
    msg = msg.substring(0,msg.length-7);
    return msg + '.<Br/> You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?';
}







