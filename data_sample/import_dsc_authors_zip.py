from elasticsearch import Elasticsearch
import os,json
from zipfile import ZipFile

host = input ('ElasticSearch Host IP ')
file_name = = input ('Zip filename ')

es = Elasticsearch([{'host':host, 'port':9200}])
x=0
with ZipFile(file_name) as myzip: 
    a=myzip.namelist()
    for filename in a:
        with myzip.open(filename) as myfile:            
            data = json.load(myfile)
            affiliations=data['affiliations']
            if len(affiliations)>0:
                aff_index=[]
                for a in affiliations:
                    years=a['years']
                    num_years=[int(s) for s in years]
                    aff_index.append(max(num_years))
                last_aff=affiliations[aff_index.index(max(aff_index))]
                last_affiliation={'affiliation_name':last_aff['affiliation_name'],
                    'affiliation_country':last_aff['affiliation_country'],
                    'last_affil_year':max(aff_index)}
            else:
                last_affiliation={}
            topics=[]
            topics2=[]
            publications=[]
            citations=[]
            for t in data['topics']:
                topics.append(t['topic'])
                topics2.append(t['topic'])
                publications.append(t['publication']['total'])
                citations.append(t['citation']['total'])
            top_cit_topics=[]
            top_pub_topics=[]
            for i in range(5):
                if len(citations)>0:
                    max_cit_index = citations.index(max(citations))
                    top_cit_topics.append({'topic':topics.pop(max_cit_index),
                                       'citations':citations.pop(max_cit_index)})
                if len(publications)>0:
                    max_pub_index = publications.index(max(publications))
                    top_pub_topics.append({'topic':topics2.pop(max_pub_index),
                                       'publications':publications.pop(max_pub_index)})

            author={'name':data['name'],'id':data['id'],
                    'publications':data['publications'],
                    'citations':data['citations'],
                    'h-index':data['h-index'],
                    'h5-index':data['h5-index'],
                    'last_affiliation':last_affiliation,
                    'top_cit_topics':top_cit_topics,
                    'top_pub_topics':top_pub_topics
                    }
            res = es.index(index="authors", id=data['id'], body=author)
            x=x+1
            print(x,filename,sep='-')

            
            
        


        
    
    
