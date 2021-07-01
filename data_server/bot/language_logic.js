
const intents = {
	'cancel': ['bye','goodbye'],
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
const tags_list = ['<br/>','<b>','</b>','<br/>','<ul>','</ul>','<li>','</li>','<i>','</i>'];
const marks_list = ['.','?',';',','];


const templates = {
	WELCOME_MSG: ['<b>Hello!</b> You can ask me to <b>describe</b>, <b>list</b>, or <b>count</b> any scholarly entity.','Welcome, you can ask me to <b>describe</b>, <b>list</b>, or <b>count</b> any scholarly entity. What would you like to try?'],
	HELLO_MSG: ['Hello! What can I do for you?', 'Hi! what could i do for you?'],
	OK_MSG: 'Ok',
    HELP_MSG: ['You can ask to <b>count</b> or <b>list</b> <i>authors</i>, <i>papers</i>, <i>conferences</i>, <i>organizations</i>, <i>topics</i> and <i>citations</i> or to <b>describe</b> <i>authors</i>, <i>conferences</i> or <i>organizations</i>. Start a query with <b>list</b>, <b>count</b> or <b>describe</b>.', 'You can ask a query starting with <b>count</b>, <b>list</b>, or <b>describe</b>.'],
    GOODBYE_MSG: ['Goodbye!','Bye!','See you later!'],
	REFLECTOR_MSG: 'You just triggered ${intent}',
	FALLBACK_MSG: 'Sorry, I don\'t know that. Please try again.',
	ERROR_MSG: 'Sorry, there was an error. Please try again.',
	
	HOMONYMS_MSG:'I found different homonyms (list sorted by number of publications): ${msg} ',
	
	SUBJECT_REQUEST_MSG:'I can count <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>citations</b>. What do you want me to count?',
	SUBJECT_WRONG_MSG:"Sorry, I can\'t count <b>${sub}</b>. I can count <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>citations</b>. What do you prefer?",
	SUBJECT_REQUEST_REPROMPT_MSG:'I can count <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>citations</b>. What do you prefer?',
	INSTANCE_MSG:"what is the <b>name</b> of the ${list} whose <b>${sub}</b> I should count? You can say <b>all</b> for the full list",
	INSTANCE2_MSG:"what is the <b>name</b> of the ${list} whose <b>${sub}</b> I should count?",
	ITEM_MSG:"Searching for <b>${ins}</b>, I got: ${msg}. <br/>To choose, say the number. Which one is correct?",
	INTENT_CONFIRMATION_1_MSG: "Do you want to know how many <b>${sub}</b> ${prep} ${obj} are in the AIDA database?",
	INTENT_CONFIRMATION_2_MSG: "Do you want to know how many <b>${sub}</b> ${prep} <b>${ins}</b> ${obj} are in the AIDA database?",
	TOO_GENERIC_MSG:"Your search for <b>${ins}</b> got ${results}. You need to try again and to be more specific. Could you tell me the exact name?",
	NO_RESULT_MSG:"Your search for ${ins} got no result. You need to try again. What could I search for you?",
	QUERY_1_MSG: "I found <b>${num}</b> ${sub} ${prep} <b>${ins}</b> ${obj}. <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?", 
	QUERY_2_MSG: "I found <b>${num}</b> different ${sub} ${prep} ${obj}. <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?",

	REPROMPT_MSG: 'So, what would you like to ask?',
	NO_QUERY_MSG: 'Sorry, you asked for a query that is not yet implemented. <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',

	REPROMPT_END_MSG: 'You could ask me for another query or say stop to quit',
	NO_SENSE_MSG:'I\'m sorry but the query resulting from the chosen options doesn\'t make sense. Try again. <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',
	
	LIST_WRONG_NUMBER_MSG:'The number ${num} is too big or too small, you should tell me a number higher than one and smaller than six',
	LIST_SUBJECT_REQUEST_MSG:'I can list <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>topics</b>. What do you want me to list?',
	LIST_SUBJECT_WRONG_MSG:'Sorry, I can\'t list <b>${sub}</b>. I can list <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>topics</b>. What do you prefer?',
	LIST_SUBJECT_REQUEST_REPROMPT_MSG:'I can list <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>topics</b>. What do you prefer?',
	LIST_ORDER_MSG: 'Which sorting option do you prefer between: <br/>(1) <b>publications</b>, <br/>(2) <b>citations</b>, <br/>(3) <b>publications in the last 5 years</b>, <br/>(4) <b>citations in the last 5 years</b>?',//'Do you want your list of the top ${num} ${sub} to be sorted by publications, by publications in the last 5 years, by citations or by citations in the last 5 years?',
	LIST_PAPERS_ORDER_MSG:'Which sorting option do you prefer between: (1) <b>citations</b> and (2) <b>citations in the last 5 years?</b>',//'Do you want your list of the top ${num} ${sub} to be sorted by citations or by citations in the last 5 years?',
	LIST_PAPERS_ORDER_WRONG_MSG:'Sorry, I can\'t list <b>${sub}</b> sorted by <b>${order}</b>. I can sort them by (1)  <b>citations</b> and by (2) <b>citations in the last 5 years</b>. What do you prefer?',
	LIST_ORDER_WRONG_MSG:'Sorry, I can\'t list <b>${sub}</b> sorted by <b>${order}</b>. I can sort them by: (1) <b>publications</b>, (2) <b>publications in the last 5 years</b>, (3) <b>citations</b>, (4) <b>citations in the last 5 years</b>. What do you prefer?',
	LIST_INSTANCE_MSG:'what is the <b>name</b> of the ${list} for which <b>${sub}</b> should be in the top ${num}? You can say <b>all</b> for the full list',
	LIST_INTENT_CONFIRMATION_1_MSG: 'Do you want to know which are the top ${num} <b>${sub}</b> ${prep} ${obj}, by number of <b>${order}</b>, in the AIDA database?',
	LIST_INTENT_CONFIRMATION_2_MSG: 'Do you want to know which are the top ${num} <b>${sub}</b>, by number of <b>${order}</b>, ${prep} <b>${ins}</b> ${obj} in the Aida database?',
	LIST_QUERY_MSG:'In the AIDA database, the top ${num} <b>${sub}</b> ${prep} <b>${ins}</b> ${obj} - by number of <b>${order}</b> - ${verb}: ${lst} <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',
	LIST_NO_RESULT_MSG:'In the AIDA database, there are no <b>${sub}</b> ${prep} <b>${ins}</b> ${obj}. <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',
	
	DSC_TOO_GENERIC_MSG:'Your search for <b>${ins}</b> got ${results}. You need to try again and to be more specific. What is the <b>name</b> of the <b>author</b> or <b>conference</b> or <b>organization</b> you want to know about?',
	DSC_NO_RESULT_MSG:'Your search for <b>${ins}</b> got no result. You need to try again. What is the name of the author or conference you want to know about?',
	DESCRIBE_INSTANCE_MSG: 'What is the <b>name</b> of the <b>author</b> or <b>conference</b> or <b>organization</b> you want to know about?',
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
	['authors','conference acronyms','conference names','organizations'],
    ['topics', 'conferences', 'organizations', 'authors', 'papers']    
]

const item_question_object = {
    'topics':'<b>topic</b> or ',
    'conferences':'<b>conference</b> or ',
    'organizations':'<b>organization</b> or ',
    'authors':'<b>author</b>'    
};

const numbers=[
	'1','2','3','4','5','6','7','8','9','10','one','two','three','four','five','six','seven','eight','nine','ten','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'
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

const cancel_words = ['cancel','stop', 'enough','no'];

const dsc_list=[' is an author',' affiliated to ',' affiliated to the ','Author rating: ','Publications: ' ,'Citations: ','Total number of co-authors: ','The top topic in terms of publications is: ','The top topics in terms of publications are: ','The top conference in terms of publications is: ', 'The top conferences in terms of publications are: ', 'The top journal in terms of publications is: ', 'The top journals in terms of publications are: ',', acronym of ',', is a conference whose main topics are: ', 'The rankings are: ','citations in the last 5 years: ','Years of activity: from ',' to ','Number of publications in the last year: ', 'The top country in terms of publications is: ', 'The top countries in terms of publications are: ', 'The top organization in education is: ', 'The top organizations in education are: ', 'The top organization in industry is: ', 'The top organizations in industry are: ','publications in the last 5 years: ','number of affiliated authors: '];

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
		let idx = query.indexOf(intents['describe'][i])
		if (idx == 0){
			query=query.substr(+intents['describe'][i].length+1,query.length);
			return query
		}
		if (idx > 0){
			query=query.substr(idx+intents['describe'][i].length+1,query.length);
			return query
		}
	}
	return query
}

function setUserMessage(msg){
	$('#bot').append('<div class="container"><img src="user.svg" alt="Avatar" class="right"><p>'+msg+'</p></div>')
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
	setAnimation();
}

function setAnimation(){
	$('#bot').append('<div class="container darker" id="thinker"><img src="spinner.gif" alt="Thinking" class="center" style="width:100%;"></div>')
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
}

function setMessage(msg,options){
	let value=templates[msg];
	let speak=templates[msg];
	if (Array.isArray(value)) {
        value = value[Math.floor(Math.random() * value.length)];
		speak = value;
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
			if(Array.isArray(options[i])){
				value = value.replace('${'+i+'}', options[i][0]);
				speak = speak.replace('${'+i+'}', options[i][1]);
			} else {
				value = value.replace('${'+i+'}', options[i]);
				speak = speak.replace('${'+i+'}', options[i]);
			}
			
		}
		for(let i in lst){
			value = value.replace(lst[i],'');
		}
	}
	
	while(value.indexOf('  ') > -1){
		value = value.replace('  ',' ');
	}
	
	value = value.replaceAll(' . ', '. ');
	value = value.replaceAll(' , ', ', ');
	
	appendMessage([value,speak])
}	

function appendMessage(value){
	let speak = '';
	if(Array.isArray(value)){
		speak = value[1];
		value = value[0];
	} else {
		speak = value;
	}
	$('#thinker').remove();
	$('#bot').append('<div class="container darker"><div class="logo"><img src="nao.svg" alt="Avatar"></div><div class="msg"><p>' + value + '</p></div></div>');
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
	say(speak);
}

function say(msg){
	if(!session.audio){
		return
	}

	for(let i in tags_list){
		msg = msg.replaceAll(tags_list[i],'');
	}

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
            message = message + speak.num[j] + (speak.num[j]>1 ? ' hits' : ' hit') + ' among the ' + obj_cat[cmd][j] + ', ';
        }
    }
    message = message.substring(0,message.length-2);
    return message;
}

function choice_list(speak){
    let message='';
	let msg='';
    let n=0;
    let cmd=(speak.cmd ? 0:1);
    for(let i in speak.num){
        if (speak.num[i]>0){
            msg+='<ol start='+(+1+n)+'>'
			for(let j in speak.keys[i]){
                msg+='<li>'+(speak.cmd ? speak.keys[i][j]['name'] : speak.keys[i][j]) + ';</li>';
				message+=numbers[n]+', ' +(speak.cmd ? speak.keys[i][j]['name'] : speak.keys[i][j]) + '; ';
                n+=1
            }
            message +=' among the '+ obj_cat[cmd][i] + '. ';
			msg +='</ol> among the '+ obj_cat[cmd][i] + '. ';
        }
    }
    message = message.substring(0,message.length-2);
	msg = msg.substring(0,msg.length-2);
    return [msg,message];
}

function homonyms(speak){
    let msg='';
    let num=0;
    let item=speak.item;
    for(let i in item){
        num = '<br/>say '+'<b>'+numbers[i]+'</b>'+' for ';
        msg += num+'<b>'+item[i].name+'</b>';
		/* if(item[i].publications) {
            msg += homonyms_list[2]+'<b>'+item[i].publications+'</b>'+homonyms_list[3]+", ";
		} */
        if(item[i].affiliation){
            msg += homonyms_list[0] +'<b>'+item[i].affiliation+"</b>; ";
        } else if(item[i].paper) {
            msg += homonyms_list[1] + '<b>' + item[i].paper+"</b>; ";
        } else if(item[i].country) {
            msg += ' - ' + '<b>' + item[i].country+"</b>; ";
        } else {
            msg+="; ";
        }
        if (i>9){
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
        msg += item_question_object['topics']
    }
    if (list_legal_queries[sub]['conferences'][1]){
        msg += item_question_object['conferences']
    }
    if (list_legal_queries[sub]['organizations'][1]){
        msg += item_question_object['organizations']
    }
    if (list_legal_queries[sub]['authors'][1]){
        msg += item_question_object['authors']
    }
    
	let s = msg.substring(msg.length - 4, msg.length);
	if (s===' or '){
		msg=msg.substring(0,msg.length-3)
	}
    return msg
}

function lst(result,order,sub){
    let o=orders.indexOf(order);
    let msg='<ul>';
    let ord;
	let list = result.lst;
    if(o===1 || o===3){
        for(let i in list){
            let author=''
            if(list[i].author && list[i].author.length>0){
                author = ' by '+'<b>'+upper_authors(list[i].author)+'</b>';
            }
            
            if(list[i].citations===1){
                list[i].citations='1'
                ord=list_order[o];
            } else { 
                ord=order;
            }
            
            msg +='<li><b><i>'+(sub=='authors' ? upper_first(list[i].name) : list[i].name[0].toUpperCase()+list[i].name.slice(1))+'</i></b>'+author+' with '+list[i].citations+' '+ord.split(' ')[0]+'; </li>'
        }
    } else {
        for(let i in list){
            let author=''
            if(list[i].author && list[i].author.length>0){
                author=' by '+'<b>'+upper_authors(list[i].author)+'</b>';
            }
            
            if(list[i].papers===1){
                list[i].papers='1'
                ord=list_order[o];
            } else { 
                ord=order;
            }
            
            msg+='<li><b><i>'+(sub=='authors' ? upper_first(list[i].name) : list[i].name[0].toUpperCase()+list[i].name.slice(1))+'</i></b>'+' with '+list[i].papers+' '+ord.split(' ')[0]+'; </li>'
        }
    }
    return msg+'</ul>';
}

function upper_authors(string){
	let author='';
	if(string.indexOf(' et al.')>-1){
		author=string.replace(' et al.','');
		author=upper_first(author);
		return author+' et al.';
	}
	return upper_first(string);
}

function list_elements(list,element){
    let blacklist=['computers science'];
	let blacklist2 = ['lecture notes in computer science', 'arxiv software engineering']
	if(element.length>0){
		for (let i in list){
			if(blacklist.indexOf(list[i][element])!==-1 || blacklist2.indexOf(list[i][element])!==-1){
				list.splice(i, 1); 
				i--;
			}
		}
	} else {
		for (let i in list){
			if(blacklist.indexOf(list[i])!==-1 || blacklist2.indexOf(list[i])!==-1){
				list.splice(i, 1); 
				i--;
			}
		}
	}
	let i=list.length;
	if (i>3){
		i=3
	}
    let msg='';
    let j=0;
	while(j<i){
		if(element.length>0){
			msg+='<li>'+upper_only_first(list[j][element])+';</li>'
		} else {
			msg+='<li>'+upper_only_first(list[j])+';</li>' 
		}
		j+=1;
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

function upper_only_first(s){
	return s[0].toUpperCase()+s.slice(1);
}

function dsc(query){
	let msg='';
    let item=query.item;
    if (query.obj_id===1){
        msg='<b>'+upper_first(item.name)+'</b>'+dsc_list[0];
        if(item.last_affiliation.affiliation_name){
            let s = item.last_affiliation.affiliation_name.split(' ');
            msg=msg+((s[0]==='the' || s[0]==='The') ? dsc_list[1]:dsc_list[2])+'<b>'+item.last_affiliation.affiliation_name+'</b>'
			if(item.last_affiliation.affiliation_country){
            msg+=', '+item.last_affiliation.affiliation_country+'. <br/>'
			}
        } else {
            msg+='. <br/>'
        }
        msg+=dsc_list[3];
		msg+='<ul>';
        if(item.publications){
            msg+='<li>'+dsc_list[4]+item.publications+'; </li>';
        }
        if(item.citations){
            msg+='<li>'+dsc_list[5]+item.citations+'; </li>';
        }
        if(item['h-index']){
            msg+='<li>'+'h-index: '+item['h-index']+'; </li>';
        }
        if(item['h5-index']){
            msg+='<li>'+'h5-index: '+item['h5-index']+'; </li>';
        }
        if (item['co_authors'] && item.co_authors>0){
            msg+='<li>'+dsc_list[6] + item.co_authors+'; </li>';
        }
		msg+='</ul>';
        if(item.top_pub_topics && item.top_pub_topics.length>0){
            msg+=(item.top_pub_topics.length==1 ? dsc_list[7]: dsc_list[8]);
            msg+='<ul>'+list_elements(item.top_pub_topics,'topic')+'</ul>';
        }
        if(item.top_pub_conf && item.top_pub_conf.length>0){
            msg+=(item.top_pub_conf.length==1 ? dsc_list[9]: dsc_list[10]);
            msg+='<ul>'+list_elements(item.top_pub_conf,'name')+'</ul>';
        }
        if(item.top_journals && item.top_journals.length>0){
            msg+=(item.top_journals.length==1 ? dsc_list[11]: dsc_list[12]);
            msg+='<ul>'+list_elements(item.top_journals,'name')+'</ul>';
        } 
    } else if (query.obj_id===2 || query.obj_id===3){
        msg+='<b>'+item.acronym+'</b>'+dsc_list[13]+'<b>'+item.name+'</b>'+ dsc_list[14];
        msg+='<ul>'+list_elements(item.topics,'')+'</ul>';
        msg+=dsc_list[15];
        msg+='<ul>';
		if(item['h5_index']){
            msg+='<li>'+'h5-index: '+item['h5_index']+'; </li>';
        }
        if(item['citationcount_5']){
            msg+='<li>'+dsc_list[16]+item['citationcount_5']+'; </li>';
        }
        if(item['activity_years']){
            msg+='<li>'+dsc_list[17]+item['activity_years']['from']+dsc_list[18]+item['activity_years']['to']+'; </li>';
        }
        if(item.last_year_publications){
            msg+='<li>'+dsc_list[19]+item.last_year_publications+'; </li>';
        }
		msg+='</ul>';
        if(item.top_3_country.length>0){
            msg+=(item.top_3_country.length==1 ? dsc_list[20]: dsc_list[21]);
            msg+='<ul>'+list_elements(item.top_3_country,'')+'</ul>';
        }
        if(item.top_3_edu.length>0){
            msg+=(item.top_3_edu.length==1 ? dsc_list[22]: dsc_list[23]);
            msg+='<ul>'+list_elements(item.top_3_edu,'')+'</ul>';
        }
        if(item.top_3_company.length>0){
            msg+=(item.top_3_company.length==1 ? dsc_list[24]:dsc_list[25]);
            msg+='<ul>'+list_elements(item.top_3_company,'')+'</ul>';
        }
        
    } else if (query.obj_id===4){
        msg+='<b>'+item.name+'</b>'+ (item.country ? ' - ' + item.country + ' -':'')+' is an organization';
		
		if(item.type && (item.type == 'academia' || item.type == 'industry')){
			
			msg += ' in ' + (item.type=='academia' ?'Edu':'Industry') + ' sector. <br/>';
		} else {
			msg += '. <br/>';
		}
		msg += '<br/>' + dsc_list[15] + '<br/>';
		msg+='<ul>';
		if(item['h5-index']){
            msg+='<li>'+'h5-index: '+item['h5-index']+'; </li>';
        }
		if(item['publications_5']){
            //alert(dsc_list.length)
			msg+='<li>'+dsc_list[26]+item['publications_5']+'; </li>';
        }
		if(item['citations_5']){
            msg+='<li>'+dsc_list[16]+item['citations_5']+'; </li>';
        }
		if(item['authors_number']){
            msg+='<li>'+dsc_list[27]+item['authors_number']+'; </li>';
        }
		msg+='</ul>';
		if(item.top_3_topics && item.top_3_topics.length>0){
            msg+=(item.top_3_topics.length==1 ? dsc_list[7]: dsc_list[8]);
            msg+='<ul>'+list_elements(item.top_3_topics,'')+'</ul>';
        }
		if(item.top_3_conferences && item.top_3_conferences.length>0){
            msg+=(item.top_3_conferences.length==1 ? dsc_list[9]: dsc_list[10]);
            msg+='<ul>'+list_elements(item.top_3_conferences,'')+'</ul>';
        }
		if(item.top_3_journals && item.top_3_journals.length>0){
            msg+=(item.top_3_journals.length==1 ? dsc_list[11]: dsc_list[12]);
            msg+='<ul>'+list_elements(item.top_3_journals,'')+'</ul>';
        } 
        
    } else {
        msg+='Sorry, Query not yet implemented!'
        return msg;
    }
    //msg = msg.substring(0,msg.length-7);
    return msg + 'You can ask to perform another query on the data contained in the AIDA database or ask for Help. <br/>What would you like to try?';
}

function fuzzy_search(list,string){
	let fuse = new Fuse(list, {includeScore: true})
	let result = fuse.search(string)
	if (result.length>0 && result[0].score<0.5){
		return result[0].item
	}
	return ''
}




