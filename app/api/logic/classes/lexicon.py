class lexicon():
	'''
	used to scan a lexicon from file
	'''
	def __init__(self, api, path, delim=";"):
		self.delimiter = delim
		# "uploaded_texts/{path}" path is appended to the cwd the script is run from
		self.words = self.read_lexicon(f"{api.config['LEXICONS_FOLDER']}/{path}")
		self.name = path.split('.')[0]

	def read_lexicon(self, path):
		# only as txt format
		with open(path, 'r') as file:
			return file.read().split(self.delimiter)

	def set_word_limit(self, min_len=2, max_len=15):
		# enforce the length of all words in word lexicon to be in specified range
		self.words = [word for word in self.words if len(word) > min_len and len(word) < max_len]
