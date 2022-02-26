# this file handles the logic of finding (the index of) every occurence of each lexicon word inside a given text.
# It then yields the result into a dict.
# This process is done by splitting the initial lexicon into equal parts where each part is handled by a different processor.
# Important! check if this can be migrated into aws easily or if it will raise some problems.

from itertools import repeat
import concurrent.futures
import os

def find_all(p, s):
	"""
	find all indexes of word 'p' in string 's' and return (as generator, using yield).
	This use case finds overlapping uses as well. If not needed, replace last line with(i = s.find(p, i+(len(p)))
	"""
	i = s.find(p)
	while i != -1:
		yield i
		i = s.find(p, i+1)

def run_find_all(l, s):
	"""
	runs find_all function for given lexicon 'l' and str 's', and returns dict of the form
	{"current_lexicon_word": [list of indices in s where word appears]}
	"""
	return {curr_word: [i for i in find_all(curr_word, s)] for curr_word in l}

# need to check if this will work in aws server
def run_find_all_with_MP(ent_l, ent_s):
	"""
	function gets lexicon and string, divides lexicon into N equal parts where N = number of cores on machine.
	It then runs N differet processes, significantly speeding up runtime
	"""

	skip          = int(len(ent_s)/os.cpu_count()) # get amount of words from lexicon to be allocated to each process
	split_lexicon = [ ent_l[i:i + skip] for i in range(0, len(ent_l), skip)] # split lexicon into N equal parts
	final         = {}

	# run word finding in parallel using Process pool
	with concurrent.futures.ProcessPoolExecutor() as executor:
		results = executor.map(run_find_all, split_lexicon, repeat(ent_s))

		for result in results:
			final.update(result)

	return {key:value for key,value in final.items() if value}





