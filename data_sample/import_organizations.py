import os,json
from elasticsearch import Elasticsearch, helpers

host = input ('ElasticSearch Host IP ')
directory = input ('"organizations" folder ')

es = Elasticsearch([{'host':host, 'port':9200}])

index='organizations'

for filename in os.listdir(directory):
    current_file = os.path.join(directory, filename)
    print('\n',current_file,sep='',end='-')
    with open(current_file) as json_file:
      data=json.load(json_file)
      helpers.bulk(es,data)
        
