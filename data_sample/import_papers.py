import os,json
from elasticsearch import Elasticsearch

host = input ('ElasticSearch Host IP ')
directory = input ('Papers folder ')
es = Elasticsearch([{'host':host, 'port':9200}])

for filename in os.listdir(directory):
    current_file = os.path.join(directory, filename)
    with open(current_file) as json_file:
        data=json.load(json_file)
        for d in data:
            p=d['_source']
            cit_list=p.get('citation_for_year')
            s=0
            if cit_list is not None:
                for c in cit_list:
                    y=int(c['year'].split('-')[0])
                    if y>2015:
                        s=s+c['citationcount']
            p['citationcount_5']=s
            res = es.index(index="aida2",id=p['id'], body=p)
            print(p['id'])
        
