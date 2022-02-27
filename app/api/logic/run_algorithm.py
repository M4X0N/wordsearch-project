from .find_word_indices import run_find_all_with_MP
from .get_sentences import get_sentence_trees
from .classes.secret_text import secret_text
from .classes.lexicon import lexicon
from datetime import datetime
from functools import reduce
import json
import os

def run_algorithm(text, lexicon, letter_offset=2, from_stage=0, save_results=True):
	'''
	execute the main algorithm.
	text is the text to find sentences from.
	lexicon is the lexicon from which to find words in the text
	from_stage is the stage from which the program is about to start:
		- stage 0 is from scratch
		- stage 1 is after run_find_all_with_MP has been run, with its output used for the next and last stage
		- save_results indicates whether the generated sentence trees should be saved into a file
	'''

	# "output/found-word-indices/{text.name}-{lexicon.name}.txt" is appended to the cwd the script is run from
	found_word_path = f'output/found-word-indices/{text.name}-{lexicon.name}-{letter_offset}.txt'

	if from_stage == 0:
		os.makedirs(os.path.dirname(found_word_path), exist_ok=True)

		# run word searching algorithm	
		indices_dict = run_find_all_with_MP(lexicon.words, text.text)

		with open(found_word_path, 'w', encoding='utf8') as output_file:
			output_file.write(json.dumps(indices_dict, ensure_ascii=False))
	elif from_stage == 1:
		with open(found_word_path, 'r', encoding='utf8') as input_file:
			indices_dict = json.loads(input_file.read())
		
	# intermediate stage. The lexicon with word indices is converted to a list,
	# where each index holds the lengths of every word that starts from the corresponding index in the text
	word_lengths = [[] for _ in range(len(text.text))]

	for word, indices in indices_dict.items():
	    for index in indices:
	        word_lengths[index].append(len(word))

	#running sentence extraction from index list 
	all_sentence_trees = get_sentence_trees(word_lengths, text.text)

	if save_results:
		# append all sentences to one long list and remove all sentences with less than two words
		all_sentences = list(filter(lambda sentence: len(sentence.split(' '))  > 2, reduce(lambda a,b: a + b, map(lambda tree: tree.get_sentences(), all_sentence_trees))))

		save_sentences_path = f'output/sentences/{text.name}-{lexicon.name}-{letter_offset}.txt'
		os.makedirs(os.path.dirname(save_sentences_path), exist_ok=True)

		with open(save_sentences_path, 'w', encoding='utf8') as save_file:
			save_file.write(json.dumps(all_sentences, ensure_ascii=False))

	return all_sentences

# usage example
if __name__ == "__main__":
	# open text and lexicon
	het = secret_text("het_and_punish.txt")
	lexicon = lexicon("dictionary2.txt")

	# restrict lexicon word lengths
	lexicon.set_word_limit(min_len=3, max_len=12)

	run_algorithm(het, lexicon, from_stage=1)