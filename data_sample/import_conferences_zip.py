from elasticsearch import Elasticsearch
import os,json
import shutil
from zipfile import ZipFile

host = input ('ElasticSearch Host IP ')
directory = input ('Dataset folder ')
 
es = Elasticsearch([{'host':host, 'port':9200}])

for filename in os.listdir(directory): 
    current_file = os.path.join(directory, filename)
    
    json_file=current_file[len(directory)+1:-3]+'json'
    conference_id=current_file[len(directory)+1:-4]
   
    with ZipFile(current_file) as myzip: 
        with myzip.open(json_file) as myfile:
            data = json.load(myfile)
            citations_years=data['info']['citations_years']
            citationcount_5=0
            for year in citations_years.keys():
                if year.isnumeric():
                    y=int(year)
                    if y>2015:
                        citationcount_5+=citations_years[year]
            publications_years=data['info']['publications_years']
            activity=[]
            for year in publications_years.keys():
                if year.isnumeric():
                    activity.append(int(year))
            organizations=data['organizations']['publication_5_years']
            edu=[]
            industry=[]
            entities=data['uniqueEntities'].get('organizations')
            for org in organizations:   
                org_type=entities[org].get('organization_type')
                if org_type=='Company':
                    industry.append(org)
                if org_type=='Education':
                    edu.append(org)
            conference={'name':data['name'],
                        'id':conference_id,
                        'acronym':data['acronym'],
                        'topics':data['main_topics'],
                        'h5_index':data['info']['h5_index'],
                        'citationcount_5':citationcount_5,
                        'activity_years':{'from':min(activity),'to':max(activity)},
                        'last_year_publications':(publications_years.get('2020') if '2020' in publications_years.keys() else 0),
                        'top_3_country':data['countries']['publication_5_years'][:3],
                        'top_3_edu':edu[:3],
                        'top_3_company':industry[:3]
                        }
            
            res = es.index(index="conferences", id=conference_id, body=conference)

            
            
        


        
    
    
