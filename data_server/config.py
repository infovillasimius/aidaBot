# daemonized
daemonized = False

# https or http
https_mode = False

# pem certificate file path
cert_file = './server.pem'

# pem key file path
key_file = './privkey.pem'

# debug mode
debug_mode = True #False

# elasticsearch host ip: 192.168.1.150 dev host  - 10.25.0.70 prod host
elasticsearch_host = '192.168.1.150' 
# elasticsearch_host = '10.25.0.70' 

# web resources path (if web server is daemonized it needs absolute path to resources)
if daemonized:
    resources_path = '/home/server/httpsAidaBot/bot/'
else:
    resources_path = './bot/'

# web server resources
resources = {
    'path': resources_path,
    '/style.css':{'file':'style.css','mime':'text/css'},
    '/': {'file':'index.html','mime':'text/html; charset=utf-8'},
    '/index.html': {'file':'index.html','mime':'text/html; charset=utf-8'},
    '/nao.svg': {'file':'nao.svg','mime':'image/svg+xml; charset=utf-8'},
    '/user.svg': {'file':'user.svg','mime':'image/svg+xml; charset=utf-8'},
    '/freccia_blu.svg': {'file':'freccia_blu.svg','mime':'image/svg+xml; charset=utf-8'},
    '/aidabot.js': {'file':'aidabot.js','mime':'text/javascript; charset=utf-8'},
    '/count.js': {'file':'count.js','mime':'text/javascript; charset=utf-8'},
    '/describe.js': {'file':'describe.js','mime':'text/javascript; charset=utf-8'},
    '/language_logic.js': {'file':'language_logic.js','mime':'text/javascript; charset=utf-8'},
    '/list.js': {'file':'list.js','mime':'text/javascript; charset=utf-8'},
    '/jquery-3.6.0.min.js': {'file':'jquery-3.6.0.min.js','mime':'text/javascript; charset=utf-8'},
    '/question_mark.svg': {'file':'question_mark.svg','mime':'image/svg+xml; charset=utf-8'},
    '/favicon.ico':{'file':'nao.png','mime':'image/x-icon'},
    '/spinner.gif':{'file':'spinner.gif','mime':'image/gif'},
    '/freccia_blu.gif': {'file':'freccia_blu.gif','mime':'image/gif'},
    '/conf.js': {'file':'conf.js','mime':'text/javascript; charset=utf-8'}
    }
    

