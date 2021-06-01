#!/usr/bin/env python
# -*- coding: utf-8 -*-
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
# import sys
# import json
# from aidaLogic import *
from query_parser import *

resources = {
    'path': '/home/server/aidaBot/bot/',
    '/': {'file':'index.html','mime':'text/html'},
    '/index.html': {'file':'index.html','mime':'text/html'},
    '/nao.svg': {'file':'nao.svg','mime':'image/svg+xml'},
    '/user.svg': {'file':'user.svg','mime':'image/svg+xml'},
    '/aidabot.js': {'file':'aidabot.js','mime':'application/x-javascript'},
    '/count.js': {'file':'count.js','mime':'application/x-javascript'},
    '/describe.js': {'file':'describe.js','mime':'application/x-javascript'},
    '/language_logic.js': {'file':'language_logic.js','mime':'application/x-javascript'},
    '/list.js': {'file':'list.js','mime':'application/x-javascript'},
    '/jquery-3.6.0.min.js': {'file':'jquery-3.6.0.min.js','mime':'application/x-javascript'}
    }

def getFile(path):
    if path in resources:
        info=resources.get(path)
        filename = resources.get('path')+info.get('file')
        mime = info.get('mime')        
    else:
        info = resources.get('/bot/nao.svg')
        filename = resources.get('path')+info.get('file')
        mime = info.get('mime')
        
    f = open(filename,'r')
    a=f.read()
    f.close()
    return[a,mime]


# query the database
def query(cmd, sub, obj, ins, order, num, lng):
    result = json.dumps({'result': 'ko', 'msg': 'Query not implemented yet'})

    if cmd == 'how':
        result = how(sub, obj, ins)

    elif cmd == 'lst':
        result = lst(sub, obj, ins, num, order)

    elif cmd == 'dsc':
        result = dsc_finder(ins)

    elif cmd == 'fnd':
        result = find_match(ins)
        data = json.loads(result)
        if data['result'] == 'ok' and data['obj_id'] == 4:
            result = check_author(data)
        if data['result'] == 'ok' and data['obj_id'] == 2:
            result = check_conference(data)

    elif cmd == 'parser':
        result = query_parser(ins, lng)

    print(result)
    return result


class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        BaseHTTPRequestHandler.end_headers(self)
    def do_GET(self):
        query_components = parse_qs(urlparse(self.path).query)
        path = urlparse(self.path).path
        print(query_components)
        print(path)
        password = query_components.get('pass')
        cmd = query_components.get('cmd')
        print(password)
        print(cmd)

        if cmd is not None:
            cmd = cmd[0]
            
        sub = query_components.get('sub')
        obj = query_components.get('obj')
        ins = query_components.get('ins')
        order = query_components.get('ord')
        num = query_components.get('num')
        lng = query_components.get('lng')

        if sub is not None:
            sub = sub[0]
        if obj is not None:
            obj = obj[0]
        if ins is not None:
            ins = ins[0]
        if order is not None:
            order = order[0]
        if num is not None:
            num = int(num[0])
        else:
            num = 5
        if lng is not None:
            lng = lng[0]
        else:
            lng = 'en-US'

        if path in resources:
            result = getFile(path)
            self.send_response(200)
            self.send_header('Content-Type', result[1])
            self.end_headers()
            self.wfile.write(bytes(result[0], "utf8"))
            return

        if path == '/favicon.ico':
            filename = '/home/server/aidaBot/bot/nao.png'
            file = open(filename, "rb")
            self.send_response(200)
            self.send_header('Content-Type', 'image/png')
            self.end_headers()
            self.wfile.write(file.read())
            file.close()
            return

        if path != '/api' or password is None or '123abc' not in password:
            self.send_response(401)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            message = "Unauthorized!"
            self.wfile.write(bytes(message, "utf8"))
            return

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        result = query(cmd, sub, obj, ins, order, num, lng)
        self.wfile.write(bytes(result, "utf8"))

        return


def run():
    print('Avvio del server...')
    local_ip = ''
    server_address = (local_ip, 80)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('Server in esecuzione...')
    print('Ip = ', local_ip)
    httpd.serve_forever()


run()
