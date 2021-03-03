const combinations = {
    'authors':'papers',
    'papers':'papers',
    'conferences':'conferences',
    'organizations':'organizations',
    'citations':'papers'
}



const legal_queries = {
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
}

const dict = {
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
            'authors':'are called',
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
            'topics':'with papers on', //'with affiliated authors who have written papers on'
            'conferences':'with papers at',
            'organizations':'',
            'authors':'with', //'that have the author'
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
};


function item_question(sub){
    var msg='';
    if (legal_queries[sub]['topics'][0]){
        msg=msg+'topic or '
    }
    if (legal_queries[sub]['conferences'][0]){
        msg=msg+'conference or '
    }
    if (legal_queries[sub]['organizations'][0]){
        msg=msg+'organization or '
    }
    if (legal_queries[sub]['authors'][0]){
        msg=msg+'author'
    }
    let s = msg.substring(msg.length - 4, msg.length);
    if (s===' or '){
        msg=msg.substring(0,msg.length-3)
    }
    return msg
}

module.exports = {
    legal_queries,
    dict,
    item_question,
    combinations
}
