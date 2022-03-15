# this file handles the logic of finding (the index of) every occurence of each lexicon word inside a given text.
# It then yields the result into a dict.
# This process is done by splitting the initial lexicon into equal parts where each part is handled by a different processor.
# Important! check if this can be migrated into aws easily or if it will raise some problems.

from itertools import repeat
import concurrent.futures
import os

def find_word(p, s):
	"""
	find all indices of word 'p' in string 's' and return (as generator, using yield).
	This use case finds overlapping uses as well (for ex.: if p is 'aa' and s is 'aaa' the indices 0,1 will be returned).
	If not needed, replace last line with(i = s.find(p, i+(len(p)))
	"""
	i = s.find(p)
	while i != -1:
		yield i
		i = s.find(p, i+1)

def find_all(l, s):
	"""
	runs find_word function for given lexicon 'l' and str 's', and returns dict of the form
	{"current_lexicon_word": [list of indices in s where word appears]}
	"""
	return {curr_word: [i for i in find_word(curr_word, s)] for curr_word in l}

# need to check if this will work in aws server
def run_find_all_MP(entire_lexicon, entire_string):
	"""
	function gets lexicon and string, divides lexicon into N equal parts where N = number of cores on machine.
	It then runs N different processes, significantly reducing runtime
	"""

	skip          = int(len(entire_string)/os.cpu_count()) # get amount of words from lexicon to be allocated to each process
	split_lexicon = [ entire_lexicon[i:i + skip] for i in range(0, len(entire_lexicon), skip) ] # split lexicon into N equal parts
	final         = {}

	# run word finding in parallel using Process pool
	with concurrent.futures.ProcessPoolExecutor() as executor:
		results = executor.map(find_all, split_lexicon, repeat(entire_string))

		for result in results:
			final.update(result)

	return {key:value for key,value in final.items() if value}





