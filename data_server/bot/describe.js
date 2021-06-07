function describe(msg){
	let slots = session.intent.slots;
	let ins = slots.ins;
	
	//no level verifica slots
	if (!session.intent.level){
		if(msg.length>0){
			setUserMessage(msg);
		}
		
		if(cancel_words.indexOf(msg) != -1){
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}
		
		if(!ins && msg.length==0){
			setMessage('DESCRIBE_INSTANCE_MSG')
			return
		}
		
		if(ins || (!ins && msg.length >0)){
			if(!ins){
				session.intent.slots.ins = msg;
			}
			const url = encodeURI(api+'cmd=dsc&ins='+(ins ? ins : msg));
			$.getJSON(url,function(data, status){
				session.intent.level = 1;
				describe(data);
			});
			return
		}
	}
	
	//verifica ins 
	if(session.intent.level == 1){
		
		//caso ok
		if(msg.result=='ok'){
			let message_ins = ''
			session.intent.slots.results = msg;
			session.intent.level = 2;
			if(msg.item.name.toLowerCase().indexOf('conference')>0 && msg.obj_id > 1){
				message_ins = msg.item.name
			} else {
				message_ins = msg.obj_id == 1 ? upper_first(msg.item.name) : '"'+msg.item.name+'" conference'
			}
			
			setMessage("DESCRIBE_CONFIRM_MSG",{'ins': message_ins});
			return
		}
		
		//caso kk (troppi risultati ricerca dsc)
		if(msg.result=='kk'){
			let message=kk_message(msg,0);
            setMessage('DSC_TOO_GENERIC_MSG',{'ins': ins, results:message});
            delete session.intent.level;
			delete session.intent.slots.ins;
			return
		}
		
		//caso ko (nessun risultato ricerca dsc)
		if(msg.result=='ko'){
			setMessage('DSC_NO_RESULT_MSG',{'ins': ins});
            delete session.intent.level;
			delete session.intent.slots.ins;
			return
		}
		
		//caso k2 (risultati multipli ricerca dsc)
		if(msg.result=='k2'){
			msg.cmd='dsc';
			if(msg.num[1]>0){
                ins=msg.keys[1][0]['acronym'];
            }
			session.intent.items_list = msg;
            let message = choice_list(msg);
            setMessage('ITEM_MSG',{'ins': ins, 'msg':message});
            session.intent.level = 3
			return
		}
		
		//caso ka (omonimie ricerca dsc)
		if(msg.result=='ka'){
			session.intent.homonyms_list = msg;
            let message=homonyms(msg);
            setMessage('HOMONYMS_MSG',{'msg':message});
            session.intent.level = 4
			return
		}
	}
	
	//verifica conferma e visualizzazione risultati
	if(session.intent.level == 2){
		let message = '';
		if(msg.length>0){
			setUserMessage(msg);
		}
		
		if(cancel_words.indexOf(msg) != -1){
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}
		
		if(session.intent.slots.results){
            message=dsc(session.intent.slots.results);
			appendMessage(message);
			session_reset();
			return
        } 
        
        else {
            setMessage('NO_QUERY_MSG');
			session_reset();
			return
        }
	}
	
	// gestione lista risultati multipli
	if(session.intent.level == 3){
		setUserMessage(msg);
		
		if(cancel_words.indexOf(msg) != -1){
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}
		
		let num=get_number(msg);
		if(!isNaN(num) && num <= session.intent.items_list.num.reduce((a, b) => a + b, 0)){
			ins = get_choice(session.intent.items_list,num);
			session.intent.slots.ins = ins.name;
			delete session.intent.level;
			delete session.intent.items_list;
			describe('')
			return
		} 
		
		else {
			session.intent.level = 1;
			msg = session.intent.items_list;
			delete session.intent.items_list;
			describe(msg)
		}
		
	}
	
	// gestione lista omonimi
	if(session.intent.level == 4){
		setUserMessage(msg);
		
		if(cancel_words.indexOf(msg) != -1){
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}
		
		let num = get_number(msg);
		if(!isNaN(num) && num <= (session.intent.homonyms_list.item.length-1)){
			ins = session.intent.homonyms_list.item[num].name;
			id = session.intent.homonyms_list.item[num].id;
			delete session.intent.homonyms_list;
			const url = encodeURI(api+'cmd=dsc&ins='+ id);
			$.getJSON(url,function(data, status){
				session.intent.level = 1;
				describe(data);
			});
			return
		} 
		
		else {
			msg = session.intent.homonyms_list;
			delete session.intent.homonyms_list;
			session.intent.level = 1;
			describe(msg)
			return
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
}