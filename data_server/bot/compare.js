function compare(msg) {
	let slots = session.intent.slots;
	let ins = slots.ins;
	let ins2 = slots.ins2;
	let term1 = session.intent.slots.term1

	//console.log(session)

	//no level verifica slots
	if (!session.intent.level) {
		if (msg.length > 0) {
			setUserMessage(msg);
		}

		if (cancel_words.indexOf(msg) != -1) {
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}

		if (!ins && msg.length == 0) {
			session.confirmation = false;
			setMessage('COMPARE_FIRST_INSTANCE')
			return
		}

		if (ins && term1 && !ins2 && msg.length == 0) { 
			session.confirmation = false;
			let message_ins = '<b>'
			if (term1.obj_id == 1) {
				message_ins += upper_first(term1.item.name) + '</b>'
			} else if (term1.obj_id == 4) {
				message_ins += term1.item.name + '</b>';
			} else if (term1.obj_id > 1 && term1.obj_id < 4 && term1.item.name.toLowerCase().indexOf('conference') > 0) {
				message_ins += term1.item.name + '</b>';
			} else {
				message_ins += term1.item.name + '</b> conference'
			}
			setMessage('COMPARE_SECOND_INSTANCE', { 'obj': compare_categories[term1.obj_id-1], 'ins': message_ins})
			return
		}

		if (ins && !term1 || (!ins && msg.length > 0)) {
			if (!ins) {
				session.intent.slots.ins = session.original_input; //msg;
			}
			const url = encodeURI(api + 'cmd=dsc&ins=' + (ins ? ins : session.original_input));
			json_call = $.getJSON(url, function (data, status) {
				session.intent.level = 1;
				compare(data);
			});
			return
		}

		if (ins && term1 && ins2 || (ins && term1 && !ins2 && msg.length > 0)) {
			if (!ins2) {
				session.intent.slots.ins2 = session.original_input; //msg;
			}
			const url = encodeURI(api + 'cmd=dsc&ins=' + (ins2 ? ins2 : session.original_input));
			json_call = $.getJSON(url, function (data, status) {
				session.intent.level = 10;
				compare(data);
			});
			return
		}
	}

	//verifica ins 
	if (session.intent.level == 1) {

		//caso ok
		if (msg.result == 'ok') {
			session.intent.slots.term1 = msg;
			delete session.intent.level; // = null;
			//console.log(msg)
			compare('')
			return
		}

		//caso kk (troppi risultati ricerca dsc)
		if (msg.result == 'kk') {
			let message = kk_message(msg, 0);
			session.confirmation = false;
			setMessage('COMPARE_TOO_GENERIC_FIRST_MSG', { 'ins': ins, results: message });
			delete session.intent.level;
			delete session.intent.slots.ins;
			return
		}

		//caso ko (nessun risultato ricerca dsc)
		if (msg.result == 'ko') {
			setMessage('COMPARE_NO_RESULT_FIRST_MSG', { 'ins': ins });
			delete session.intent.level;
			delete session.intent.slots.ins;
			return
		}

		//caso k2 (risultati multipli ricerca dsc)
		if (msg.result == 'k2') {
			session.confirmation = false;
			msg.cmd = 'dsc';
			/* if(msg.num[1]>0){
				ins=msg.keys[1][0]['acronym'];
			} */
			session.intent.items_list = msg;
			let message = choice_list(msg);
			setMessage('ITEM_MSG', { 'ins': ins, 'msg': message });
			session.intent.level = 3
			return
		}

		//caso ka (omonimie ricerca dsc)
		if (msg.result == 'ka') {
			session.confirmation = false;
			session.intent.homonyms_list = msg;
			let message = homonyms(msg);
			setMessage('HOMONYMS_MSG', { 'msg': message });
			session.intent.level = 4
			return
		}
	}

	// gestione lista risultati multipli
	if (session.intent.level == 3) {
		setUserMessage(msg);

		if (cancel_words.indexOf(msg) != -1) {
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}

		let num = get_number(msg);
		if (!isNaN(num) && num <= session.intent.items_list.num.reduce((a, b) => a + b, 0)) {
			ins = get_choice(session.intent.items_list, num);
			session.intent.slots.ins = ins.name;
			delete session.intent.level;
			delete session.intent.items_list;
			compare('')
			return
		}

		else {
			session.intent.level = 1;
			msg = session.intent.items_list;
			delete session.intent.items_list;
			compare(msg)
		}

	}

	// gestione lista omonimi
	if (session.intent.level == 4) {
		setUserMessage(msg);

		if (cancel_words.indexOf(msg) != -1) {
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}

		let num = get_number(msg);
		if (!isNaN(num) && num <= (session.intent.homonyms_list.item.length - 1)) {
			// ins = session.intent.homonyms_list.item[num].name;
			id = session.intent.homonyms_list.item[num].id;
			//alert(id)
			if (session.intent.homonyms_list.obj_id == 4) {
				id = '0000000000' + id
			}
			delete session.intent.homonyms_list;
			const url = encodeURI(api + 'cmd=dsc&ins=' + id);
			json_call = $.getJSON(url, function (data, status) {
				session.intent.level = 1;
				compare(data);
			});
			return
		}

		else {
			msg = session.intent.homonyms_list;
			delete session.intent.homonyms_list;
			session.intent.level = 1;
			compare(msg)
			return
		}
	}

	//verifica ins2 
	if (session.intent.level == 10) {

		//caso ok
		if (msg.result == 'ok') {
			//console.log(msg)
			let message_ins = '<b>'
			let message_ins2 = '<b>'
			session.intent.slots.results = msg;
			session.intent.level = 20;

			let comb = term1.obj_id + '-' + msg.obj_id;
			if(compare_valid_combinations.indexOf(comb)<0){
				setMessage('COMPARE_WRONG_PAIR_MSG', { 'obj1': term1.object, 'obj2': msg.object });
				session_reset();
				return
			}

			if(JSON.stringify(term1.item) == JSON.stringify(msg.item)){
				setMessage('COMPARE_SAME_OBJ_MSG', { 'obj1':  compare_categories[term1.obj_id-1] });
				session_reset();
				return
			}

			if (term1.obj_id == 1) {
				message_ins += upper_first(term1.item.name) + '</b>'
			} else if (term1.obj_id == 4) {
				message_ins += term1.item.name + '</b>';
			} else if (term1.obj_id > 1 && term1.obj_id < 4 && term1.item.name.toLowerCase().indexOf('conference') > 0) {
				message_ins += term1.item.name + '</b>';
			} else {
				message_ins += term1.item.name + '</b> conference'
			}

			if (msg.obj_id == 1) {
				message_ins2 += upper_first(msg.item.name) + '</b>'
			} else if (msg.obj_id == 4) {
				message_ins2 += msg.item.name + '</b>';
			} else if (msg.obj_id > 1 && msg.obj_id < 4 && msg.item.name.toLowerCase().indexOf('conference') > 0) {
				message_ins2 += msg.item.name + '</b>';
			} else {
				message_ins2 += msg.item.name + '</b> conference'
			}



			if (session.confirmation) {
				setMessage("COMPARE_CONFIRM_MSG", { 'ins': message_ins, 'ins2': message_ins2 });
			} else {
				compare('')
			}
			return
		}

		//caso kk (troppi risultati ricerca dsc)
		if (msg.result == 'kk') {
			let message = kk_message(msg, 0);
			session.confirmation = false;
			setMessage('COMPARE_TOO_GENERIC_SECOND_MSG', { 'ins': ins2, results: message });
			delete session.intent.level;
			delete session.intent.slots.ins2;
			return
		}

		//caso ko (nessun risultato ricerca dsc)
		if (msg.result == 'ko') {
			setMessage('COMPARE_NO_RESULT_SECOND_MSG', { 'ins': ins2 });
			delete session.intent.level;
			delete session.intent.slots.ins2;
			return
		}

		//caso k2 (risultati multipli ricerca dsc)
		if (msg.result == 'k2') {
			session.confirmation = false;
			msg.cmd = 'dsc';
			session.intent.items_list = msg;
			let message = choice_list(msg);
			setMessage('ITEM_MSG', { 'ins': ins2, 'msg': message });
			session.intent.level = 30
			return
		}

		//caso ka (omonimie ricerca dsc)
		if (msg.result == 'ka') {
			session.confirmation = false;
			session.intent.homonyms_list = msg;
			let message = homonyms(msg);
			setMessage('HOMONYMS_MSG', { 'msg': message });
			session.intent.level = 40
			return
		}
	}

	//verifica conferma e visualizzazione risultati
	if (session.intent.level == 20) {
		let message = '';
		if (msg.length > 0) {
			setUserMessage(msg);
		}

		if (cancel_words.indexOf(msg) != -1) {
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}

		if (session.intent.slots.results) {
			cmp(term1,session.intent.slots.results);
			//appendMessage(message);
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
	if (session.intent.level == 30) {
		setUserMessage(msg);

		if (cancel_words.indexOf(msg) != -1) {
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}

		let num = get_number(msg);
		if (!isNaN(num) && num <= session.intent.items_list.num.reduce((a, b) => a + b, 0)) {
			ins2 = get_choice(session.intent.items_list, num);
			session.intent.slots.ins2 = ins2.name;
			delete session.intent.level;
			delete session.intent.items_list;
			//console.log(session)
			compare('')
			return
		}

		else {
			session.intent.level = 10;
			msg = session.intent.items_list;
			delete session.intent.items_list;
			compare(msg)
		}

	}

	// gestione lista omonimi
	if (session.intent.level == 40) {
		setUserMessage(msg);

		if (cancel_words.indexOf(msg) != -1) {
			setMessage('REPROMPT_MSG');
			session_reset();
			return
		}

		let num = get_number(msg);
		if (!isNaN(num) && num <= (session.intent.homonyms_list.item.length - 1)) {
			// ins = session.intent.homonyms_list.item[num].name;
			id = session.intent.homonyms_list.item[num].id;
			//alert(id)
			if (session.intent.homonyms_list.obj_id == 4) {
				id = '0000000000' + id
			}
			delete session.intent.homonyms_list;
			const url = encodeURI(api + 'cmd=dsc&ins=' + id);
			json_call = $.getJSON(url, function (data, status) {
				session.intent.level = 10;
				compare(data);
			});
			return
		}

		else {
			msg = session.intent.homonyms_list;
			delete session.intent.homonyms_list;
			session.intent.level = 10;
			compare(msg)
			return
		}
	}
}