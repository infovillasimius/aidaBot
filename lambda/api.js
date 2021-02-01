const axios = require('axios');

module.exports = {
   
    AccessApi(url){
        var config = {
            timeout: 4000, // timeout api call before we reach Alexa's 8 sec timeout, or set globally via axios.defaults.timeout
            };
        
        async function getR(url,config) {
            const baseUrl='http://magunica.ddns.net:8008/?pass=123abc&'
            const res = await axios.get(baseUrl+url,config);
            return res.data;
        }
        
        return getR(url, config).then((result) => {
            return result;
        }).catch((error) => {
            return error;
        });
    }
}