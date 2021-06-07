
//data server IP address

const api = 'http://127.0.0.1/api?pass=123abc&';
//const api = 'https://127.0.0.1/api?pass=123abc&';


var audio_recognitions_enabled = false

if(api.indexOf('https')>-1){
	audio_recognitions_enabled= true
} 