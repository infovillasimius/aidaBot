const dsc_obj_cat = {
    "en-US" : ['authors','conference acronyms','conference names'],
    "it-IT" : ['autori','acronimi di conferenze','nomi di conferenze']
}

const list_verbs = {
    "en-US" : ['is','are'],
    "it-IT" : ['è','sono']
};

const prepositions = {
    "en-US" : ['on','in','among','between','by','from','order','about','with','of'],
    "it-IT" : ['di','a','da','in','con','su','per','tra','fra']
};

const cmds = {
    'list':{
        "en-US" : ['list'],
        "it-IT" : ['lista','elenca']
    },
    'count':{
        "en-US" : ['count'],
        "it-IT" : ['quanti', 'conta']
    }
    
};

const orders = {
    "en-US" : ['publications','citations','publications in the last 5 years', 'citations in the last 5 years'],
    "it-IT" : ['pubblicazioni','citazioni','pubblicazioni negli ultimi 5 anni','citazioni negli ultimi 5 anni']
};

const conjunction = {
    "en-US" : ' and ',
    "it-IT" : ' e '
};

const hits = {
    "en-US" : ' hits among the ',
    "it-IT" : ' risultati tra '
};

const hit = {
    "en-US" : ' hit among the ',
    "it-IT" : ' risultato tra '
};

const in_prep = {
    "en-US" : ' among the ',
    "it-IT" : ' tra '
};

const list_prep = {
    "en-US" : ' with ',
    "it-IT" : ' con '
};

const list_author_prep = {
    "en-US" : ' by ',
    "it-IT" : ' di '
};

const item_question_object = {
    "en-US":{
        'topics':'topic or ',
        'conferences':'conference or ',
        'organizations':'organization or ',
        'authors':'author'
    },
    "it-IT":{
        'topics':'dell\'argomento o ',
        'conferences':' della conferenza o ',
        'organizations':'dell\'organizzazione o ',
        'authors':'dell\'autore'
    }
};

const combinations = {
    'authors':'papers',
    'papers':'papers',
    'conferences':'conferences',
    'organizations':'organizations',
    'citations':'papers'
};
    
const cancel_words ={
    "en-US":['cancel','stop', 'enough','stop it'],
    "it-IT":['cancella','stop','basta','smettila']
};

const list_subject_categories ={
    "en-US":['authors', 'papers', 'conferences', 'organizations', 'topics'],
    "it-IT":['autori','articoli','conferenze','organizzazioni','argomenti']
};

const list_subjects ={
    "en-US":['author', 'paper', 'conference', 'organization', 'topic'],
    "it-IT":['autore','articolo','conferenza','organizzazione','argomento']
};

const subject_categories ={
    "en-US":['authors', 'papers', 'conferences', 'organizations', 'citations'],
    "it-IT":['autori','articoli','conferenze','organizzazioni','citazioni']
};

const subjects ={
    "en-US":['author', 'paper', 'conference', 'organization', 'citation'],
    "it-IT":['autore','articolo','conferenza','organizzazione','citazione']
};

const object_categories ={
    "en-US":['topics','conferences','organizations','authors','papers'],
    "it-IT":['argomenti','conferenze','organizzazioni','autori','articoli']
    
};

const objects={
    "en-US":['topic','conference','organization','author','paper'],
    "it-IT":['argomento','conferenza','organizzazione','autore','articolo']
    
};

const count_legal_queries = {
    'authors':{
        'topics': [true, false],
        'conferences': [true,true],
        'organizations': [true,false],
        'authors': [false,false],
        'papers': [false,true],
    },
    'papers':{
        'topics': [true, false],
        'conferences': [true,true],
        'organizations': [true,false],
        'authors': [true,false],
        'papers': [false,true],
    },
    'conferences':{
        'topics': [true, false],
        'conferences': [false,true],
        'organizations': [true,false],
        'authors': [true,false],
        'papers': [false,false],
    },
    'organizations':{
        'topics': [true, false],
        'conferences': [true,false],
        'organizations': [false,true],
        'authors': [true,false],
        'papers': [false,false],
    },
    'citations':{
        'topics': [true, false],
        'conferences': [true,false],
        'organizations': [true,false],
        'authors': [true,false],
        'papers': [false,false],
    }
};

const list_legal_queries = {
    'authors':{
        'topics': [true, true],
        'conferences': [true,true],
        'organizations': [true,true],
        'authors': [false,false],
        'all': [true,true],
    },
    'papers':{
        'topics': [false, true],
        'conferences': [false,true],
        'organizations': [false,true],
        'authors': [false,true],
        'all': [false,true],
    },
    'conferences':{
        'topics': [true, true],
        'conferences': [false,false],
        'organizations': [true,true],
        'authors': [true,true],
        'all': [true,true],
    },
    'organizations':{
        'topics': [true, true],
        'conferences': [true,true],
        'organizations': [false,false],
        'authors': [false,false],
        'all': [true,true],
    },
    'topics':{
        'topics': [false, false],
        'conferences': [true,true],
        'organizations': [true,true],
        'authors': [true,true],
        'all': [true,true],
    }
};

const dict = {
    "it-IT":{
        'sub':{
            'authors':{
                'topics':'autori',
                'conferences':'autori',
                'organizations':'autori',
                'authors':'autori',
                'papers':'autori'
            },
            'papers':{
                'topics':'articoli',
                'conferences':'articoli',
                'organizations':'articoli',
                'authors':'articoli',
                'papers':''
            },
            'conferences':{
                'topics':'conferenze',
                'conferences':'conferenze',
                'organizations':'conferenze',
                'authors':'conferenze',
                'papers':''
            },
            'organizations':{
                'topics':'organizzazioni',
                'conferences':'organizzazioni',
                'organizations':'organizzazioni',
                'authors':'organizzazioni',
                'papers':''
            },
            'citations':{
                'topics':'citazioni',
                'conferences':'citazioni',
                'organizations':'citazioni',
                'authors':'citazioni',
                'papers':''
            }
        },
        'prep':{
            'authors':{
                'topics':'che hanno scritto articoli su',
                'conferences':'che hanno scritto articoli per conferenze ',
                'organizations':'affiliati a',
                'authors':'', 
                'papers':''
            },
            'papers':{
                'topics':'su',
                'conferences':'presentati in conferenze',
                'organizations':'da autori affiliati a',
                'authors':'dell\'autore',
                'papers':''
            },
            'conferences':{
                'topics':'con articoli su',
                'conferences':'',
                'organizations':'con articoli di autori affiliati a',
                'authors':'con articoli dell\'autore',
                'papers':''
            },
            'organizations':{
                'topics':'con articoli su', 
                'conferences':'con articoli presentati a',
                'organizations':'',
                'authors':'con',
                'papers':''
            },
            'citations':{
                'topics':'di articoli su',
                'conferences':'di articoli da',
                'organizations':'di articoli scritti da autori affiliati a',
                'authors':'di articoli scritti dall\'autore',
                'papers':''
            }
        },
        'obj':{
            'authors':{
                'topics':'',
                'conferences':'',
                'organizations':'',
                'authors':'',
                'papers':''
            },
            'papers':{
                'topics':'',
                'conferences':'',
                'organizations':'',
                'authors':'',
                'papers':'articoli'
            },
            'conferences':{
                'topics':'',
                'conferences':'',
                'organizations':'',
                'authors':'',
                'papers':''
            },
            'organizations':{
                'topics':'',
                'conferences':'conferenze',
                'organizations':'',
                'authors':'tra gli autori affiliati',
                'papers':''
            },
            'citations':{
                'topics':'',
                'conferences':'conferenze',
                'organizations':'',
                'authors':'',
                'papers':''
           }
        }
    },
    "en-US":{
        'sub':{
            'authors':{
                'topics':'authors',
                'conferences':'authors',
                'organizations':'authors',
                'authors':'authors',
                'papers':'authors'
            },
            'papers':{
                'topics':'papers',
                'conferences':'papers',
                'organizations':'papers',
                'authors':'papers',
                'papers':''
            },
            'conferences':{
                'topics':'conferences',
                'conferences':'conferences',
                'organizations':'conferences',
                'authors':'conferences',
                'papers':''
            },
            'organizations':{
                'topics':'organizations',
                'conferences':'organizations',
                'organizations':'organizations',
                'authors':'organizations',
                'papers':''
            },
            'citations':{
                'topics':'citations',
                'conferences':'citations',
                'organizations':'citations',
                'authors':'citations',
                'papers':''
            }
        },
        'prep':{
            'authors':{
                'topics':'who have written papers on',
                'conferences':'who have written papers for',
                'organizations':'affiliated to the',
                'authors':'', 
                'papers':''
            },
            'papers':{
                'topics':'on',
                'conferences':'from',
                'organizations':'from authors affiliated to the',
                'authors':'written by the author',
                'papers':''
            },
            'conferences':{
                'topics':'with papers on',
                'conferences':'',
                'organizations':'with papers by authors affiliated to the',
                'authors':'with papers written by the author',
                'papers':''
            },
            'organizations':{
                'topics':'with papers on', 
                'conferences':'with papers at',
                'organizations':'',
                'authors':'with',
                'papers':''
            },
            'citations':{
                'topics':'of papers on',
                'conferences':'of papers from',
                'organizations':'of papers written by authors affiliated to the',
                'authors':'of papers written by the author',
                'papers':''
            }
        },
        'obj':{
            'authors':{
                'topics':'topics',
                'conferences':'conferences',
                'organizations':'',
                'authors':'',
                'papers':''
            },
            'papers':{
                'topics':'topics',
                'conferences':'conferences',
                'organizations':'',
                'authors':'',
                'papers':'papers'
            },
            'conferences':{
                'topics':'topics',
                'conferences':'',
                'organizations':'',
                'authors':'',
                'papers':''
            },
            'organizations':{
                'topics':'',
                'conferences':'conferences',
                'organizations':'',
                'authors':'among their affiliated authors',
                'papers':''
            },
            'citations':{
                'topics':'topics',
                'conferences':'conferences',
                'organizations':'',
                'authors':'',
                'papers':''
           }
        }
    }
};

const list_dict = {
    "it-IT":{
        'pubblicazioni':{
            'sub':{
                'authors':{
                    'topics':'autori',
                    'conferences':'autori',
                    'organizations':'autori',
                    'authors':'autori',
                    'papers':'autori'
                },
                'papers':{
                    'topics':'articoli',
                    'conferences':'articoli',
                    'organizations':'articoli',
                    'authors':'articoli',
                    'papers':''
                },
                'conferences':{
                    'topics':'conferenze',
                    'conferences':'conferenze',
                    'organizations':'conferenze',
                    'authors':'conferenze',
                    'papers':''
                },
                'organizations':{
                    'topics':'organizzazioni',
                    'conferences':'organizzazioni',
                    'organizations':'organizzazioni',
                    'authors':'organizzazioni',
                    'papers':''
                },
                'topics':{
                    'topics':'argomenti',
                    'conferences':'argomenti',
                    'organizations':'argomenti',
                    'authors':'argomenti',
                    'papers':''
                }
            },
            'prep':{
                'authors':{
                    'topics':'di articoli su',
                    'conferences':'di articoli presentati in conferenze',
                    'organizations':'affiliati a',
                    'authors':'',
                    'papers':''
                },
                'papers':{
                    'topics':'su',
                    'conferences':'presentati in conferenze',
                    'organizations':'da autori affiliati a',
                    'authors':'dell\'autore',
                    'papers':''
                },
                'conferences':{
                    'topics':'di articoli su',
                    'conferences':'',
                    'organizations':'di articoli di autori affiliati a',
                    'authors':'di articoli dell\'autore',
                    'papers':''
                },
                'organizations':{
                    'topics':'di articoli su', 
                    'conferences':'di articoli presentati in conferenze',
                    'organizations':'',
                    'authors':'con',
                    'papers':''
                },
                'topics':{
                    'topics':'di articoli su',
                    'conferences':'di articoli presentati in conferenze',
                    'organizations':'di articoli scritti da autori affiliati a',
                    'authors':'di articoli scritti dall\'autore',
                    'papers':''
                }
            },
            'obj':{
                'authors':{
                    'topics':'',
                    'conferences':'',
                    'organizations':'',
                    'authors':'',
                    'papers':''
                },
                'papers':{
                    'topics':'',
                    'conferences':'',
                    'organizations':'',
                    'authors':'',
                    'papers':'articoli'
                },
                'conferences':{
                    'topics':'',
                    'conferences':'',
                    'organizations':'',
                    'authors':'',
                    'papers':''
                },
                'organizations':{
                    'topics':'',
                    'conferences':'',
                    'organizations':'',
                    'authors':'tra gli autori affiliati',
                    'papers':''
                },
                'topics':{
                    'topics':'',
                    'conferences':'',
                    'organizations':'',
                    'authors':'',
                    'papers':''
               }
            }
        },
        'citazioni':{
            'sub':{
                'authors':{
                    'topics':'autori',
                    'conferences':'autori',
                    'organizations':'autori',
                    'authors':'autori',
                    'papers':'autori'
                },
                'papers':{
                    'topics':'articoli',
                    'conferences':'articoli',
                    'organizations':'articoli',
                    'authors':'articoli',
                    'papers':''
                },
                'conferences':{
                    'topics':'conferenze',
                    'conferences':'conferenze',
                    'organizations':'conferenze',
                    'authors':'conferenze',
                    'papers':''
                },
                'organizations':{
                    'topics':'organizzazioni',
                    'conferences':'organizzazioni',
                    'organizations':'organizzazioni',
                    'authors':'organizzazioni',
                    'papers':''
                },
                'topics':{
                    'topics':'argomenti',
                    'conferences':'argomenti',
                    'organizations':'argomenti',
                    'authors':'argomenti',
                    'papers':''
                }
            },
            'prep':{
                'authors':{
                    'topics':'che hanno scritto articoli su',
                    'conferences':'di articoli presentati in conferenze',
                    'organizations':'affiliati a',
                    'authors':'',
                    'papers':''
                },
                'papers':{
                    'topics':'su',
                    'conferences':'presentati in conferenze',
                    'organizations':', scritti da autori affiliati a',
                    'authors':', scritti dall\'autore',
                    'papers':''
                },
                'conferences':{
                    'topics':'di articoli su',
                    'conferences':'',
                    'organizations':'di articoli di autori affiliati a',
                    'authors':'di articoli dell\'autore',
                    'papers':''
                },
                'organizations':{
                    'topics':'di articoli su', 
                    'conferences':'di articoli presentati a',
                    'organizations':'',
                    'authors':'con',
                    'papers':''
                },
                'topics':{
                    'topics':'di articoli su',
                    'conferences':'di articoli da',
                    'organizations':'di articoli scritti da autori affiliati a',
                    'authors':'di articoli scritti dall\'autore',
                    'papers':''
                }
            },
            'obj':{
                'authors':{
                    'topics':'',
                    'conferences':'',
                    'organizations':'',
                    'authors':'',
                    'papers':''
                },
                'papers':{
                    'topics':'',
                    'conferences':'',
                    'organizations':'',
                    'authors':'',
                    'papers':'articoli'
                },
                'conferences':{
                    'topics':'',
                    'conferences':'',
                    'organizations':'',
                    'authors':'',
                    'papers':''
                },
                'organizations':{
                    'topics':'',
                    'conferences':'',
                    'organizations':'',
                    'authors':'tra gli autori affiliati',
                    'papers':''
                },
                'topics':{
                    'topics':'',
                    'conferences':'conferenze',
                    'organizations':'',
                    'authors':'',
                    'papers':''
               }
            }
        }
    },
    "en-US":{
        'publications':{
            'sub':{
                'authors':{
                    'topics':'authors',
                    'conferences':'authors',
                    'organizations':'authors',
                    'authors':'authors',
                    'papers':'authors'
                },
                'papers':{
                    'topics':'papers',
                    'conferences':'papers',
                    'organizations':'papers',
                    'authors':'papers',
                    'papers':''
                },
                'conferences':{
                    'topics':'conferences',
                    'conferences':'conferences',
                    'organizations':'conferences',
                    'authors':'conferences',
                    'papers':''
                },
                'organizations':{
                    'topics':'organizations',
                    'conferences':'organizations',
                    'organizations':'organizations',
                    'authors':'organizations',
                    'papers':''
                },
                'topics':{
                    'topics':'topics',
                    'conferences':'topics',
                    'organizations':'topics',
                    'authors':'topics',
                    'papers':''
                }
            },
            'prep':{
                'authors':{
                    'topics':'who have written papers on',
                    'conferences':'who have written papers for',
                    'organizations':'affiliated to the',
                    'authors':'',
                    'papers':''
                },
                'papers':{
                    'topics':'on',
                    'conferences':'from',
                    'organizations':'from authors affiliated to the',
                    'authors':'written by the author',
                    'papers':''
                },
                'conferences':{
                    'topics':'with papers on',
                    'conferences':'',
                    'organizations':'with papers by authors affiliated to the',
                    'authors':'with papers written by the author',
                    'papers':''
                },
                'organizations':{
                    'topics':'with papers on',
                    'conferences':'with papers at',
                    'organizations':'',
                    'authors':'with', 
                    'papers':''
                },
                'topics':{
                    'topics':'',
                    'conferences':'of papers from',
                    'organizations':'of papers written by authors affiliated to the',
                    'authors':'of papers written by the author',
                    'papers':''
                }
            },
            'obj':{
                'authors':{
                    'topics':'topics',
                    'conferences':'conferences',
                    'organizations':'',
                    'authors':'',
                    'papers':''
                },
                'papers':{
                    'topics':'topics',
                    'conferences':'conferences',
                    'organizations':'',
                    'authors':'',
                    'papers':'papers'
                },
                'conferences':{
                    'topics':'topics',
                    'conferences':'',
                    'organizations':'',
                    'authors':'',
                    'papers':''
                },
                'organizations':{
                    'topics':'',
                    'conferences':'conferences',
                    'organizations':'',
                    'authors':'among their affiliated authors',
                    'papers':''
                },
               'topics':{
                    'topics':'',
                    'conferences':'conferences',
                    'organizations':'',
                    'authors':'',
                    'papers':''
                }
            }
        },
        'citations':{
            'sub':{
                'authors':{
                    'topics':'authors',
                    'conferences':'authors',
                    'organizations':'authors',
                    'authors':'authors',
                    'papers':'authors'
                },
                'papers':{
                    'topics':'papers',
                    'conferences':'papers',
                    'organizations':'papers',
                    'authors':'papers',
                    'papers':''
                },
                'conferences':{
                    'topics':'conferences',
                    'conferences':'conferences',
                    'organizations':'conferences',
                    'authors':'conferences',
                    'papers':''
                },
                'organizations':{
                    'topics':'organizations',
                    'conferences':'organizations',
                    'organizations':'organizations',
                    'authors':'organizations',
                    'papers':''
                },
                'topics':{
                    'topics':'topics',
                    'conferences':'topics',
                    'organizations':'topics',
                    'authors':'topics',
                    'papers':''
                }
            },
            'prep':{
                'authors':{
                    'topics':'who have written papers on',
                    'conferences':'who have written papers for',
                    'organizations':'affiliated to the',
                    'authors':'', 
                    'papers':''
                },
                'papers':{
                    'topics':'on',
                    'conferences':'from',
                    'organizations':'from authors affiliated to the',
                    'authors':'written by the author',
                    'papers':''
                },
                'conferences':{
                    'topics':'with papers on',
                    'conferences':'',
                    'organizations':'with papers by authors affiliated to the',
                    'authors':'with papers written by the author',
                    'papers':''
                },
                'organizations':{
                    'topics':'with papers on', 
                    'conferences':'with papers at',
                    'organizations':'',
                    'authors':'with',
                    'papers':''
                },
                'topics':{
                    'topics':'',
                    'conferences':'of papers from',
                    'organizations':'of papers written by authors affiliated to the',
                    'authors':'of papers written by the author',
                    'papers':''
                }
            },
            'obj':{
                'authors':{
                    'topics':'topics',
                    'conferences':'conferences',
                    'organizations':'',
                    'authors':'',
                    'papers':''
                },
                'papers':{
                    'topics':'topics',
                    'conferences':'conferences',
                    'organizations':'',
                    'authors':'',
                    'papers':'papers'
                },
                'conferences':{
                    'topics':'topics',
                    'conferences':'',
                    'organizations':'',
                    'authors':'',
                    'papers':''
                },
                'organizations':{
                    'topics':'',
                    'conferences':'conferences',
                    'organizations':'',
                    'authors':'among their affiliated authors',
                    'papers':''
                },
               'topics':{
                    'topics':'',
                    'conferences':'conferences',
                    'organizations':'',
                    'authors':'',
                    'papers':''
                }
            }
        }
    }
};

const articles={
    'autore':       'l\'autore',
    'autori':       'gli autori',
    'argomento':    'l\'argomento',
    'argomenti':    'gli argomenti',
    'conferenza':   'la conferenza',
    'conferenze':   'le conferenze',
    'organizzazione':'l\'organizzazione',
    'organizzazioni':'le organizzazioni',
    'articolo':     'l\'articolo',
    'articoli':     'gli articoli',
    'citazione':    'la citazione',
    'citazioni':    'le citazioni',
    'pubblicazioni':'le pubblicazioni'
};

const intent_confirmation_articles={
    "en-US":['', '', '', '', '','', '', '', '', '','', '', '', '', ''],
    "it-IT":['dei','dei','delle','delle','dei','i','i','le','le','i','il','il','la','la','il']
};

const list_order={
    "en-US" : ['publication','citation','publication in the last 5 years', 'citation in the last 5 years'],
    "it-IT" : ['pubblicazione','citazione','pubblicazione negli ultimi 5 anni','citazione negli ultimi 5 anni']
};

const one={
    "en-US" : ['1'],
    "it-IT" : ['una']
};

const numbers={
    "en-US" :['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth',
              '1','2','3','4','5','6','7','8','9','10','one','two','three','four','five','six','seven','eight','nine','ten'],
    "it-IT" :['primo','secondo','terzo','quarto','quinto','sesto','settimo','ottavo','nono','decimo','1','2','3','4','5','6','7','8','9','10',
              'uno','due','tre','quattro','cinque','sei','sette','otto','nove','dieci']
}

const homonyms_list={
    "en-US" :[' affiliated with ',' author of the paper: ',', author with ',' publications'],
    "it-IT" :[' affiliato a ',' autore dell\'articolo ',', autore con ',' pubblicazioni']
}

const dsc_list={
    "en-US" :[' is an author',' affiliated to ',' affiliated to the ','Author rating: ','publications: ' ,'citations: ','Total number of co-authors: ',
              'The top topic in terms of publications is: ','The top topics in terms of publications are: ',
              'The top conference in terms of publications is: ', 'The top conferences in terms of publications are: ',
              'The top journal in terms of publications is: ', 'The top journals in terms of publications are: ',', acronym of ',', is a conference whose focus areas are: ',
              'Ratings: ','citations in the last 5 years: ','Years of activity: from ',' to ','Number of publications in the last year: ',
              'The top country in terms of publications is: ', 'The top countries in terms of publications are: ',
              'The top organization in education is: ', 'The top organizations in education are: ',
              'The top organization in industry is: ', 'The top organizations in industry are: '],
    "it-IT" :[' è un autore' ,' affiliato a '  ,' affiliato a '      ,'Valutazioni: '  ,'pubblicazioni: ','citazioni: ','Numero di co-autori: '       ,
              'L\'argomento principale per numero di pubblicazioni è: ','Gli argomenti principali, per numero di pubblicazioni, sono: ',
              "La conferenza principale per numero di pubblicazioni è: ", "Le conferenze principali per numero di pubblicazioni sono: ",
              'La rivista principale per numero di pubblicazioni è: ', 'Le riviste principali per numero di pubblicazioni sono: ', ', acronimo di ', ', è una conferenza le cui aree di interesse sono: ',
              "Valutazioni: ", "citazioni negli ultimi 5 anni: ", "Anni di attività: dal ", " al ", "Numero di pubblicazioni nell'ultimo anno: ",
              "Il primo paese in termini di pubblicazioni è: ", "I primi paesi in termini di pubblicazioni sono: ",
              'La migliore organizzazione nel campo dell\'istruzione è: ', 'Le migliori organizzazioni nell\'istruzione sono: ',
              "La migliore organizzazione del settore è: ", "Le migliori organizzazioni del settore sono: "]
}


function swap(lng,subject){
    return subject_categories['en-US'][subject_categories[lng].indexOf(subject)];
}

function list_swap(lng,subject){
    return list_subject_categories['en-US'][list_subject_categories[lng].indexOf(subject)];
}

function swap_o(lng,object){
    if(object_categories[lng].indexOf(object)===-1){
        return object;
    }
    return object_categories['en-US'][object_categories[lng].indexOf(object)];
}

function article(lng,subject){
    if(lng==='it-IT'){
        return articles[subject];
    }
    return subject;
}

function singular(lng,subject){
    return subjects[lng][subject_categories[lng].indexOf(subject)];
}


function item_question(subject,lng){
    var msg='';
    let sub=swap(lng,subject);
    if (count_legal_queries[sub]['topics'][0]){
        msg=msg+item_question_object[lng]['topics']
    }
    if (count_legal_queries[sub]['conferences'][0]){
        msg=msg+item_question_object[lng]['conferences']
    }
    if (count_legal_queries[sub]['organizations'][0]){
        msg=msg+item_question_object[lng]['organizations']
    }
    if (count_legal_queries[sub]['authors'][0]){
        msg=msg+item_question_object[lng]['authors']
    }
    if(lng==='it-IT'){
        let s = msg.substring(msg.length - 3, msg.length);
        if (s===' o '){
            msg=msg.substring(0,msg.length-2)
        } 
    }
    if(lng==='en-US'){
       let s = msg.substring(msg.length - 4, msg.length);
        if (s===' or '){
            msg=msg.substring(0,msg.length-3)
        } 
    }
    
    
    return msg
}

function list_item_question(subject,lng){
    var msg='';
    let sub=list_swap(lng,subject);
    if (list_legal_queries[sub]['topics'][1]){
        msg=msg+item_question_object[lng]['topics']
    }
    if (list_legal_queries[sub]['conferences'][1]){
        msg=msg+item_question_object[lng]['conferences']
    }
    if (list_legal_queries[sub]['organizations'][1]){
        msg=msg+item_question_object[lng]['organizations']
    }
    if (list_legal_queries[sub]['authors'][1]){
        msg=msg+item_question_object[lng]['authors']
    }
    if(lng==='it-IT'){
        let s = msg.substring(msg.length - 3, msg.length);
        if (s===' o '){
            msg=msg.substring(0,msg.length-2)
        } 
    }
    if(lng==='en-US'){
       let s = msg.substring(msg.length - 4, msg.length);
        if (s===' or '){
            msg=msg.substring(0,msg.length-3)
        } 
    }
    
    return msg
}

function lst(result,order,lng){
    let o=orders[lng].indexOf(order);
    let msg=' ';
    let ord;
    if(o===1 || o===3){
        let list=result.lst;
        for(let i in list){
            let author=''
            if(list[i].author && list[i].author.length>0){
                author=list_author_prep[lng]+list[i].author
            }
            
            if(list[i].citations===1){
                list[i].citations=one[lng]
                ord=list_order[lng][o];
            } else { 
                ord=order;
            }
            
            msg=msg+' '+list[i].name+author+list_prep[lng]+list[i].citations+' '+ord.split(' ')[0]+'.'
        }
    } else {
        let list=result.lst;
        for(let i in list){
            let author=''
            if(list[i].author && list[i].author.length>0){
                author=list_author_prep[lng]+list[i].author
            }
            
            if(list[i].papers===1){
                list[i].papers=one[lng]
                ord=list_order[lng][o];
            } else { 
                ord=order;
            }
            
            msg=msg+' '+list[i].name+author+list_prep[lng]+list[i].papers+' '+ord.split(' ')[0]+'.'
        }
    }
    return msg;
}

function homonyms(speak,lng){
    let msg='';
    let num=0;
    let item=speak.item;
    for(let i in item){
        num=numbers[lng][i]
        msg=msg+num+', '+ item[i].name
        if(item[i].affiliation){
            msg=msg + homonyms_list[lng][0]+ item[i].affiliation+"; \n"
        } else if(item[i].paper) {
            msg=msg + homonyms_list[lng][1]+ item[i].paper+"; \n"
        } else if(item[i].publications) {
            msg=msg + homonyms_list[lng][2]+ item[i].publications+homonyms_list[lng][3]+"; \n"
        } else {
            msg+="; \n"
        }
        if (i>8){
            return msg;
        }
    }
    return msg;
}

function get_number(item,lng){
    let words=item.split(' ');
    for(let i in words){
        if (numbers[lng].includes(words[i])){
            return (numbers[lng].indexOf(words[i])%10)
        }
    }
    return NaN
}

function list_elements(list,lng,element){
    let msg='';
    for(let i in list){
        if(element.length>0){
            msg+=list[i][element]
        } else {
            msg+=list[i]
        }
        if(i==list.length-2){
            msg+=conjunction[lng]
        } else if(i==list.length-1){
            msg+='; '
        } else {
            msg+=', '
        }
    }
    return msg;
}

function dsc(query,lng){
    let msg='';
    let item=query.item;
    if (query.obj_id===1){
        msg=item.name+dsc_list[lng][0];
        if(item.last_affiliation.affiliation_name){
            let s=item.last_affiliation.affiliation_name.split(' ');
            msg=msg+((s[0]==='the' || s[0]==='The') ? dsc_list[lng][1]:dsc_list[lng][2])+item.last_affiliation.affiliation_name+' '
        } else {
            msg+='. '
        }
        if(item.last_affiliation.affiliation_country){
            msg+=', '+item.last_affiliation.affiliation_country+'. '
        }
        msg+=dsc_list[lng][3];
        if(item.publications){
            msg+=dsc_list[lng][4]+item.publications+'; ';
        }
        if(item.citations){
            msg+=dsc_list[lng][5]+item.citations+'; ';
        }
        if(item['h-index']){
            msg+='h-index: '+item['h-index']+'; ';
        }
        if(item['h5-index']){
            msg+='h5-index: '+item['h5-index']+'; ';
        }
        if (item['co_authors'] && item.co_authors>0){
            msg+=dsc_list[lng][6] + item.co_authors+'; '
        }
        /*if(item.top_cit_topics && item.top_cit_topics.length>0){
            msg+='Top topics by number of citations: '
            msg+=list_elements(item.top_cit_topics,lng,'topic')
        }*/
        if(item.top_pub_topics && item.top_pub_topics.length>0){
            msg+=(item.top_pub_topics.length==1 ? dsc_list[lng][7]: dsc_list[lng][8])
            msg+=list_elements(item.top_pub_topics,lng,'topic')
        }
        /*if(item.top_cit_conf && item.top_cit_conf.length>0){
            msg+='Top conferences by number of citations: '
            msg+=list_elements(item.top_cit_conf,lng,'name')
        }*/
        if(item.top_pub_conf && item.top_pub_conf.length>0){
            msg+=(item.top_pub_conf.length==1 ? dsc_list[lng][9]: dsc_list[lng][10])
            msg+=list_elements(item.top_pub_conf,lng,'name')
        }
        if(item.top_journals && item.top_journals.length>0){
            msg+=(item.top_journals.length==1 ? dsc_list[lng][11]: dsc_list[lng][12])
            msg+=list_elements(item.top_journals,lng,'name')
        } 
    } else if (query.obj_id===2 || query.obj_id===3){
        msg+=item.acronym+dsc_list[lng][13]+item.name+ dsc_list[lng][14]
        msg+=list_elements(item.topics,lng,'')
        msg+=dsc_list[lng][15]
        if(item['h5_index']){
            msg+='h5-index: '+item['h5_index']+'; ';
        }
        if(item['citationcount_5']){
            msg+=dsc_list[lng][16]+item['citationcount_5']+'; ';
        }
        if(item['activity_years']){
            msg+=dsc_list[lng][17]+item['activity_years']['from']+dsc_list[lng][18]+item['activity_years']['to']+'; '
        }
        if(item.last_year_publications){
            msg+=dsc_list[lng][19]+item.last_year_publications+'; '
        }
        if(item.top_3_country){
            msg+=(item.top_3_country.length==1 ? dsc_list[lng][20]: dsc_list[lng][21])
            msg+=list_elements(item.top_3_country,lng,'')
        }
        if(item.top_3_edu){
            msg+=(item.top_3_edu.length==1 ? dsc_list[lng][22]: dsc_list[lng][23])
            msg+=list_elements(item.top_3_edu,lng,'')
        }
        if(item.top_3_company){
            msg+=(item.top_3_company.length==1 ? dsc_list[lng][24]:dsc_list[lng][25])
            msg+=list_elements(item.top_3_company,lng,'')
        }
        
        
        
        
    } else {
        msg+='Sorry, Query not yet implemented!'
    }
    return msg;
}


module.exports = {
    count_legal_queries,
    dict,
    list_dict,
    item_question,
    combinations,
    cancel_words,
    subject_categories,
    subjects,
    object_categories,
    swap,
    swap_o,
    article,
    singular,
    conjunction,
    hits,
    hit,
    in_prep,
    list_subject_categories,
    list_subjects,
    list_item_question,
    list_legal_queries,
    list_swap,
    orders,
    cmds,
    prepositions,
    lst,
    list_verbs,
    intent_confirmation_articles,
    homonyms,
    get_number,
    dsc_obj_cat,
    dsc,
    objects
};
