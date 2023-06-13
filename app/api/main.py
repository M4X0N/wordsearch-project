from api import api

# update paths
# api.config['LEXICONS_FOLDER'] = '/home/eyalkapi/Documents/wordsearch-project/uploaded-lexicons'
# api.config['TEXTS_FOLDER'] = '/home/eyalkapi/Documents/wordsearch-project/uploaded-texts'
api.config['LEXICONS_FOLDER'] = '/var/wordsearch/uploaded-lexicons'
api.config['TEXTS_FOLDER'] = '/var/wordsearch/uploaded-texts'
# api.config['LEXICONS_FOLDER'] = 'uploaded-lexicons'
# api.config['TEXTS_FOLDER'] = 'uploaded-texts'
api.run(host='127.0.0.1')
