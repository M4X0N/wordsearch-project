from website.api import api

# update paths
api.config['LEXICONS_FOLDER'] = '/home/jeremy/Desktop/me/project/lexicons/'
api.config['TEXTS_FOLDER'] = '/home/jeremy/Desktop/me/project/texts/'
api.run()