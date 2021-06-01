var session={
	'level':0,
	'intent' : {'slots':{}},
	'audio' : true
};

var audio_resume=setInterval(audio_reset,10000);

var help_status = false;

function screen_scroll(){
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
}

function session_reset(){
	if(session.audio){
		session={'level':0,	'intent' : {'slots':{}}, 'audio': true}
	}
	else {
		session={'level':0,	'intent' : {'slots':{}}, 'audio': false}
	}
}

function resize(){
	let height=$(window).height()-$('.top').height()-$('.help_text').height()-$('.input').height()-70;
	$('#bot').height(height)
}

//carica messaggio di benvenuto all'avvio
$(document).ready(function () {
	resize();
	setMessage('WELCOME_MSG');
});

//aggiorna la dimensione della chat quando viene ridimensionata la finestra del browser
$(window).on("resize", function () {
    resize()
}).resize();

//ciclo principale determinato dalla pressione del tasto invio (input utente)
$(document).on('keypress',function(e) {
	if(e.which == 13 && $('#user_input').val().length>0) {
        
		let msg=$('#user_input').val().toLowerCase();
		$('#user_input').val("");
		for(let i in tags_list){
			msg = msg.replaceAll(marks_list[i],'');
		}
				
		//verifica intento
		if(session.level==0){
			intent_verify(msg)
			return
		}
		
		// trasferice controllo agli intenti complessi in base al nome dell'intento
		if(session.level == 1){
			let intent = getIntent(msg)[0];
			if(intent!='fallback'){
				session.level = 0;
				delete session.intent.level;
				intent_verify(msg)
				return
			}
			if(session.intent.name=='count'){
				count(msg);
				return
			}
			else if(session.intent.name=='list'){
				list(msg);
				return
			}
			else if(session.intent.name=='describe'){
				describe(msg);
				return
			}
		} 
		
    }
});

function intent_verify(msg){
	let intent = getIntent(msg);
	setUserMessage(msg);
	msg = msg.replace(intent[1],intent[0]);
	intent = intent[0];
	
	if (intent == 'hello'){
		setMessage('HELLO_MSG')
	} 
	
	else if(intent == 'help'){
		setMessage('HELP_MSG')
	}
	else if(intent == 'cancel'){
		$('#bot').text("");
		setMessage('GOODBYE_MSG')
	}
	else if(intent == 'count' || intent == 'list'){
		session.level=1;
		const url=encodeURI(api+'cmd=parser&ins='+msg);
		$.getJSON(url,function(data, status){
			setIntentSlots(data);
		});
	} 
	
	else if(intent == 'describe'){
		session.intent.name = 'describe';
		session.level = 1
		let query = getUserDescribeQueryText(msg);
		if (query.length > 0){
			session.intent.slots.ins = query
		}
		describe('');
		return
	}
	
	else if(intent == 'fallback'){
		setMessage('FALLBACK_MSG');
	}
	return
}


// set intent name and slots with the results from the parser
function setIntentSlots(data){
	let cmd, num, sub, obj, order, ins;
	if(data.cmd){
		cmd = data.cmd.value;
	}
	if(cmd=='count'){
		session.intent.name='count'
		if(data.sub){
			sub = data.sub.value;
			session.intent.slots.sub = sub;
		} 
		if(data.ins){
			ins = data.ins.value;
			session.intent.slots.ins = ins;
		}
		if(data.obj){
			obj = data.obj.value;
			session.intent.slots.obj = obj;
		} else if(sub && ins=='all'){
			obj = combinations[sub]
			session.intent.slots.obj = obj;	
		}
		count('');
	}
	
	if(cmd=='list'){
		session.intent.name='list'
		if(data.num){
			num = data.num.value;
			session.intent.slots.num = num;
		}
		if(data.sub){
			sub = data.sub.value;
			session.intent.slots.sub = sub;
		} 
		if(data.ins){
			ins = data.ins.value;
			session.intent.slots.ins = ins;
		}
		if(data.obj){
			obj = data.obj.value;
			session.intent.slots.obj = obj;
		} else if(sub && ins=='all'){
			obj = 'all'
			session.intent.slots.obj = obj;	
		}
		if(data.order){
			order = data.order.value;
			session.intent.slots.order = order;
		} 
		list('');
	}
}
/*
$(document).click(function(event) {
    alert('ciao')
});
*/
function help(){
	let body_height_ini=$('body').height();
	help_status = !help_status;
	if(help_status){
		$('.help_text').append('<p class="help_text_p">The database can be queried about <b>authors</b>, <b>papers</b>, <b>conferences</b>, <b>organizations</b>, <b>citations</b> and <b>topics</b>.<br/>It is possible to further filter the queries by specifying the <b>name</b> of a particular <b>topic</b>, <b>conference</b>, <b>organization</b> or <b>author</b>.<br/>The results can be sorted according to one of the following four options: <b>publications</b>, <b>citations</b>, <b>publications in the last 5 years</b>, <b>citations in the last 5 years</b><br/>There are three types of queries:<br/>1. <b>Describe</b> (e.g .: "describe ISWC")<br/>2. <b>Count</b> (e.g .: "count the papers on machine learning")<br/>3. <b>List</b> (e.g .: "list the top 5 conferences with papers on rdf graph sorted by publications").<br/>You can enter a query all at once in natural language or through a wizard by entering one of the three activation words: <b>describe</b>, <b>count</b> or <b>list</b>.<br/>The audio functions are experimental and may malfunction depending on the compatibility of the browser used.</p><a class="right" onclick="help()" href="javascript:void(0)" title="close help">close</a>');
	}
	else {
		$('.help_text').empty();
	}
	let height = $('#bot').height()-$('body').height()+body_height_ini
	$('#bot').height(height)
}


$(document).change(function(){
    session.audio = $("#audio").prop( "checked" )
	if(!session.audio){
		window.speechSynthesis.pause();
	} else {
		window.speechSynthesis.resume()
	}
});

// trucco per imbrogliare chrome e fargli sistetizzare voice msg lunghi 
function audio_reset(){
	
	if(navigator.userAgent.indexOf("Firefox") != -1 || 
		navigator.userAgent.indexOf("OPR") !=-1 ||
		navigator.userAgent.indexOf("Edg") != -1||
		navigator.userAgent.indexOf("Mobile") != -1){
			clearInterval(audio_resume)
			return
		}
	//alert(navigator.userAgent)
	if(session.audio){
		window.speechSynthesis.pause();
		window.speechSynthesis.resume()
	}
}
