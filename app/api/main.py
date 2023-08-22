from api import api

# update paths
api.config['LEXICONS_FOLDER'] = '/var/wordsearch/uploaded-lexicons'
api.config['TEXTS_FOLDER'] = '/var/wordsearch/uploaded-texts'
api.config['SENTENCES_FOLDER'] = '/var/wordsearch/sentences'
api.config['WORDS_FOLDER'] = '/var/wordsearch/words'

api.config['DATABASE'] = '/var/wordsearch/results.db'
api.run()
