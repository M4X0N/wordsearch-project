class sentence_tree():
    '''
    used to represent sentences as trees, where each node is a word which is a part of a sentence.
    Multiple sentences can branch out from the same node (word)
    '''
    def __init__(self, data, root=False):
    	self.root = root # currently unused, might be deleted later
    	self.data = data
    	self.children = []

    def get_depth(self):
        '''
        get tree's depth
        '''
        if not self.children:
            return 0

        return max([i.get_depth() for i in self.children]) + 1

    def print_tree(self, indent=0):
        print((' '*indent) + str(self.data))
        if self.children:
            for i in self.children:
                i.print_tree(indent+1)

    def get_max_width(self):
        '''
        get the level beneath root with the maximum amount of nodes
        '''
        maxWidth = 0
        h = self.root.get_depth()

        # Get width of each level and compare the
        # width with maximum width so far
        for i in range(1, h+1):
            width = get_width(root, i)
            if (width > maxWidth):
                maxWidth = width
        return maxWidth

    def get_sentences(self, current_sentence=""):
        '''
        get all possible sentences stored in a tree as a list
        '''
        sentences = []

        if not self.children:
            current_sentence = current_sentence + " " + self.data
            return current_sentence.lstrip()
            
        if not self.root:
            current_sentence = current_sentence + " " + self.data
            current_sentence = current_sentence.lstrip()

        for child in self.children:
            results = child.get_sentences(current_sentence)

            if isinstance(results, str):
                sentences.append(results)
            else:
                for sentence in results:
                    sentences.append(sentence)
            
        return sentences

def get_width(self, level):
    '''
    get amount of nodes n-levels below root
    '''
    if not root.children:
        return 0
    if level == 1:
        return 1
    elif level > 1:
        return sum([get_width(child, level-1) for child in root.children])