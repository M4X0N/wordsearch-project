from .classes.sentence_tree import sentence_tree

from itertools import repeat
import concurrent.futures
import os

def get_sentence_trees(word_lengths, text, indices):
	'''
	build trees of all possible sentences, each starting at a different index in the text.
	text is the given text.
	word_lengths is a list, equal in length to len(text) where each index represents the corresponding character in text.
	Each member of word_length is a list representing the length of every word that starts from that character.
	'''

	def get_sentences_recursion(char_index):
		'''
		this function takes an index of a character in the text, then recursively builds every possible sentence that begins in that index
		'''
		nodes = []
		curr_node = None

		try:
			if len(word_lengths[char_index]) < 1:
				return None

			# iterate over all possible word lengths that begin from current character and make a separate branch in the tree for each.
			for word_length in word_lengths[char_index]:
				curr_node = sentence_tree(text[char_index:char_index + word_length])
				curr_node.children = get_sentences_recursion(char_index + word_length)
				nodes.append(curr_node)

			word_lengths[char_index] = []

		except IndexError as e:
			pass
			# print(char_index)

		return nodes

	sentence_trees = []
	current_sentence_tree = None

	# for every character in the text, build sentence trees whose roots are words that start from that character
	for starting_idx in indices:
		if len(word_lengths[starting_idx]) > 0:
			current_sentence_tree = sentence_tree(data=starting_idx, root=True)
			current_sentence_tree.children = get_sentences_recursion(starting_idx)
			sentence_trees.append(current_sentence_tree)

	return sentence_trees

def run_get_sentence_trees_MP(word_lengths, text):
	"""
	function gets word lengths list and a text, divides list into N equal parts where N = number of cores on machine.
	It then runs N different processes, significantly reducing runtime
	"""

	skip               = int(len(word_lengths) / os.cpu_count()) # get amount of found word indices to be allocated to each process
	indices_list       = [ range(i, i + skip) for i in range(0, len(word_lengths), skip) ] # split word_lengths into N equal parts
	all_sentence_trees = []

	# becuase skip is rounded down the dictionary isn't split perfectly which results in index errors
	if indices_list[-1][-1] > len(word_lengths):
		indices_list.pop()

	# run sentence tree building in parallel using Process pool
	with concurrent.futures.ProcessPoolExecutor() as executor:
		results = executor.map(get_sentence_trees, repeat(word_lengths), repeat(text), indices_list)

		for result in results:
			all_sentence_trees.extend(result)

	return all_sentence_trees

# ----------------------------------------------------
#	example for text and indices list:
#	sentence = "abthrgcrbtpactokdftnstvct"
#   idx_list = [[2,3,4,6],[],[],[1],[],[],[5,7, 10],[],[],[2],[2],[3],[],[],[],[],[3],[],[],[2],[],[],[],[],[]]
		  	   # 0        1  2   3  4   5  6        7  8  9   10  11  12 13 14 15 16  17 18 19  20 21 22 23 24