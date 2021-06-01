#!/usr/bin/env python
# -*- coding: utf-8 -*-
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import sys
import json
import contextlib
import daemon
from aidaLogic import *


## query the database
def query(cmd,sub,obj,ins,order,num):
    
    result=json.dumps({'result':'Query not implemented yet'})
    
    if cmd=='how':
        result=how(sub,obj,ins)

    elif cmd == 'lst':
        result = lst(sub,obj,ins,num,order)

    elif cmd == 'dsc':
        result = dsc_finder(ins)

    elif cmd == 'fnd':
        result = find_match(ins)
        data=json.loads(result)
        if data['result']=='ok' and data['obj_id']==4:
            result=check_author(data)
        if data['result']=='ok' and data['obj_id']==2:
            result=check_conference(data)

    print(result)
    return result


class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        query_components = parse_qs(urlparse(self.path).query)
        path = urlparse(self.path).path
        print (query_components)
        print (path)
        password = query_components.get('pass')
        cmd = query_components.get('cmd')
        print (password)
        print (cmd)
        
        if cmd is not None:
            cmd = cmd[0]
   
        print (cmd)

        sub = query_components.get('sub')
        obj = query_components.get('obj')
        ins = query_components.get('ins')
        order=query_components.get('ord')
        num = query_components.get('num')

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
        else: num=5
            
        if path != '/' or password is None or '123abc' not in password:
            self.send_response(401)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            message = "Unauthorized!"
            self.wfile.write(bytes(message, "utf8"))
            return

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        result=query(cmd,sub,obj,ins,order,num)
        self.wfile.write(bytes(result, "utf8"))

        return


def run():
    print('Avvio del server...')
    local_ip = ''
    server_address = (local_ip, 80)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('Server in esecuzione...')
    print('Ip = ',local_ip)
    #httpd.serve_forever()

    # Make the context manager for becoming a daemon process.
    daemon_context = daemon.DaemonContext()
    daemon_context.files_preserve = [httpd.fileno()]

    # Become a daemon process.
    with daemon_context:
        httpd.serve_forever()

run()
