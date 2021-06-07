# import json
from aidaLogic import *


def query_parser(query, lng):
    combinations = {
        'authors': 'papers',
        'papers': 'papers',
        'conferences': 'conferences',
        'organizations': 'organizations',
        'citations': 'papers'
    }

    phrase_parts = {
        'en-US': {
            'com': {
                'list': ['list', 'enumerate', 'itemize', 'itemise'],
                'count': ['count', 'compute', 'calculate', 'add']
            },
            'prep': ["aboard", "about", "above", "across", "after", "against", "along", "amid", "among", "around", "as",
                     "at", "before", "behind", "below", "beneath", "beside", "between", "beyond", "but", "by",
                     "concerning", "considering", "despite", "down", "during", "except", "following", "for", "from",
                     "in", "inside", "into", "like", "minus", "near", "next", "of", "off", "on", "onto", "opposite",
                     "out", "outside", "over", "past", "per", "plus", "regarding", "round", "save", "since", "than",
                     "through", "till", "to", "toward", "under", "underneath", "unlike", "until", "up", "upon",
                     "versus", "via", "with", "within", "without"],
            'sub': {
                'list': ['authors', 'papers', 'conferences', 'organizations', 'topics', 'author', 'paper', 'conference',
                         'organization', 'topic'],
                'count': ['authors', 'papers', 'conferences', 'organizations', 'citations', 'author', 'paper',
                          'conference', 'organization', 'citation']
            },
            'obj': ['topics', 'conferences', 'organizations', 'authors', 'papers', 'topic', 'conference',
                    'organization', 'author', 'paper'],

            'order': {
                'verbs': ['order', 'ordered', 'sort', 'sorted', 'arrange', 'arranged'],
                'ways': ['publications', 'citations', 'publications in the last 5 years',
                         'citations in the last 5 years', 'publication', 'citation', 'publication in the last 5 years',
                         'citation in the last 5 years']
            }
        }
    }

    words = ['the', 'top', 'written', 'presented', 'are', 'is', 'there', 'have', 'has', 'had', 'all', 'that', 'this',
             'those', 'these', 'whole']
    query = query.lower()
    t = query.split(' ')
    phrase = {}
    cmd = ''
    sub = ''
    order = ''
    num = 0
    used_words = []

    for pos, w in enumerate(t):
        if len(cmd) == 0:
            for key in phrase_parts[lng]['com']:
                if w in phrase_parts[lng]['com'][key]:
                    cmd = key
                    phrase['cmd'] = {'value': key, 'pos': pos}
                    used_words.append(pos)
        if len(cmd) > 0 and num == 0 and len(sub) == 0:
            if w.isnumeric():
                num = int(w)
                phrase['num'] = {'value': num, 'pos': pos}
                used_words.append(pos)
        if len(cmd) > 0 and len(sub) == 0:
            if w in phrase_parts[lng]['sub'][cmd]:
                sub = w
                i = (phrase_parts[lng]['sub'][cmd].index(w)) % 5
                phrase['sub'] = {'value': phrase_parts[lng]['sub'][cmd][i], 'pos': pos}
                used_words.append(pos)
        if len(cmd) > 0 and len(sub) > 0 and pos > phrase['sub']['pos']:
            if w in phrase_parts[lng]['obj']:
                i = phrase_parts[lng]['obj'].index(w) % 5
                phrase['obj'] = {'value': phrase_parts[lng]['obj'][i], 'pos': pos}
                used_words.append(pos)
        if len(order) == 0:
            if w in phrase_parts[lng]['order']['verbs']:
                j = 0
                pos2 = pos
                for i in range(pos + 1, len(t)):
                    if t[i] in phrase_parts[lng]['order']['ways']:
                        pos2 = i
                        j = (phrase_parts[lng]['order']['ways'].index(t[i])) % 4
                    if t[i].isnumeric() and int(t[i]) == 5:
                        j += 2
                    if t[i] == 'years':
                        pos2 = i
                print(phrase_parts[lng]['order']['ways'][j], pos, pos2, sep='-')
                phrase['order'] = {'value': phrase_parts[lng]['order']['ways'][j], 'pos': pos, 'fin': pos2}
                used_words = [*used_words, *range(pos, pos2 + 1)]
        if len(order) == 0:
            if w in phrase_parts[lng]['order']['ways']:
                j = 0
                pos2 = pos
                j = (phrase_parts[lng]['order']['ways'].index(w)) % 4
                for i in range(pos + 1, len(t)):
                    if t[i].isnumeric() and int(t[i]) == 5:
                        j += 2
                    if t[i] == 'years':
                        pos2 = i
                print(phrase_parts[lng]['order']['ways'][j], pos, pos2, sep='-')
                phrase['order'] = {'value': phrase_parts[lng]['order']['ways'][j], 'pos': pos, 'fin': pos2}
                used_words = [*used_words, *range(pos, pos2 + 1)]
                    

    if cmd == 'list' and num == 0:
        num = 3
        phrase['num'] = {'value': num, 'pos': -1}

    if cmd == 'count' and len(sub) > 0 and phrase['sub']['pos'] > 1:
        for i in range(0, phrase['sub']['pos']):
            if t[i] == 'all':
                phrase['obj'] = {'value': combinations[sub], 'pos': -1}
                phrase['ins'] = {'value': 'all', 'pos': i}
                used_words.append(i)

    for pos, w in enumerate(t):
        if (w == 'all' or w == 'entire' or w == 'whole') and pos+1< len(t) and (t[pos + 1] == 'database' or t[pos + 1] == 'archive'):
            phrase['ins'] = {'value': 'all', 'pos': pos}
            used_words.append(pos)
            used_words.append(pos + 1)
        elif w == 'all' and pos+2< len(t) and t[pos + 2] == 'database':
            phrase['ins'] = {'value': 'all', 'pos': pos}
            used_words.append(pos)
            used_words.append(pos + 2)
        elif w == 'database' or w == 'archive' and t[pos - 1 if len(t) > pos - 1 > -1 else 0] == 'the' and t[
                pos - 2 if len(t) > pos - 2 > -1 else 0] == 'in':
            phrase['ins'] = {'value': 'all', 'pos': pos}
            used_words.append(pos)

    sub_pos = phrase['sub']['pos'] if len(sub)>0 else 0
    for pos, w in enumerate(t):
        if pos<sub_pos or (pos not in used_words and (w in words or w in phrase_parts[lng]['prep'])):
            used_words.append(pos)

    used_words.sort()
    
    part = ''
    prob_ins = []
    for pos, w in enumerate(t):
        if pos not in used_words:
            part += w + ' '
        elif (pos<len(t)-1 and pos-1 not in used_words and pos+1 not in used_words and w in phrase_parts[lng]['prep']):
            part += w + ' '
        elif len(part) > 0:
            prob_ins.append(part[:-1])
            part = ''
    if len(part) > 0:
        prob_ins.append(part[:-1])

    print(prob_ins)
    result = []
    if len(prob_ins) == 1:
        result.append(find_match(prob_ins[0]))
    elif len(prob_ins) > 1:
        for p_ins in prob_ins:
            result.append(find_match(p_ins))
    for res in result:
        r = json.loads(res)
        if r['result'] == 'ok':
            print(type(phrase))
            phrase['ins'] = {'value': r['item'], 'pos': -1}
            phrase['obj'] = {'value': r['object']}
    return json.dumps(phrase)

