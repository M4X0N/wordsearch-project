from ..logic.classes.secret_text import secret_text
from ..logic.classes.lexicon import lexicon
from ..logic.run_algo import run_algorithm

def run(text_name, lexicon_name, min_word_length, max_word_length, from_stage):
    # open text and lexicon
	text = secret_text(text_name)
	lexicon = lexicon(lexicon_name)

	# restrict lexicon word lengths
	lexicon.set_word_limit(min_word_length, max_word_length)

	run_algorithm(text, lexicon, from_stage, save_results=True)