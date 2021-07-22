
//data server IP address

//const api = 'http://192.168.1.125/api?pass=123abc&';
const api = 'https://192.168.1.125/api?pass=123abc&';
//const api = 'http://aidabot.ddns.net/api?pass=123abc&';
//const api = 'https://aidabot.ddns.net/api?pass=123abc&';

var audio_recognitions_enabled = false

if(api.indexOf('https')>-1){
	audio_recognitions_enabled= true
} 

millisec_to_timeout = 15000