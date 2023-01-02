
const intents = {
	'cancel': ['bye', 'goodbye', 'see you', 'see you later'],
	'help': ['help'],
	'count': ['count', 'how many'],
	'list': ['list', 'enumerate'],
	'describe': ['describe', 'who is', 'what about', 'what is', 'what', 'who'],
	'hello': ['hello', 'hi'],
	'reset': ['cancel', 'stop'],
	'clear': ['clear', 'restart'],
	'compare': ['compare', 'equate', 'match', 'relate']
}

const slots = {
	'count': ['sub', 'ins', 'obj'],
	'list': ['num', 'sub', 'ins', 'obj', 'ord'],
	'describe': ['ins'],
	'compare': ['ins', 'ins2']
}

const combinations = {
	'authors': 'papers',
	'papers': 'papers',
	'conferences': 'conferences',
	'organizations': 'organizations',
	'citations': 'papers'
};

const subject_categories = ['authors', 'papers', 'conferences', 'organizations', 'citations'];
const object_categories = ['topics', 'conferences', 'organizations', 'authors', 'papers'];
const list_subject_categories = ['authors', 'papers', 'conferences', 'organizations', 'topics'];
const compare_categories = ['author', 'conference', 'conference', 'organization'];
const tags_list = ['<br/>', '<b>', '</b>', '<br/>', '<ul>', '</ul>', '<li>', '</li>', '<i>', '</i>', '</a>'];
const marks_list = ['.', '?', ';', ','];
const grid_marks_list = ['?', ';', ','];


const templates = {
	WELCOME_MSG: ['<b>Hello!</b> You can ask me to <b>describe</b>, <b>compare</b>, <b>list</b>, or <b>count</b> any scholarly entity.', 'Welcome, you can ask me to <b>describe</b>, <b>list</b>, or <b>count</b> any scholarly entity. What would you like to try?'],
	HELLO_MSG: ['Hello! What can I do for you?', 'Hi! what could i do for you?'],
	OK_MSG: 'Ok',
	HELP_MSG: ['You can ask to <b>count</b> or <b>list</b> <i>authors</i>, <i>papers</i>, <i>conferences</i>, <i>organizations</i>, <i>topics</i> and <i>citations</i> or to <b>describe</b> and <b>compare</b> <i>authors</i>, <i>conferences</i> or <i>organizations</i>. Start a query with <b>list</b>, <b>count</b>, <b>describe</b> or <b>compare</b>.', 'You can ask a query starting with <b>count</b>, <b>list</b>, <b>describe</b> or <b>compare</b>.'],
	GOODBYE_MSG: ['Goodbye!', 'Bye!', 'See you later!'],
	REFLECTOR_MSG: 'You just triggered ${intent}',
	FALLBACK_MSG: "Sorry, I don't know that. Please try again. You can enter one of the activation keys (<b>count</b>, <b>list</b>, <b>describe</b> or <b>compare</b>) to start the wizard that will help you formulate your query.",
	ERROR_MSG: 'Sorry, there was an error. Please try again.',

	HOMONYMS_MSG: 'I found different homonyms (list sorted by number of publications): ${msg} ',

	SUBJECT_REQUEST_MSG: 'I can count <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>citations</b>. What do you want me to count?',
	SUBJECT_WRONG_MSG: "Sorry, I can\'t count <b>${sub}</b>. I can count <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>citations</b>. What do you prefer?",
	SUBJECT_REQUEST_REPROMPT_MSG: 'I can count <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>citations</b>. What do you prefer?',
	INSTANCE_MSG: "I am sorry, I didn't understand. What is the <b>name</b> of the ${list} whose <b>${sub}</b> I should count? You can say <b>all</b> for the full list",
	INSTANCE2_MSG: "I am sorry, I didn't understand. What is the <b>name</b> of the ${list} whose <b>${sub}</b> I should count?",
	ITEM_MSG: "Searching for <b>${ins}</b>, I got: ${msg}. <br/>To choose, say the number. Which one is correct?",
	INTENT_CONFIRMATION_1_MSG: "Do you want to know how many <b>${sub}</b> ${prep} ${obj} are in the AIDA database?",
	INTENT_CONFIRMATION_2_MSG: "Do you want to know how many <b>${sub}</b> ${prep} <b>${ins}</b> ${obj} are in the AIDA database?",
	TOO_GENERIC_MSG: "Your search for <b>${ins}</b> got ${results}. You need to try again and to be more specific. Could you tell me the exact name?",
	NO_RESULT_MSG: "Your search for ${ins} got no result. You need to try again. What could I search for you?",
	QUERY_1_MSG: "I found <b>${num}</b> ${sub} ${prep} <b>${ins}</b> ${obj}. <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?",
	QUERY_2_MSG: "I found <b>${num}</b> different ${sub} ${prep} ${obj}. <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?",

	REPROMPT_MSG: 'So, what would you like to ask?',
	NO_QUERY_MSG: 'Sorry, you asked for a query that is not yet implemented. <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',

	REPROMPT_END_MSG: 'You could ask me for another query or say stop to quit',
	NO_SENSE_MSG: 'I\'m sorry but the query resulting from the chosen options doesn\'t make sense. Try again. <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',

	LIST_WRONG_NUMBER_MSG: 'The number ${num} , you should tell me a number higher than one and smaller than eleven.',
	LIST_SUBJECT_REQUEST_MSG: 'I can list <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>topics</b>. What do you want me to list?',
	LIST_SUBJECT_WRONG_MSG: 'Sorry, I can\'t list <b>${sub}</b>. I can list <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>topics</b>. What do you prefer?',
	LIST_SUBJECT_REQUEST_REPROMPT_MSG: 'I can list <b>papers</b>, <b>authors</b>, <b>conferences</b>, <b>organizations</b> and <b>topics</b>. What do you prefer?',
	LIST_ORDER_MSG: 'Which sorting option do you prefer between: (1) <b>publications</b>, (2) <b>citations</b>, (3) <b>publications in the last 5 years</b> and (4) <b>citations in the last 5 years</b>?',//'Do you want your list of the top ${num} ${sub} to be sorted by publications, by publications in the last 5 years, by citations or by citations in the last 5 years?',
	LIST_PAPERS_ORDER_MSG: 'Which sorting option do you prefer between: (1) <b>citations</b> and (2) <b>citations in the last 5 years?</b>',//'Do you want your list of the top ${num} ${sub} to be sorted by citations or by citations in the last 5 years?',
	LIST_PAPERS_ORDER_WRONG_MSG: 'Sorry, I can\'t list <b>${sub}</b> sorted by <b>${order}</b>. I can sort them by (1)  <b>citations</b> and by (2) <b>citations in the last 5 years</b>. What do you prefer?',
	LIST_ORDER_WRONG_MSG: 'Sorry, I can\'t list <b>${sub}</b> sorted by <b>${order}</b>. I can sort them by: (1) <b>publications</b>, (2) <b>publications in the last 5 years</b>, (3) <b>citations</b>, (4) <b>citations in the last 5 years</b>. What do you prefer?',
	LIST_INSTANCE_MSG: "I am sorry, I didn't understand. What is the <b>name</b> of the ${list} for which <b>${sub}</b> should be in the top ${num}? You can say <b>all</b> for the full list",
	LIST_INTENT_CONFIRMATION_1_MSG: 'Do you want to know which are the top ${num} <b>${sub}</b> ${prep} ${obj}, by number of <b>${order}</b>, in the AIDA database?',
	LIST_INTENT_CONFIRMATION_2_MSG: 'Do you want to know which are the top ${num} <b>${sub}</b>, by number of <b>${order}</b>, ${prep} <b>${ins}</b> ${obj} in the Aida database?',
	LIST_QUERY_MSG: 'In the AIDA database, the top ${num} <b>${sub}</b> ${prep} <b>${ins}</b> ${obj} - by number of <b>${order}</b> - ${verb}: ${lst} <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',
	LIST_NO_RESULT_MSG: 'In the AIDA database, there are no <b>${sub}</b> ${prep} <b>${ins}</b> ${obj}. <br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. What would you like to try?',

	DSC_TOO_GENERIC_MSG: 'Your search for <b>${ins}</b> got ${results}. You need to try again and to be more specific. What is the <b>name</b> of the <b>author</b> or <b>conference</b> or <b>organization</b> you want to know about? <br/>(for organizations you can enter the grid id)',
	DSC_NO_RESULT_MSG: 'Your search for <b>${ins}</b> got no result. You need to try again. What is the name of the author or conference or organization you want to know about? <br/>(for organizations you can enter the grid id)',
	DESCRIBE_INSTANCE_MSG: "I am sorry, I didn't understand. What is the <b>name</b> of the <b>author</b> or <b>conference</b> or <b>organization</b> you want to know about? <br/>(for organizations you can enter the grid id)",
	DESCRIBE_CONFIRM_MSG: 'Do you want to know something about ${ins}?',

	COMPARE_FIRST_INSTANCE: 'What is the <b> name </b> of the <b> author </b> or <b> conference </b> or <b> organization </b> that you want to use as the first term for the comparison?',
	COMPARE_SECOND_INSTANCE: ['What is the <b> name </b> of the <b> ${obj} </b> that you want to use as the second term for the comparison?', 'What is the <b> name </b> of the <b> ${obj} </b> that you want to compare to ${ins}?'],
	COMPARE_CONFIRM_MSG: 'Do you want to compare ${ins} to ${ins2}?',
	COMPARE_TOO_GENERIC_FIRST_MSG: 'Your search for <b>${ins}</b> got ${results}. You need to try again and to be more specific. What is the <b> name </b> of the <b> author </b> or <b> conference </b> or <b> organization </b> that you want to use as the first term for the comparison? <br/>(for organizations you can enter the grid id)',
	COMPARE_TOO_GENERIC_SECOND_MSG: 'Your search for <b>${ins}</b> got ${results}. You need to try again and to be more specific. What is the <b> name </b> of the <b> ${obj} </b> that you want to use as the second term for the comparison? <br/>(for organizations you can enter the grid id)',
	COMPARE_NO_RESULT_FIRST_MSG: 'Your search for <b>${ins}</b> got no result. You need to try again. What is the <b> name </b> of the <b> author </b> or <b> conference </b> or <b> organization </b> that you want to use as the first term for the comparison? <br/>(for organizations you can enter the grid id)',
	COMPARE_NO_RESULT_SECOND_MSG: 'Your search for <b>${ins}</b> got no result. You need to try again. What is the <b> name </b> of the <b> ${obj} </b> that you want to use as the second term for the comparison? <br/>(for organizations you can enter the grid id)',
	COMPARE_SAME_OBJ_MSG: "Hey, it's the same <b>${obj1}</b>! You can try two different ones or ask for Help. <br/>What would you like to try?",
	COMPARE_WRONG_PAIR_MSG: "Hey, I can't compare <b>${obj1}</b> to <b>${obj2}</b>! You can try two entities of the same type or ask for Help. <br/>What would you like to try?",
	COMPARE_AUTHORS_MSG: "<b>${author1}</b> has ${publications}, ${citations} and ${h_index} <b>${author2}</b> ${h_index_compare}. ${topics}<br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. <br/>What would you like to try?",
	COMPARE_CONFERENCE_MSG: "${conf1} started ${years} ${conf2} and has ${citations} citations in the last 5 years. ${name1} also has ${h5_index} ${name2} ${h_index_compare}. ${topics}<br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. <br/>What would you like to try?",
	COMPARE_ORGANIZATIONS_MESSAGE: "${org1} has ${publications} and ${citations} in the last 5 years. It also has ${h5_index} ${org2} ${h_index_compare}. ${topics}<br/>You can ask to perform another query on the data contained in the AIDA database or ask for Help. <br/>What would you like to try?"
}

const dict = {
	'sub': {
		'authors': {
			'topics': 'authors',
			'conferences': 'authors',
			'organizations': 'authors',
			'authors': 'authors',
			'papers': 'authors'
		},
		'papers': {
			'topics': 'papers',
			'conferences': 'papers',
			'organizations': 'papers',
			'authors': 'papers',
			'papers': ''
		},
		'conferences': {
			'topics': 'conferences',
			'conferences': 'conferences',
			'organizations': 'conferences',
			'authors': 'conferences',
			'papers': ''
		},
		'organizations': {
			'topics': 'organizations',
			'conferences': 'organizations',
			'organizations': 'organizations',
			'authors': 'organizations',
			'papers': ''
		},
		'citations': {
			'topics': 'citations',
			'conferences': 'citations',
			'organizations': 'citations',
			'authors': 'citations',
			'papers': ''
		}
	},
	'prep': {
		'authors': {
			'topics': 'who have written papers on',
			'conferences': 'who have written papers for',
			'organizations': 'affiliated to the',
			'authors': '',
			'papers': ''
		},
		'papers': {
			'topics': 'on',
			'conferences': 'from',
			'organizations': 'from authors affiliated to the',
			'authors': 'written by the author',
			'papers': ''
		},
		'conferences': {
			'topics': 'with papers on',
			'conferences': '',
			'organizations': 'with papers by authors affiliated to the',
			'authors': 'with papers written by the author',
			'papers': ''
		},
		'organizations': {
			'topics': 'with papers on',
			'conferences': 'with papers at',
			'organizations': '',
			'authors': 'with',
			'papers': ''
		},
		'citations': {
			'topics': 'of papers on',
			'conferences': 'of papers from',
			'organizations': 'of papers written by authors affiliated to the',
			'authors': 'of papers written by the author',
			'papers': ''
		}
	},
	'obj': {
		'authors': {
			'topics': 'topic',
			'conferences': 'conference',
			'organizations': '',
			'authors': '',
			'papers': ''
		},
		'papers': {
			'topics': 'topic',
			'conferences': 'conference',
			'organizations': '',
			'authors': '',
			'papers': 'papers'
		},
		'conferences': {
			'topics': 'topic',
			'conferences': '',
			'organizations': '',
			'authors': '',
			'papers': ''
		},
		'organizations': {
			'topics': '',
			'conferences': 'conference',
			'organizations': '',
			'authors': 'among their affiliated authors',
			'papers': ''
		},
		'citations': {
			'topics': 'topic',
			'conferences': 'conference',
			'organizations': '',
			'authors': '',
			'papers': ''
		}
	}
};

const count_legal_queries = {
	'authors': {
		'topics': [true, false],
		'conferences': [true, true],
		'organizations': [true, false],
		'authors': [false, false],
		'papers': [false, true],
	},
	'papers': {
		'topics': [true, false],
		'conferences': [true, true],
		'organizations': [true, false],
		'authors': [true, false],
		'papers': [false, true],
	},
	'conferences': {
		'topics': [true, false],
		'conferences': [false, true],
		'organizations': [true, false],
		'authors': [true, false],
		'papers': [false, false],
	},
	'organizations': {
		'topics': [true, false],
		'conferences': [true, false],
		'organizations': [false, true],
		'authors': [true, false],
		'papers': [false, false],
	},
	'citations': {
		'topics': [true, false],
		'conferences': [true, false],
		'organizations': [true, false],
		'authors': [true, false],
		'papers': [false, false],
	}
};

const obj_cat = [
	['authors', 'conference acronyms', 'conference names', 'organizations'],
	['topics', 'conferences', 'organizations', 'authors', 'papers']
]

const item_question_object = {
	'topics': '<b>topic</b> or ',
	'conferences': '<b>conference</b> or ',
	'organizations': '<b>organization</b> or ',
	'authors': '<b>author</b>'
};

const numbers = [
	'1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'
];

const list_legal_queries = {
	'authors': {
		'topics': [true, true],
		'conferences': [true, true],
		'organizations': [true, true],
		'authors': [false, false],
		'all': [true, true],
	},
	'papers': {
		'topics': [false, true],
		'conferences': [false, true],
		'organizations': [false, true],
		'authors': [false, true],
		'all': [false, true],
	},
	'conferences': {
		'topics': [true, true],
		'conferences': [false, false],
		'organizations': [true, true],
		'authors': [true, true],
		'all': [true, true],
	},
	'organizations': {
		'topics': [true, true],
		'conferences': [true, true],
		'organizations': [false, false],
		'authors': [false, false],
		'all': [true, true],
	},
	'topics': {
		'topics': [false, false],
		'conferences': [true, true],
		'organizations': [true, true],
		'authors': [true, true],
		'all': [true, true],
	}
};

const list_dict = {
	'publications': {
		'sub': {
			'authors': {
				'topics': 'authors',
				'conferences': 'authors',
				'organizations': 'authors',
				'authors': 'authors',
				'papers': 'authors'
			},
			'papers': {
				'topics': 'papers',
				'conferences': 'papers',
				'organizations': 'papers',
				'authors': 'papers',
				'papers': ''
			},
			'conferences': {
				'topics': 'conferences',
				'conferences': 'conferences',
				'organizations': 'conferences',
				'authors': 'conferences',
				'papers': ''
			},
			'organizations': {
				'topics': 'organizations',
				'conferences': 'organizations',
				'organizations': 'organizations',
				'authors': 'organizations',
				'papers': ''
			},
			'topics': {
				'topics': 'topics',
				'conferences': 'topics',
				'organizations': 'topics',
				'authors': 'topics',
				'papers': ''
			}
		},
		'prep': {
			'authors': {
				'topics': 'who have written papers on',
				'conferences': 'who have written papers for',
				'organizations': 'affiliated to the',
				'authors': '',
				'papers': ''
			},
			'papers': {
				'topics': 'on',
				'conferences': 'from',
				'organizations': 'from authors affiliated to the',
				'authors': 'written by the author',
				'papers': ''
			},
			'conferences': {
				'topics': 'with papers on',
				'conferences': '',
				'organizations': 'with papers by authors affiliated to the',
				'authors': 'with papers written by the author',
				'papers': ''
			},
			'organizations': {
				'topics': 'with papers on',
				'conferences': 'with papers at',
				'organizations': '',
				'authors': 'with',
				'papers': ''
			},
			'topics': {
				'topics': '',
				'conferences': 'of papers from',
				'organizations': 'of papers written by authors affiliated to the',
				'authors': 'of papers written by the author',
				'papers': ''
			}
		},
		'obj': {
			'authors': {
				'topics': 'topic',
				'conferences': 'conference',
				'organizations': '',
				'authors': '',
				'papers': ''
			},
			'papers': {
				'topics': 'topic',
				'conferences': 'conference',
				'organizations': '',
				'authors': '',
				'papers': 'papers'
			},
			'conferences': {
				'topics': 'topic',
				'conferences': '',
				'organizations': '',
				'authors': '',
				'papers': ''
			},
			'organizations': {
				'topics': '',
				'conferences': 'conference',
				'organizations': '',
				'authors': 'among their affiliated authors',
				'papers': ''
			},
			'topics': {
				'topics': '',
				'conferences': 'conference',
				'organizations': '',
				'authors': '',
				'papers': ''
			}
		}
	},
	'citations': {
		'sub': {
			'authors': {
				'topics': 'authors',
				'conferences': 'authors',
				'organizations': 'authors',
				'authors': 'authors',
				'papers': 'authors'
			},
			'papers': {
				'topics': 'papers',
				'conferences': 'papers',
				'organizations': 'papers',
				'authors': 'papers',
				'papers': ''
			},
			'conferences': {
				'topics': 'conferences',
				'conferences': 'conferences',
				'organizations': 'conferences',
				'authors': 'conferences',
				'papers': ''
			},
			'organizations': {
				'topics': 'organizations',
				'conferences': 'organizations',
				'organizations': 'organizations',
				'authors': 'organizations',
				'papers': ''
			},
			'topics': {
				'topics': 'topics',
				'conferences': 'topics',
				'organizations': 'topics',
				'authors': 'topics',
				'papers': ''
			}
		},
		'prep': {
			'authors': {
				'topics': 'who have written papers on',
				'conferences': 'who have written papers for',
				'organizations': 'affiliated to the',
				'authors': '',
				'papers': ''
			},
			'papers': {
				'topics': 'on',
				'conferences': 'from',
				'organizations': 'from authors affiliated to the',
				'authors': 'written by the author',
				'papers': ''
			},
			'conferences': {
				'topics': 'with papers on',
				'conferences': '',
				'organizations': 'with papers by authors affiliated to the',
				'authors': 'with papers written by the author',
				'papers': ''
			},
			'organizations': {
				'topics': 'with papers on',
				'conferences': 'with papers at',
				'organizations': '',
				'authors': 'with',
				'papers': ''
			},
			'topics': {
				'topics': '',
				'conferences': 'of papers from',
				'organizations': 'of papers written by authors affiliated to the',
				'authors': 'of papers written by the author',
				'papers': ''
			}
		},
		'obj': {
			'authors': {
				'topics': 'topics',
				'conferences': 'conference',
				'organizations': '',
				'authors': '',
				'papers': ''
			},
			'papers': {
				'topics': 'topics',
				'conferences': 'conference',
				'organizations': '',
				'authors': '',
				'papers': 'papers'
			},
			'conferences': {
				'topics': 'topics',
				'conferences': '',
				'organizations': '',
				'authors': '',
				'papers': ''
			},
			'organizations': {
				'topics': '',
				'conferences': 'conference',
				'organizations': '',
				'authors': 'among their affiliated authors',
				'papers': ''
			},
			'topics': {
				'topics': '',
				'conferences': 'conference',
				'organizations': '',
				'authors': '',
				'papers': ''
			}
		}
	}
};

const orders = ['publications', 'citations', 'publications in the last 5 years', 'citations in the last 5 years'];

const homonyms_objects = ['topic', 'conference', 'organization', 'author', 'paper'];

const homonyms_list = [' affiliated with ', ' author of the paper: ', ', author with ', ' publications'];

const list_verbs = ['is', 'are'];

const list_order = ['publication', 'citation', 'publication in the last 5 years', 'citation in the last 5 years'];

const cancel_words = ['cancel', 'stop', 'enough', 'no'];

const dsc_list = [' is an author', ' affiliated to ', ' affiliated to the ', 'Author rating: ', 'Publications: ', 'Citations: ', 'Total number of co-authors: ', 'The top topic in terms of publications is: ', 'The top topics in terms of publications are: ', 'The top conference in terms of publications is: ', 'The top conferences in terms of publications are: ', 'The top journal in terms of publications is: ', 'The top journals in terms of publications are: ', ', acronym of ', ', is a conference', 'The rankings are: ', 'citations in the last 5 years: ', 'Years of activity: from ', ' to ', 'Number of publications in the last year: ', 'The top country in terms of publications is: ', 'The top countries in terms of publications are: ', 'The top organization in education is: ', 'The top organizations in education are: ', 'The top organization in industry is: ', 'The top organizations in industry are: ', 'publications in the last 5 years: ', 'number of affiliated authors: ', ', active between ', ' whose main topics are: '];

const compare_preps = [' to ', ' with ', ' vs ', 'against', ' and '];
const compare_valid_combinations = ['1-1', '2-2', '2-3', '3-2', '3-3', '4-4']

function getIntent(msg) {
	let message = msg.toLowerCase().split(" ");
	for (let key in intents) {
		for (let i in message) {
			for (let j in intents[key]) {
				let words = intents[key][j].split(' ')
				let l = words.length
				for (let k in words) {
					let z = (+i) + (+k)
					if (z < message.length && words[k] == message[z]) {
						l -= 1
					}
				}
				if (l == 0) {
					return [key, intents[key][j]]
				}
			}
		}
	}
	return ['fallback', '']
}

function getUserDescribeQueryText(msg) {
	let query = msg;
	for (let i in intents['describe']) {
		let idx = query.indexOf(intents['describe'][i])
		if (idx == 0) {
			query = query.substr(+intents['describe'][i].length + 1, query.length);
			return query
		}
		if (idx > 0) {
			query = query.substr(idx + intents['describe'][i].length + 1, query.length);
			return query
		}
	}
	return query
}

function getInstancesFromQuery(query) {
	for (prep in compare_preps) {
		instances = query.split(compare_preps[prep])
		if (instances.length > 1) {
			return instances
		}
	}
	return [query]
}

// TODO
function getUserCompareQueryText(msg) {
	let query = msg;
	for (let i in intents['compare']) {
		let idx = query.indexOf(intents['compare'][i])
		if (idx == 0) {
			query = query.substr(+intents['compare'][i].length + 1, query.length);
			return getInstancesFromQuery(query)
		}
		if (idx > 0) {
			query = query.substr(idx + intents['compare'][i].length + 1, query.length);
			return getInstancesFromQuery(query)
		}
	}
	return getInstancesFromQuery(query)
}

function setUserMessage(msg) {
	$('#thinker').remove();
	$('#bot').append('<div class="container"><img src="user.svg" alt="Avatar" class="right"><p>' + msg + '</p></div>')
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
	setAnimation();
	set_timeout();
}

function setAnimation() {
	$('#bot').append('<div class="container darker" id="thinker"><img src="spinner.gif" alt="Thinking" class="center" style="width:100%;"></div>')
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
}

function setMessage(msg, options) {
	let value = templates[msg];
	let speak = templates[msg];
	if (Array.isArray(value)) {
		value = value[Math.floor(Math.random() * value.length)];
		speak = value;
	}
	let lst = [];
	if (options) {
		let n = 0;
		let str = value;
		while (n >= 0) {
			n = str.indexOf("$", n + 1);
			let n1 = str.indexOf("}", n) - n + 1;
			let str1 = str.substr(n, n1);
			lst.push(str1);
		}
		lst.pop();
		for (let i in options) {
			if (Array.isArray(options[i])) {
				value = value.replace('${' + i + '}', options[i][0]);
				speak = speak.replace('${' + i + '}', options[i][1]);
			} else {
				value = value.replace('${' + i + '}', options[i]);
				speak = speak.replace('${' + i + '}', options[i]);
			}

		}
		for (let i in lst) {
			value = value.replace(lst[i], '');
		}
	}

	while (value.indexOf('  ') > -1) {
		value = value.replace('  ', ' ');
	}

	value = value.replaceAll(' . ', '. ');
	value = value.replaceAll(' , ', ', ');

	appendMessage([value, speak])
}

function appendMessage(value) {
	let speak = '';
	if (Array.isArray(value)) {
		speak = value[1];
		value = value[0];
	} else {
		speak = value;
	}
	$('#thinker').remove();
	$('#bot').append('<div class="container darker"><div class="logo"><img src="nao.svg" alt="Avatar"></div><div class="msg"><p>' + value + '</p></div></div>');
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
	say(speak);
	cancel_timeout()
}

function set_timeout() {
	let new_systemTimeout = setTimeout(function () {
		json_call.abort();
		setMessage("ERROR_MSG");
		session_reset()
	}, millisec_to_timeout);
	systemTimeout.push(new_systemTimeout);
}

function cancel_timeout() {
	for (let i in systemTimeout) {
		clearTimeout(systemTimeout[i]);
	}
}

function say(msg) {
	if (!session.audio) {
		return
	}

	for (let i in tags_list) {
		msg = msg.replaceAll(tags_list[i], '');
	}

	while (msg.indexOf('<a') != -1) {
		let i = msg.indexOf('<a');
		let f = msg.indexOf('>', i);
		msg = msg.replace(msg.substring(i, +f + 1), '')
	}

	window.speechSynthesis.cancel();
	let voice_msg = new SpeechSynthesisUtterance(msg);
	voice_msg.lang = 'en-US';
	voice_msg.rate = 0.90;
	window.speechSynthesis.speak(voice_msg);
}

function item_question(subject) {
	let msg = '';
	let sub = subject;
	if (count_legal_queries[sub]['topics'][0]) {
		msg = msg + item_question_object['topics']
	}
	if (count_legal_queries[sub]['conferences'][0]) {
		msg = msg + item_question_object['conferences']
	}
	if (count_legal_queries[sub]['organizations'][0]) {
		msg = msg + item_question_object['organizations']
	}
	if (count_legal_queries[sub]['authors'][0]) {
		msg = msg + item_question_object['authors']
	}
	let s = msg.substring(msg.length - 4, msg.length);
	if (s === ' or ') {
		msg = msg.substring(0, msg.length - 3)
	}
	return msg
}

function kk_message(speak, cmd) {
	let message = '';
	for (let j in speak.num) {
		if (speak.num[j] > 0) {
			message = message + speak.num[j] + (speak.num[j] > 1 ? ' hits' : ' hit') + ' among the ' + obj_cat[cmd][j] + ', ';
		}
	}
	message = message.substring(0, message.length - 2);
	return message;
}

function choice_list(speak) {
	let message = '';
	let msg = '';
	let n = 0;
	let cmd = (speak.cmd ? 0 : 1);
	for (let i in speak.num) {
		if (speak.num[i] > 0) {
			msg += '<ol start=' + (+1 + n) + '>'
			for (let j in speak.keys[i]) {
				item = speak.cmd ? speak.keys[i][j]['name'] : speak.keys[i][j]
				if ((!speak.cmd && i == 3) || (speak.cmd && i == 0)) {
					item = upper_first(item)
				}
				msg += '<li>' + item + ';</li>';
				message += numbers[n] + ', ' + (speak.cmd ? speak.keys[i][j]['name'] : speak.keys[i][j]) + '; ';
				n += 1
			}
			message += ' among the ' + obj_cat[cmd][i] + '. ';
			msg += '</ol> among the ' + obj_cat[cmd][i] + '. ';
		}
	}
	message = message.substring(0, message.length - 2);
	msg = msg.substring(0, msg.length - 2);
	return [msg, message];
}

function homonyms(speak) {
	let msg = '';
	let num = 0;
	let item = speak.item;
	for (let i in item) {
		num = '<br/>say ' + '<b>' + numbers[i] + '</b>' + ' for ';
		let name = item[i].name
		if (speak.object == 'authors') {
			name = upper_first(name)
		}
		msg += num + '<b>' + name + '</b>';
		/* if(item[i].publications) {
			msg += homonyms_list[2]+'<b>'+item[i].publications+'</b>'+homonyms_list[3]+", ";
		} */
		if (item[i].affiliation) {
			msg += homonyms_list[0] + '<b>' + item[i].affiliation + "</b>; ";
		} else if (item[i].paper) {
			msg += homonyms_list[1] + '<b>' + item[i].paper + "</b>; ";
		} else if (item[i].country) {
			msg += ' - ' + '<b>' + item[i].country + "</b>; ";
		} else {
			msg += "; ";
		}
		if (i > 9) {
			return msg;
		}
	}
	return msg;
}

function get_number(item) {
	let words = item.split(' ');
	for (let i in words) {
		if (numbers.includes(words[i])) {
			return (numbers.indexOf(words[i]) % 10)
		}
	}
	return NaN
}

function get_choice(speak, num) {
	let n = 0;
	for (let i in speak.num) {
		n = num - speak.num[i];
		if (n < 0 || i == speak.num.length - 1) {
			return speak.keys[i][num]
		} else {
			num = n
		}
	}
}

function list_item_question(subject) {
	let msg = '';
	let sub = subject;
	if (list_legal_queries[sub]['topics'][1]) {
		msg += item_question_object['topics']
	}
	if (list_legal_queries[sub]['conferences'][1]) {
		msg += item_question_object['conferences']
	}
	if (list_legal_queries[sub]['organizations'][1]) {
		msg += item_question_object['organizations']
	}
	if (list_legal_queries[sub]['authors'][1]) {
		msg += item_question_object['authors']
	}

	let s = msg.substring(msg.length - 4, msg.length);
	if (s === ' or ') {
		msg = msg.substring(0, msg.length - 3)
	}
	return msg
}

function lst(result, order, sub) {
	let o = orders.indexOf(order);
	let msg = '<ul>';
	let ord;
	let list = result.lst;
	if (o === 1 || o === 3) {
		for (let i in list) {
			let author = ''
			if (list[i].author && list[i].author.length > 0) {
				author = ' by ' + '<b>' + upper_authors(list[i].author) + '</b>';
			}

			if (list[i].citations === 1) {
				list[i].citations = '1'
				ord = list_order[o];
			} else {
				ord = order;
			}

			msg += '<li><b><i>' + (sub == 'authors' ? upper_first(list[i].name) : list[i].name[0].toUpperCase() + list[i].name.slice(1)) + '</i></b>' + author + ' with ' + list[i].citations + ' ' + ord.split(' ')[0] + '; </li>'
		}
	} else {
		for (let i in list) {
			let author = ''
			if (list[i].author && list[i].author.length > 0) {
				author = ' by ' + '<b>' + upper_authors(list[i].author) + '</b>';
			}

			if (list[i].papers === 1) {
				list[i].papers = '1'
				ord = list_order[o];
			} else {
				ord = order;
			}

			msg += '<li><b><i>' + (sub == 'authors' ? upper_first(list[i].name) : list[i].name[0].toUpperCase() + list[i].name.slice(1)) + '</i></b>' + ' with ' + list[i].papers + ' ' + ord.split(' ')[0] + '; </li>'
		}
	}
	return msg + '</ul>';
}

function upper_authors(string) {
	let author = '';
	if (string.indexOf(' et al.') > -1) {
		author = string.replace(' et al.', '');
		author = upper_first(author);
		return author + ' et al.';
	}
	return upper_first(string);
}

function list_elements(list, element) {
	let blacklist = ['computers science'];
	let blacklist2 = ['lecture notes in computer science', 'arxiv software engineering']
	if (element.length > 0) {
		for (let i in list) {
			if (blacklist.indexOf(list[i][element]) !== -1 || blacklist2.indexOf(list[i][element]) !== -1) {
				list.splice(i, 1);
				i--;
			}
		}
	} else {
		for (let i in list) {
			if (blacklist.indexOf(list[i]) !== -1 || blacklist2.indexOf(list[i]) !== -1) {
				list.splice(i, 1);
				i--;
			}
		}
	}
	let i = list.length;
	if (i > 3) {
		i = 3
	}
	let msg = '';
	let j = 0;
	while (j < i) {
		if (element.length > 0) {
			msg += '<li>' + upper_only_first(list[j][element]) + ';</li>'
		} else {
			msg += '<li>' + upper_only_first(list[j]) + ';</li>'
		}
		j += 1;
	}
	return msg;
}

function upper_first(str) {
	s = str.split(' ');
	let result = ''
	for (let i in s) {
		result += ' ' + s[i][0].toUpperCase() + s[i].slice(1);
	}
	return result.slice(1);
}

function upper_only_first(s) {
	return s[0].toUpperCase() + s.slice(1);
}

function dsc(query) {
	let msg = '';
	let item = query.item;
	if (query.obj_id === 1) {
		msg = '<b>' + upper_first(item.name) + '</b>' + dsc_list[0];
		if (item.last_affiliation.affiliation_name) {
			let s = item.last_affiliation.affiliation_name.split(' ');
			msg = msg + ((s[0] === 'the' || s[0] === 'The') ? dsc_list[1] : dsc_list[2]) + '<b>' + item.last_affiliation.affiliation_name + '</b>'
			if (item.last_affiliation.affiliation_country) {
				msg += ', ' + item.last_affiliation.affiliation_country + '. <br/>'
			}
		} else {
			msg += '. <br/>'
		}
		msg += dsc_list[3];
		msg += '<ul>';
		if (item.publications) {
			msg += '<li>' + dsc_list[4] + item.publications + '; </li>';
		}
		if (item.citations) {
			msg += '<li>' + dsc_list[5] + item.citations + '; </li>';
		}
		if (item['h-index']) {
			msg += '<li>' + 'h-index: ' + item['h-index'] + '; </li>';
		}
		if (item['h5-index']) {
			msg += '<li>' + 'h5-index: ' + item['h5-index'] + '; </li>';
		}
		if (item['co_authors'] && item.co_authors > 0) {
			msg += '<li>' + dsc_list[6] + item.co_authors + '; </li>';
		}
		msg += '</ul>';
		if (item.top_pub_topics && item.top_pub_topics.length > 0) {
			msg += (item.top_pub_topics.length == 1 ? dsc_list[7] : dsc_list[8]);
			msg += '<ul>' + list_elements(item.top_pub_topics, 'topic') + '</ul>';
		}
		if (item.top_pub_conf && item.top_pub_conf.length > 0) {
			msg += (item.top_pub_conf.length == 1 ? dsc_list[9] : dsc_list[10]);
			msg += '<ul>' + list_elements(item.top_pub_conf, 'name') + '</ul>';
		}
		if (item.top_journals && item.top_journals.length > 0) {
			msg += (item.top_journals.length == 1 ? dsc_list[11] : dsc_list[12]);
			msg += '<ul>' + list_elements(item.top_journals, 'name') + '</ul>';
		}
	} else if (query.obj_id === 2 || query.obj_id === 3) {
		msg += '<b>' + item.acronym + '</b>' + dsc_list[13] + '<b>' + item.name + '</b>' + dsc_list[14];
		if (item['activity_years']) {
			msg += dsc_list[28] + item['activity_years']['from'] + ' and ' + item['activity_years']['to'] + ', ';
		}
		msg += dsc_list[29];
		msg += '<ul>' + list_elements(item.topics, '') + '</ul>';
		msg += dsc_list[15];
		msg += '<ul>';
		if (item['h5_index']) {
			msg += '<li>' + 'h5-index: ' + item['h5_index'] + '; </li>';
		}
		if (item['citationcount_5']) {
			msg += '<li>' + dsc_list[16] + item['citationcount_5'] + '; </li>';
		}

		if (item.last_year_publications) {
			msg += '<li>' + dsc_list[19] + item.last_year_publications + '; </li>';
		}
		msg += '</ul>';
		if (item.top_3_country.length > 0) {
			msg += (item.top_3_country.length == 1 ? dsc_list[20] : dsc_list[21]);
			msg += '<ul>' + list_elements(item.top_3_country, '') + '</ul>';
		}
		if (item.top_3_edu.length > 0) {
			msg += (item.top_3_edu.length == 1 ? dsc_list[22] : dsc_list[23]);
			msg += '<ul>' + list_elements(item.top_3_edu, '') + '</ul>';
		}
		if (item.top_3_company.length > 0) {
			msg += (item.top_3_company.length == 1 ? dsc_list[24] : dsc_list[25]);
			msg += '<ul>' + list_elements(item.top_3_company, '') + '</ul>';
		}
		let url = encodeURI('http://aida.kmi.open.ac.uk/dashboard/' + item.name + ' (' + item.acronym + ')');
		msg += 'More information on <a href="' + url + '" + target="_blank">AIDA Dashboard. </a><br/>'

	} else if (query.obj_id === 4) {
		msg += '<b>' + item.name + '</b>' + (item.country ? ' - ' + item.country + ' -' : '') + ' is an organization';

		if (item.type && (item.type == 'academia' || item.type == 'industry')) {

			msg += ' in ' + (item.type == 'academia' ? 'Edu' : 'Industry') + ' sector. <br/>';
		} else {
			msg += '. <br/>';
		}
		msg += '<br/>' + dsc_list[15] + '<br/>';
		msg += '<ul>';
		if (item['h5-index']) {
			msg += '<li>' + 'h5-index: ' + item['h5-index'] + '; </li>';
		}
		if (item['publications_5']) {
			//alert(dsc_list.length)
			msg += '<li>' + dsc_list[26] + item['publications_5'] + '; </li>';
		}
		if (item['citations_5']) {
			msg += '<li>' + dsc_list[16] + item['citations_5'] + '; </li>';
		}
		if (item['authors_number']) {
			msg += '<li>' + dsc_list[27] + item['authors_number'] + '; </li>';
		}
		msg += '</ul>';
		if (item.top_3_topics && item.top_3_topics.length > 0) {
			msg += (item.top_3_topics.length == 1 ? dsc_list[7] : dsc_list[8]);
			msg += '<ul>' + list_elements(item.top_3_topics, '') + '</ul>';
		}
		if (item.top_3_conferences && item.top_3_conferences.length > 0) {
			msg += (item.top_3_conferences.length == 1 ? dsc_list[9] : dsc_list[10]);
			msg += '<ul>' + list_elements(item.top_3_conferences, '') + '</ul>';
		}
		if (item.top_3_journals && item.top_3_journals.length > 0) {
			msg += (item.top_3_journals.length == 1 ? dsc_list[11] : dsc_list[12]);
			msg += '<ul>' + list_elements(item.top_3_journals, '') + '</ul>';
		}

	} else {
		msg += 'Sorry, Query not yet implemented!'
		return msg;
	}
	//msg = msg.substring(0,msg.length-7);
	return msg + 'You can ask to perform another query on the data contained in the AIDA database or ask for Help. <br/>What would you like to try?';
}

function fuzzy_search(list, string) {
	let fuse = new Fuse(list, { includeScore: true })
	let result = fuse.search(string)
	if (result.length > 0 && result[0].score < 0.5) {
		return result[0].item
	}
	return ''
}

function is_list_legal(sub, obj, order) {
	if (order) {
		return list_legal_queries[sub][obj][orders.indexOf(order.split(' ')[0])]
	}
	return list_legal_queries[sub][obj][0] || list_legal_queries[sub][obj][1]
}

function get_help() {
	setMessage('HELP_MSG');
}

function cmp(term1, term2) {
	//console.log(term1, term2)
	let comb = term1.obj_id + '-' + term2.obj_id;
	if (compare_valid_combinations.indexOf(comb) < 0) {
		setMessage('COMPARE_WRONG_PAIR_MSG', { 'obj1': term1.object, 'obj2': term2.object });
	}

	if (JSON.stringify(term1.item) == JSON.stringify(term2.item)) {
		setMessage('COMPARE_SAME_OBJ_MSG', { 'obj1': compare_categories[term1.obj_id - 1] });
	}
	parameters = {};

	if (term1.obj_id == 1) {
		pub_diff = term1.item.publications - term2.item.publications;
		let publications;
		parameters.author1 = upper_first(term1.item.name);
		parameters.author2 = upper_first(term2.item.name);
		if (pub_diff != 0) {
			publications = Math.abs(pub_diff) + (pub_diff < 0 ? ' fewer ' : ' more ') + 'publications (' + term1.item.publications + ' vs ' + term2.item.publications + ')';
		} else {
			publications = 'the same number of publications ' + '(' + term1.item.publications + ')';
		}
		parameters.publications = publications;

		let cit_diff = term1.item.citations - term2.item.citations;
		let citations;
		if (cit_diff != 0) {
			citations = Math.abs(cit_diff) + (cit_diff < 0 ? ' fewer ' : ' more ') + 'citations (' + term1.item.citations + ' vs ' + term2.item.citations + ')';
		} else {
			citations = 'the same number of citations ' + '(' + term1.item.citations + ')';
		}
		parameters.citations = citations;

		let h_index_diff = term1.item['h-index'] - term2.item['h-index'];
		let h_index;
		if (h_index_diff != 0) {
			h_index = 'an h-index ' + Math.abs(h_index_diff) + ' points' + (h_index_diff < 0 ? ' lower ' : ' higher ') + ' than ';
			h_index_compare = ' (' + term1.item['h-index'] + ' vs ' + term2.item['h-index'] + ') '
		} else {
			h_index = 'the same h-index as ';
			h_index_compare = ' (' + term1.item['h-index'] + ') '
		}
		parameters.h_index = h_index
		parameters.h_index_compare = h_index_compare;

		let topics = '';
		let name1 = '<b>' + parameters.author1.split(' ')[0] + '</b>';
		let name2 = '<b>' + parameters.author2.split(' ')[0] + '</b>';
		let topics1 = term1.item.top_pub_topics
		let topics2 = term2.item.top_pub_topics
		topic_analysis = commons(topics1, topics2, term1.obj_id)

		if (topic_analysis.commons.length > 0) {
			topics = 'Both of them work in ' + list2string(topic_analysis.commons) + '. '
		}

		if (topic_analysis.first.length > 0 && topic_analysis.second.length > 0) {
			topics += name1 + ' focuses more on ' + list2string(topic_analysis.first) + ' while ' + name2 + ' focuses more on ' + list2string(topic_analysis.second) + '. '
		} else if (topic_analysis.first.length > 0) {
			topics += name1 + ' focuses more on ' + list2string(topic_analysis.first) + '. '
		} else if (topic_analysis.second.length > 0) {
			topics += name2 + ' focuses more on ' + list2string(topic_analysis.second) + '. '
		}

		parameters.topics = topics;
		setMessage('COMPARE_AUTHORS_MSG', parameters);
		return
	}

	if (term1.obj_id == 2 || term1.obj_id == 3) {
		let conf1 = '<b>'
		let conf2 = '<b>'
		if (term1.item.name.toLowerCase().indexOf('conference') > 0) {
			conf1 += term1.item.name + '</b>';
		} else {
			conf1 += term1.item.name + '</b> conference'
		}
		if (term2.item.name.toLowerCase().indexOf('conference') > 0) {
			conf2 += term2.item.name + '</b>';
		} else {
			conf2 += term2.item.name + '</b> conference'
		}

		parameters.conf1 = conf1;
		parameters.conf2 = conf2;
		parameters.name1 = '<b>' + term1.item.acronym + '</b>'
		parameters.name2 = '<b>' + term2.item.acronym + '</b>'

		activity_diff = term1.item.activity_years.from - term2.item.activity_years.from;
		let num = Math.abs(activity_diff) + (activity_diff < 0 ? ' years after ' : ' years before ')
		if (activity_diff == 0) {
			num = 'the same year as';
		}
		parameters.years = num;

		cit_diff = term1.item.citationcount_5 - term2.item.citationcount_5;
		let citations = Math.abs(cit_diff) + (cit_diff < 0 ? ' less ' : ' more ')
		if (cit_diff == 0) {
			citations = 'the same number of';
		}
		parameters.citations = citations;

		let h_index_diff = term1.item['h5_index'] - term2.item['h5_index'];
		let h_index;
		let h_index_compare;
		if (h_index_diff != 0) {
			h_index = 'an h5-index ' + Math.abs(h_index_diff) + ' points' + (h_index_diff < 0 ? ' lower ' : ' higher ') + ' than ';
			h_index_compare = '(' + term1.item['h5_index'] + ' vs ' + term2.item['h5_index'] + ')'
			
		} else {
			h_index = 'the same h5-index ' + ' as ';
			h_index_compare = '(' + term1.item['h5_index'] + ') '
		}
		parameters.h5_index = h_index
		parameters.h_index_compare = h_index_compare;

		let topics1 = term1.item.topics
		let topics2 = term2.item.topics
		topic_analysis = commons(topics1, topics2, term1.obj_id)
		let topics = '';
		if (topic_analysis.commons.length > 0) {
			topics = 'Both have ' + list2string(topic_analysis.commons) + ' as their main topic'
		}

		if(topic_analysis.commons.length > 1){
			topics += 's. '
		} else if (topic_analysis.commons.length > 0) {
			topics += '. '
		}

		if (topic_analysis.first.length > 0 && topic_analysis.second.length > 0) {
			topics += parameters.name1 + ' focuses more on ' + list2string(topic_analysis.first) + ' while ' + parameters.name2 + ' focuses more on ' + list2string(topic_analysis.second) + '. '
		} else if (topic_analysis.first.length > 0) {
			topics += parameters.name1 + ' focuses more on ' + list2string(topic_analysis.first) + '. '
		} else if (topic_analysis.second.length > 0) {
			topics += parameters.name2 + ' focuses more on ' + list2string(topic_analysis.second) + '. '
		}

		parameters.topics = topics;

		setMessage('COMPARE_CONFERENCE_MSG', parameters);
		return
	}

	if (term1.obj_id == 4) {
		parameters.org1 = '<b>' + term1.item.name + '</b>';
		parameters.org2 = '<b>' + term2.item.name + '</b>';

		pub_diff = term1.item.publications_5 - term2.item.publications_5;
		let publications;

		if (pub_diff != 0) {
			publications = Math.abs(pub_diff) + (pub_diff < 0 ? ' fewer ' : ' more ') + 'publications (' + term1.item.publications_5 + ' vs ' + term2.item.publications_5 + ')';
		} else {
			publications = 'the same number of publications ' + '(' + term1.item.publications_5 + ')';
		}
		parameters.publications = publications;

		let cit_diff = term1.item.citations_5 - term2.item.citations_5;
		let citations;
		if (cit_diff != 0) {
			citations = Math.abs(cit_diff) + (cit_diff < 0 ? ' fewer ' : ' more ') + 'citations (' + term1.item.citations_5 + ' vs ' + term2.item.citations_5 + ')';
		} else {
			citations = 'the same number of citations ' + '(' + term1.item.citations_5 + ')';
		}
		parameters.citations = citations;

		let h_index_diff = term1.item['h5-index'] - term2.item['h5-index'];
		let h_index;
		if (h_index_diff != 0) {
			h_index = 'an h5-index ' + Math.abs(h_index_diff) + ' points' + (h_index_diff < 0 ? ' lower ' : ' higher ') + ' than ';
			h_index_compare = ' (' + term1.item['h5-index'] + ' vs ' + term2.item['h5-index'] + ') ';
		} else {
			h_index = 'the same h5-index ' + ' as ';
			h_index_compare = ' (' + term1.item['h5-index'] + ') ';
		}
		parameters.h5_index = h_index
		parameters.h_index_compare = h_index_compare;

		let topics = '';
		let topics1 = term1.item.top_3_topics
		let topics2 = term2.item.top_3_topics
		topic_analysis = commons(topics1, topics2, term1.obj_id)

		if (topic_analysis.commons.length > 0) {
			topics = 'Both have ' + list2string(topic_analysis.commons) + ' as their main topic'
		}

		if(topic_analysis.commons.length > 1){
			topics += 's. '
		} else if (topic_analysis.commons.length > 0) {
			topics += '. '
		}

		if (topic_analysis.first.length > 0 && topic_analysis.second.length > 0) {
			topics += parameters.org1 + ' focuses more on ' + list2string(topic_analysis.first) + ' while ' + parameters.org2 + ' focuses more on ' + list2string(topic_analysis.second) + '. '
		} else if (topic_analysis.first.length > 0) {
			topics += parameters.org1 + ' focuses more on ' + list2string(topic_analysis.first) + '. '
		} else if (topic_analysis.second.length > 0) {
			topics += parameters.org2 + ' focuses more on ' + list2string(topic_analysis.second) + '. '
		}

		parameters.topics = topics;

		setMessage('COMPARE_ORGANIZATIONS_MESSAGE', parameters);
		return
	}
}

function commons(l1, l2, obj_id) {
	let l = [];
	let topics1 = [];
	let topics2 = [];

	if (obj_id == 1) {
		for (topic in l1) {
			for (topic2 in l2) {
				if (l1[topic].topic == l2[topic2].topic) {
					l.push(l1[topic].topic);
				}
			}
		}

		for (topic in l1) {
			if (l.indexOf(l1[topic].topic) == -1) {
				topics1.push(l1[topic].topic)
			}
		}

		for (topic in l2) {
			if (l.indexOf(l2[topic].topic) == -1) {
				topics2.push(l2[topic].topic)
			}
		}


	} else {
		for (topic in l1) {
			if (l2.indexOf(l1[topic]) != -1) {
				l.push(l1[topic])
			}
		}
		for (topic in l1) {
			if (l.indexOf(l1[topic]) == -1) {
				topics1.push(l1[topic])
			}
		}

		for (topic in l2) {
			if (l.indexOf(l2[topic]) == -1) {
				topics2.push(l2[topic])
			}
		}
	}

	//console.log({ commons: l, first: topics1, second: topics2 })
	return { commons: l, first: topics1, second: topics2 }
}

function list2string(word_list) {
	n = word_list.length;
	word_string = '';
	for (i in word_list) {
		if (i < n - 2) {
			word_string += word_list[i] + ', '
		} else if (i < n - 1) {
			word_string += word_list[i] + ' and '
		} else {
			word_string += word_list[i]
		}

	}
	return word_string;
}
