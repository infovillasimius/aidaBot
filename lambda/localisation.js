module.exports = {
    'en' : {
        translation:{
            WELCOME_MSG: 'Welcome, you can ask to perform a query on the data contained in the AIDA database or ask for Help. What would you like to try?',
            HELLO_MSG: 'Hello',
            OK_MSG: 'Ok',
            HELP_MSG: ['you can ask, for example, how many papers on machine learning','You can ask a query starting with how many or count'],
            GOODBYE_MSG: ['Goodbye!','Bye!','See you later'],
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MSG: 'Sorry, there was an error. Please try again.',
            QUERY_1_MSG: ['I found {{num}} {{sub}} {{prep}} {{inst}} {{obj}}', 'I counted {{num}} {{sub}} {{prep}} {{inst}} {{obj}}'],
            QUERY_2_MSG: ['I found {{num}} different {{sub}} {{prep}} {{obj}}', 'I counted {{num}} different {{sub}} {{prep}} {{obj}}'],
            REPROMPT_MSG: 'So, what would you like to ask?',
            NO_QUERY_MSG: ['Sorry, you asked for a query that is not yet implemented','Sorry, you asked for a not yet implemented query', 'Sorry, query not yet implemented'],
            REPROMPT_END_MSG: ['You could ask me for another query or tell me stop to quit', "You can ask me to run another query or say stop to quit", "Ask me for another query or tell me stop to quit"],
            INTENT_CONFIRMATION_1_MSG: 'Do you want to know how many {{sub}} {{prep}} {{obj}} are in the Aida database?',
            INTENT_CONFIRMATION_2_MSG: 'Do you want to know how many {{sub}} {{prep}} {{inst}} {{obj}} are in the Aida database?',
            OBJ_MSG: 'in which category of objects do you want to search?',
            OBJ_REPROMPT_MSG: 'you can choose among authors, papers, conferences, organizations and citations',
            conferences: 'conferences',
            authors: 'authors',
            organizations:'organizations',
            topics:'topics',
            papers:'papers',
            citations:'citations',
            TOO_GENERIC_MSG:'Your search for {{item}} got {{results}} you need to try again and to be more specific. What are you looking for?',
            NO_RESULT_MSG:'Your search for {{item}} got no result. You need to try again. what could I search for you?',
            
            SUBJECT_REQUEST_MSG:'What do you want me to count?',
            SUBJECT_WRONG_MSG:'Sorry, I can\'t count {{sub}}. I can count papers, authors, conferences, organizations, and citations. What do you prefer?',
            OBJECT_WRONG_MSG:['Sorry, {{obj}} is a not allowed value. You can choose  among topics, conferences, organizations, authors and papers. What do you prefer?',
                              'Sorry, {{obj}} is an illegal value. You can choose from topics, conferences, organizations, authors and papers. What do you prefer?'],
            
            SUBJECT_REQUEST_REPROMPT_MSG:'I can count papers, authors, conferences, organizations and citations. What do you prefer?',
            ASK_FOR_INSTANCE_MSG:['maybe I didn\'t understand something, do you want to look for someone or something in particular?','To count the {{sub}} you want, are you looking for something or someone in particular?'],
            INSTANCE_MSG:['What do you want to look for?','What are you looking for?'],
            NO_SENSE_MSG:'I\'m sorry but the query resulting from the chosen options doesn\'t make sense. Try again',
            ITEM_MSG:'Searching for {{inst}}, I got {{msg}} Which one is correct?'
            
        }
    }, 
    'it' : {
        translation:{
            WELCOME_MSG: 'Buongiorno, puoi chiedere di eseguire una query sui dati contenuti nel database AIDA o chiedermi aiuto. Cosa preferisci fare?',
            HELLO_MSG: ['Ciao','Buongiorno'],
            OK_MSG: ['Ok','Perfetto','Va bene','Benissimo'],
            HELP_MSG: ['Per esempio, puoi chiedere quanti papers hanno machine learning come argomento','Puoi chiedermi quanti papers ha scritto un determinato ricercatore'],
            GOODBYE_MSG: ['Arrivederci!','Addio','A più tardi','Ci vediamo'],
            REFLECTOR_MSG: 'Hai invocato l\'intento {{intent}}',
            FALLBACK_MSG: 'Perdonami, penso di non aver capito bene. Riprova.',
            ERROR_MSG: 'Scusa, c\'è stato un errore. Riprova.',
            QUERY_1_MSG: ['Ho trovato {{num}} {{sub}}', 'La query ha ottenuto {{num}} corrispondenze','la query ha ottenuto {{num}} {{sub}} con {{inst}} come istanza di {{obj}}'],
            REPROMPT_MSG: 'Quindi, cosa vorresti chiedere?',
            NO_QUERY_MSG: ['Mi dispiace, hai chiesto una query non ancora implementata','Scusa, la query richiesta non è stata ancora implementata','Mi dispiace, non so ancora eseguire la query, che mi hai chiesto'],
            REPROMPT_END_MSG: ['Puoi chiedere di eseguire un\'altra query o dire stop per uscire','Chiedimi un\'altra query o dimmi stop per uscire'],
        }
    }
    
}