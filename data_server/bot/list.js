function list(msg){
	let slots = session.intent.slots;
	let num = slots.num;
	let sub = slots.sub;
	let obj = slots.obj;
	let ins = slots.ins;
	let order = slots.order;
	let id = slots.id;
	
	let sub_id=list_subject_categories.indexOf(sub)+1;
	let obj_id=object_categories.indexOf(obj)+1;
	let order_id = orders.indexOf(order)+1;
	
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
		
		if (num && (parseInt(num) > 5 || parseInt(num)< 2)){
            if(msg.length==0){
				setMessage('LIST_WRONG_NUMBER_MSG', {'num': num.toString()})
				return
			}
			else if(parseInt(msg) > 1 && parseInt(msg) < 6){
				num = parseInt(msg)
				session.intent.slots.num = num;
				msg='';
			} else {
				setMessage('LIST_WRONG_NUMBER_MSG', {'num': num.toString()})
				msg='';
				return
			}
        }
		
		if(!sub && msg.length==0){
			setMessage('LIST_SUBJECT_REQUEST_MSG');
			return
		}
		if(!sub && msg.length>0){
			let word = fuzzy_search(list_subject_categories, msg);
			if (word.length>0){
				sub = word;
				session.intent.slots.sub = word;
				msg='';
				sub_id=list_subject_categories.indexOf(sub)+1;
				
			} else {
				setMessage('LIST_SUBJECT_WRONG_MSG',{'sub':msg});
				return
			}
		}
		
		if(sub && list_subject_categories.indexOf(sub)==-1){
			setMessage('LIST_SUBJECT_WRONG_MSG',{'sub':sub});
			delete session.intent.slots.sub;
			return
		}
		
		if(ins && ins != 'all'){
			const url=encodeURI(api+'cmd=fnd&ins='+ins);
			$.getJSON(url,function(data, status){
				session.intent.level=1;
				list(data);
			});
			return
		}
		
		if((ins && ins == 'all') || (!ins && msg == 'all')){
			session.intent.level = 2;
			session.intent.slots.obj = 'all';
			session.intent.slots.ins = 'all';
			list('')
			return
		}
		
		if(!ins && msg.length==0){
			let message='LIST_INSTANCE_MSG'
			setMessage(message,{'list':list_item_question(sub), 'sub':sub, 'num':num});
			return
		}
		
		if(!ins && msg.length>0 && msg!='all'){
			const url=encodeURI(api+'cmd=fnd&ins='+msg);
			session.intent.slots.ins = msg;
			$.getJSON(url,function(data, status){
				session.intent.level=1;
				list(data);
			});
			return
		}		
	}
	
	//verifica ins != 'all'
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
			
			session.intent.level = 2;
			list('');
			return
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
	
	//Seconda parte controllo slots
	if(session.intent.level == 2){
		
		if(cancel_words.indexOf(msg) != -1){
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}
		
		if(!order && msg.length==0){
			let message='LIST_ORDER_MSG';
			if(sub && list_subject_categories.indexOf(sub)==1){
				message='LIST_PAPERS_ORDER_MSG';
			}
			setMessage(message,{'num':num,'sub':sub});
			return
		}
		if(!order && msg.length>0){
			setUserMessage(msg);
			
			let n = get_number(msg)
			if (!isNaN(n)){
				if(sub && list_subject_categories.indexOf(sub)==1){
					if (n>-1 && n < 2){
						msg = orders[n*2+1]
					}
				} else {
					if (n>-1 && n < 4){
						msg = orders[n]
					}
				}
			}
			
			let word = fuzzy_search(orders,msg);
			if (word.length>0){
				order = word;
				session.intent.slots.order = word;
				order=word;
				msg='';
				order_id=orders.indexOf(order)+1;
				
			} else {
				let message='LIST_ORDER_WRONG_MSG';
				if(sub && list_subject_categories.indexOf(sub)==1){
					message='LIST_PAPERS_ORDER_WRONG_MSG';
				}
				setMessage(message,{'sub':sub,'order':msg});
				return
			}
		}
		
		if(ins && ins=='all') {
			if(!list_legal_queries[sub]['all'][orders.indexOf(order.split(' ')[0])]){
				setMessage('NO_SENSE_MSG')
				session_reset();
				return
			}
			setMessage('LIST_INTENT_CONFIRMATION_1_MSG', {'order':order, 'num':num, 'sub':(list_dict[order.split(' ')[0]]['sub'][sub][sub]), 'prep': list_dict[order.split(' ')[0]]['prep'][sub][sub], 'obj':list_dict[order.split(' ')[0]]['obj'][sub][sub]});		
			session.intent.level=5
			return
		}
		
		if(ins && ins !='all') {
			if(!list_legal_queries[sub][obj][orders.indexOf(order.split(' ')[0])]){
				setMessage('NO_SENSE_MSG')
				session_reset();
				return
			}
			let msg_ins = ins;
			if (obj_id == 4){
				msg_ins = upper_first(ins);
			}
			setMessage('LIST_INTENT_CONFIRMATION_2_MSG', {'ins': msg_ins,'order':order, 'num':num, 'sub':(list_dict[order.split(' ')[0]]['sub'][sub][obj]), 'prep': list_dict[order.split(' ')[0]]['prep'][sub][obj], 'obj':list_dict[order.split(' ')[0]]['obj'][sub][obj]});		
			session.intent.level=5
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
			session.intent.slots.ins = ins;
			delete session.intent.level;
			delete session.intent.items_list;
			list('')
			return
		}
		
		else {
			session.intent.level = 1;
			msg = session.intent.items_list;
			delete session.intent.items_list;
			list(msg)
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
		list(msg)
		return
	}
		
	//verifica conferma e visualizzazione risultati
	if(session.intent.level == 5){
		setUserMessage(msg);
		
		if(cancel_words.indexOf(msg) != -1){
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}
		
		let inst=ins;
		if(id){
			inst=id;
		}
		const url=encodeURI(api+'cmd=lst&sub='+sub_id+'&obj='+obj_id+'&ins='+inst+'&ord='+order_id+'&num='+num);
		$.getJSON(url,function(data, status){
			
			if(obj=='all'){
                obj=sub;
                ins='';
            }
			let msg_ins = ins;
			if (obj_id == 4){
				msg_ins = upper_first(ins);
			}
			
			let ord = order.split(' ')[0];
			let sub1=list_dict[ord]['sub'][sub][obj];
			let obj1=list_dict[ord]['obj'][sub][obj];
			let prep = list_dict[ord]['prep'][sub][obj]
						
			if(data.result=='ok' && data.lst.length>0){	
				setMessage('LIST_QUERY_MSG',{'order': order, 'num': (data.lst.length == 1 ? '' : num), 'sub':(data.lst.length == 1 ? sub1.substr(0,sub.length-1) : sub1), 'obj':obj1, 'prep': prep, 'ins':msg_ins, 'verb': (data.lst.length == 1 ? list_verbs[0] : list_verbs[1]), lst: lst(data,order,sub)});
			} 
			else if(data.lst.length==0){
				setMessage('LIST_NO_RESULT_MSG', {'sub':sub1, 'obj':obj1, 'ins':ins, 'prep': prep})
			} 
			else {
				setMessage('NO_QUERY_MSG');
			}
			session_reset();
			return
			
		});
		return
	}
}
