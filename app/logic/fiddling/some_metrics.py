#tests on extracted data
print(f"total number of sentences: {len(all_sentences)}")
print(f"number of sub sentences in idx 0: {len(all_sentences[0].children)}")
print(f"all possible words at first idx: {[i.data for i in all_sentences[0].children]}")

max_depth_list = [sentence.getDepth() for sentence in all_sentences]
max_depth = max(max_depth_list)
max_depth_index = max_depth_list.index(max_depth)
print(f"max tree depth: {max_depth}")

max_width_list = [get_max_width(tree) for tree in all_sentences]
max_width = max(max_width_list)
print(f"max tree width: {max_width}")