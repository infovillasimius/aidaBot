#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys, os, socket
from socketserver import ThreadingMixIn
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import ssl
from urllib.parse import urlparse, parse_qs
import json
import contextlib

from aidaLogic import *
from query_parser import *
from config import *

if daemonized:
    import daemon


## query the database
def query(cmd,sub,obj,ins,order,num,lng):
    
    result=json.dumps({'result': 'ko','msg': 'Query not implemented yet'})
    
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

    elif cmd == 'parser':
        result = query_parser(ins, lng)

    return result
    

class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass  


class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        query_components = parse_qs(urlparse(self.path).query)
        path = urlparse(self.path).path
        password = query_components.get('pass')
        cmd = query_components.get('cmd')
        
        if cmd is not None:
            cmd = cmd[0]
        
        sub = query_components.get('sub')
        obj = query_components.get('obj')
        ins = query_components.get('ins')
        order=query_components.get('ord')
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
        else: num=5
        if lng is not None:
            lng = lng[0]
        else:
            lng = 'en-US'

        if path in resources:
            info=resources.get(path)
            filename = resources.get('path')+info.get('file')
            mime = info.get('mime')
            file = open(filename, "rb")
            self.send_response(200)
            self.send_header('Content-Type', mime)
            if path=='/' or path=='/index.html':
                self.send_header('Cache-Control', 'max-age=10')
            elif not debug_mode:
                self.send_header('Cache-Control', 'max-age=31536000, immutable')
            else:
                self.send_header('Cache-Control', 'max-age=10')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.end_headers()
            self.wfile.write(file.read())
            file.close()
            return

        if path != '/api' or password is None or '123abc' not in password:
            self.send_response(401)
            self.send_header('Content-type', 'text/html')
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            message = "Unauthorized!"
            self.wfile.write(bytes(message, "utf8"))
            return

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        result=query(cmd,sub,obj,ins,order,num,lng)
        self.wfile.write(bytes(result, "utf8"))

        return


def run():
    print('Avvio del server...')
    local_ip = ''
    
    if https_mode and daemonized:
        server_address = (local_ip, 443)
        httpd = ThreadingSimpleServer(server_address, testHTTPServer_RequestHandler)
        httpd.socket = ssl.wrap_socket (httpd.socket, certfile = cert_file, keyfile = key_file, server_side = True)
        print('Server in esecuzione...')
        daemon_context = daemon.DaemonContext()
        daemon_context.files_preserve = [httpd.fileno()]
        with daemon_context:
            httpd.serve_forever()
    elif not https_mode and daemonized:
        server_address = (local_ip, 80)
        httpd = ThreadingSimpleServer(server_address, testHTTPServer_RequestHandler)
        print('Server in esecuzione...')
        daemon_context = daemon.DaemonContext()
        daemon_context.files_preserve = [httpd.fileno()]
        with daemon_context:
            httpd.serve_forever()
    elif https_mode and not daemonized:
        server_address = (local_ip, 443)
        httpd = ThreadingSimpleServer(server_address, testHTTPServer_RequestHandler)
        httpd.socket = ssl.wrap_socket (httpd.socket, certfile = cert_file, keyfile = key_file, server_side = True)
        print('Server in esecuzione...')
        httpd.serve_forever()
    else:
        server_address = (local_ip, 80)
        httpd = ThreadingSimpleServer(server_address, testHTTPServer_RequestHandler)
        print('Server in esecuzione...')
        httpd.serve_forever()
    
run()
