let browser=detect_browser();
//alert (browser)

var session={
	'level':0,
	'intent' : {'slots':{}},
	'audio' : false,
	'recognition' : false,
	'recognize' : false
};

var audio_resume=setInterval(audio_reset,10000);

var help_status = false;

//variabili per speech to text
var recognizing;
var recognition;

function screen_scroll(){
	$('#bot').scrollTop($('#bot')[0].scrollHeight - $('#bot')[0].clientHeight);
}

function session_reset(){
	let rec = session.recognition;
	let audio = session.audio;
	$("#audio").prop('checked', session.audio);
	session={'level':0,	'intent' : {'slots':{}}, 'audio': audio, 'recognition' : rec, 'recognize' : false}
	recogn_stop();
}

function resize(){
	setTimeout(function(){ 
		let height=$(window).height()-$('.top').height()-$('.help_text').height()-$('.input').height()-70;
		$('#bot').height(height); 
		}, 500);	
}

//carica messaggio di benvenuto all'avvio

$(document).ready(function () {
	set_audio_recognition();
	resize();
	setTimeout(function(){ 
		setMessage('WELCOME_MSG');
	}, 300);
	
});

//aggiorna la dimensione della chat quando viene ridimensionata la finestra del browser
$(window).on("resize", function () {
    resize();
}).resize();

//ciclo principale determinato dalla pressione del tasto invio (input utente)
$(document).on('keypress',function(e) {
	if(e.which == 13 && $('#user_input').val().length>0) {
		cycle();
    }
});

//ciclo principale
function cycle(){
	if(session.recognition && session.recognize){
		recogn_start();
	} else {
		recogn_stop();
	}
	
	if($('#user_input').val().length==0){
		return
	}
	
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
			delete session.intent.homonyms_list;
			delete session.intent.items_list;
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
		session_reset();
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
		$('.help_text').append('<p class="help_text_p">The database can be queried about <b>authors</b>, <b>papers</b>, <b>conferences</b>, <b>organizations</b>, <b>citations</b> and <b>topics</b>.<br/>It is possible to further filter the queries by specifying the <b>name</b> of a particular <b>topic</b>, <b>conference</b>, <b>organization</b> or <b>author</b>.<br/>The results can be sorted according to one of the following four options: <b>publications</b>, <b>citations</b>, <b>publications in the last 5 years</b>, <b>citations in the last 5 years</b><br/>There are three types of queries:<br/>1. <b>Describe</b> (e.g .: "describe ISWC")<br/>2. <b>Count</b> (e.g .: "count the papers on machine learning")<br/>3. <b>List</b> (e.g .: "list the top 5 conferences with papers on rdf graph sorted by publications").<br/>You can enter a query all at once in natural language or through a wizard by entering one of the three activation words: <b>describe</b>, <b>count</b> or <b>list</b>.<br/>The audio functions use the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API" target="_blank">Web Speech API</a> which is defined as experimental technology and may not work correctly depending on the compatibility of the browser used, therefore the options to activate them are only available on fully compatible browsers (Google Chrome, Microsoft Edge, Apple Safari: all functions - Mozilla Firefox: only the speech syntetizer).</p><a class="right" onclick="help()" href="javascript:void(0)" title="close help">close</a>');
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
	if (browser != 'Google Chrome or Chromium on Windows'){
			clearInterval(audio_resume)
			return
		}
	if(session.audio){
		window.speechSynthesis.pause();
		window.speechSynthesis.resume()
	}
}

function set_audio_recognition(){
	$("#audio").prop('checked', session.audio);
		
	if (browser == 'Mozilla Firefox'){
		$('.speak_button').empty();
		return
	}
	

	
	if(!("webkitSpeechRecognition" in window)){
		$('.audio_cmd').empty();
		$('.audio_cmd').html('Speech recognition features are only available on compatible browsers on encrypted connections. A list is in the help.');
		return
	}
	
	if (!audio_recognitions_enabled){
		$('.speak_button').empty();
		$('.speak_button').html('Speech recognition features are only available on encrypted connections.');
		return 
	}
	
	if (browser != 'Google Chrome or Chromium on Windows' &&
		browser != 'Google Chrome or Chromium on Mobile' &&
		browser != 'Google Chrome or Chromium on Mac' &&
		browser != 'Microsoft Edge' && 
		browser != 'Apple Safari'){
		$('.audio_cmd').empty();
		return
	}
	session.recognition = true;
	recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
    recognition.lang = 'en-US';
	recogn_reset();
	recognition.onend = recogn_reset();
	recognition.onaudioend = function() {
	  recogn_reset();
	}
	recognition.onresult = function (event) {
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
			  $('#user_input').val(event.results[i][0].transcript);
			  //toggleStartStop()
			  cycle();
			}
		}
	}
}

function recogn_stop() {
	if (recognizing) {
	recognition.stop();
	recogn_reset();
	}
}

function recogn_start() {
	recognizing = true;
	recognition.abort();
	setTimeout(function(){
		recognition.start();
		recognizing = true;
		button.innerHTML = "Click to Stop";
	}, 500);	
}

function recogn_reset() {
	recognizing = false;
	button.innerHTML = "Click to Speak";
}

function toggleStartStop() {
	if (recognizing) {
	recognition.stop();
	recogn_reset();
	} else {
	recognition.abort();
	recogn_reset();
	setTimeout(function(){
		recognition.start();
		recognizing = true;
		button.innerHTML = "Click to Stop";}, 500);	
	}
}

function button_click(){
	if($('#button').html()=="Click to Speak"){
		session.recognize = true
	} else {
		session.recognize = false
	}
	toggleStartStop()
}


function detect_browser(){
	var sBrowser, sUsrAg = navigator.userAgent;
	//alert(sUsrAg)
	// The order matters here, and this may report false positives for unlisted browsers.
	if (sUsrAg.indexOf("Firefox") > -1) {
	  sBrowser = "Mozilla Firefox";
	  // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
	} else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
	  sBrowser = "Samsung Internet";
	  // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
	} else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1 || sUsrAg.indexOf("OPT") > -1) {
	  sBrowser = "Opera";
	  // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
	} else if (sUsrAg.indexOf("Trident") > -1) {
	  sBrowser = "Microsoft Internet Explorer";
	  // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
	} else if (sUsrAg.indexOf("Edg") > -1) {
	  sBrowser = "Microsoft Edge";
	  // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
	} else if (sUsrAg.indexOf("Chrome") > -1 && sUsrAg.indexOf("Windows") > -1) {
	  sBrowser = "Google Chrome or Chromium on Windows";
	  // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
	} else if (sUsrAg.indexOf("Chrome") > -1 && sUsrAg.indexOf("Mobile") > -1) {
	  sBrowser = "Google Chrome or Chromium on Mobile";
	} else if (sUsrAg.indexOf("Chrome") > -1 && sUsrAg.indexOf("Mac") > -1) {
	  sBrowser = "Google Chrome or Chromium on Mac";
	} else if (sUsrAg.indexOf("Safari") > -1) {
	  sBrowser = "Apple Safari";
	  // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
	} else {
	  sBrowser = "unknown";
	}

	return sBrowser;
}