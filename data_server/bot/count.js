function count(msg){
	let slots = session.intent.slots;
	let sub = slots.sub;
	let obj = slots.obj;
	let ins = slots.ins;
	let id = slots.id;
	
	let sub_id=subject_categories.indexOf(sub)+1;
	let obj_id=object_categories.indexOf(obj)+1;
	
	//no level - verifica slots
	if (!session.intent.level){
		if(msg.length>0){
			setUserMessage(msg);
		}
		
		if(cancel_words.indexOf(msg) != -1){
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}		
		
		if(!sub && msg.length==0){
			setMessage('SUBJECT_REQUEST_MSG');
			session.confirmation = false;
			return
		}
		if(!sub && msg.length>0){
			session.confirmation = false;
			let word = fuzzy_search(subject_categories,msg);
			if (word.length>0){
				sub = word;
				session.intent.slots.sub = word;
				msg='';
				sub_id=subject_categories.indexOf(sub)+1;
				
			} else {
				setMessage('SUBJECT_WRONG_MSG',{'sub':msg});
				return
			}
		}
		
		if(sub && subject_categories.indexOf(sub)==-1){
			session.confirmation = false;
			setMessage('SUBJECT_WRONG_MSG',{'sub':sub});
			delete session.intent.slots.sub;
			return
		}
		
		if(ins && ins!='all'){
			const url=encodeURI(api+'cmd=fnd&ins='+ins);
			$.getJSON(url,function(data, status){
				session.intent.level=1;
				count(data);
			});
			return
		}
		
		if(!ins && msg.length==0){
			session.confirmation = false;
			let message='INSTANCE_MSG'
			if(sub_id==5){
				message='INSTANCE2_MSG'
			}
			setMessage(message,{'list':item_question(sub), 'sub':sub});
			return
		}
		
		if(!ins && msg.length>0 && msg!='all'){
			const url=encodeURI(api+'cmd=fnd&ins='+msg);
			session.intent.slots.ins = msg;
			$.getJSON(url,function(data, status){
				session.intent.level=1;
				count(data);
			});
			return
		}
				
		if((ins && ins=='all') || (!ins && msg=='all')){
			if(!count_legal_queries[sub][combinations[sub]][1]){
				setMessage('NO_SENSE_MSG')
				session_reset();
				return
			}
			obj = combinations[sub]
			session.intent.slots.obj = obj;
			session.intent.slots.ins = 'no';
			session.intent.level=2
			if (session.confirmation){
				setMessage('INTENT_CONFIRMATION_1_MSG',{'sub': dict['sub'][sub][obj], 'prep': dict['prep'][sub][obj], 'obj':dict['obj'][sub][obj]});	
				return
			} else {
				count('');
				return
			}
		}
	}
	
	// verifica ins
	if(session.intent.level == 1){
		
		//caso ok
		if(msg.result=='ok'){
			ins = msg.item;
			session.intent.slots.ins = msg.item;
			obj_id = msg.obj_id;
			obj = msg.object;
			session.intent.slots.obj = msg.object;
			
			if(obj_id == 2 || obj_id == 4){
				session.intent.slots.id = msg.id;
			}
			
			if(!count_legal_queries[sub][obj][0]){
				setMessage('NO_SENSE_MSG')
				session_reset();
				return
			}
			
			if(obj_id == 4){
				ins = upper_first(ins)
			}
			session.intent.level = 2
			if (session.confirmation){
				setMessage('INTENT_CONFIRMATION_2_MSG',{'sub': dict['sub'][sub][obj], 'prep': dict['prep'][sub][obj], 'obj':dict['obj'][sub][obj],'ins': ins});		
				return
			} else {
				count('');
				return
			}
		}
		
		//caso kk (troppi risultati ricerca fnd)
		if(msg.result=='kk'){
			let message=kk_message(msg,1);
            setMessage('TOO_GENERIC_MSG',{'ins': ins, results:message});
            delete session.intent.level;
			delete session.intent.slots.ins;
			return
		}
		
		//caso ko (nessun risultato ricerca fnd)
		if(msg.result=='ko'){
			setMessage('NO_RESULT_MSG',{'ins': ins});
            delete session.intent.level;
			delete session.intent.slots.ins;
			return
		}
		
		//caso k2 (risultati multipli ricerca fnd)
		if(msg.result=='k2'){
			session.intent.items_list = msg;
            let message = choice_list(msg);
            setMessage('ITEM_MSG',{'ins': ins, 'msg':message});
            session.intent.level = 3
			return
		}
		
		//caso ka (omonimie ricerca fnd)
		if(msg.result=='ka'){
			session.intent.homonyms_list = msg;
            let message=homonyms(msg);
            setMessage('HOMONYMS_MSG',{'msg':message, 'obj':homonyms_objects[msg.obj_id-1]});
            session.intent.level = 4
			return
		}
	}
	
	//verifica conferma e visualizzazione risultati
	if(session.intent.level == 2){
		if (msg.length > 0){
			setUserMessage(msg);
		}
		
		if(cancel_words.indexOf(msg) != -1){
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}
		
		let inst=ins;
		if(id){
			inst=id;
		}
		const url=encodeURI(api+'cmd=how&sub='+sub_id+'&obj='+obj_id+'&ins='+inst);
		$.getJSON(url,function(data, status){
			if (data.result != 'ok'){
				setMessage('NO_QUERY_MSG');
				session_reset();
				return
			}
			
			if(obj_id == 4){
				ins = upper_first(ins)
			}
			
			let message='QUERY_1_MSG';
			if (ins == 'no'){
				message = 'QUERY_2_MSG'
				setMessage(message,{'num': data.hits, 'sub':dict['sub'][sub][obj], 'obj':dict['obj'][sub][obj], 'prep': dict['prep'][sub][obj]});
			} else {
				setMessage(message,{'num': data.hits, 'sub':(data.hits == '1'? dict['sub'][sub][obj].substr(0,sub.length-1) : dict['sub'][sub][obj]), 'obj':dict['obj'][sub][obj], 'prep': dict['prep'][sub][obj], 'ins':ins});
			}
			session_reset();
		});
		return
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
			session.intent.slots.ins = ins;
			delete session.intent.level;
			delete session.intent.items_list;
			count('')
			return
		}
		
		else {
			session.intent.level = 1;
			msg = session.intent.items_list;
			delete session.intent.items_list;
			count(msg)
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
		
		let num=get_number(msg);
		if(!isNaN(num) && num <= (session.intent.homonyms_list.item.length-1)){
			if (session.intent.homonyms_list.obj_id == 2){
				ins = session.intent.homonyms_list.item[num].acronym;
			} else {
				ins = session.intent.homonyms_list.item[num].name;
			}
			msg = JSON.parse(JSON.stringify(session.intent.homonyms_list));
			msg["result"] = "ok";
			msg["id"] = session.intent.homonyms_list.item[num].id;
			msg["item"] = ins
		} 
		
		else {
			msg = session.intent.homonyms_list;	
		}
		
		delete session.intent.homonyms_list;
		session.intent.level = 1;
		count(msg)
		return
	}
}