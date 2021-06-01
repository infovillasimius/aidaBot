import os,json
from elasticsearch import Elasticsearch


host = input ('ElasticSearch Host IP ')
directory = input ('Papers folder ')

es = Elasticsearch([{'host':host, 'port':9200}])

x=0
for filename in os.listdir(directory):
    current_file = os.path.join(directory, filename)
    with open(current_file) as json_file:
      data=json.load(json_file)
      for p in data:
        p=p['_source']
        
        a=p.get('authors')
        if a is not None:
          for i in a:
            i.pop('order', None)
            
            if 'affiliationid' in i:
              query={"track_total_hits": "true", "size": 0, "query": {"bool": {"must": [{"match_phrase": {"id": i['id']}},{"match_phrase": {"affiliationid": i['affiliationid']}}]}}}
            else:
              query={"track_total_hits": 'true',"size": 0,"query": {"match": {"id" : i['id']}}}
            res = es.search(index="authors2", body=query)
            m=res['hits']['total']['value']
            if m<1 :
              res = es.index(index="authors2", body=i)
              print (i['name'])
            x=x+1
            if(x%1000)==0:
              print(x)
        
