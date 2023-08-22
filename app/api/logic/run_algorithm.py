import re
import sqlite3

import pandas as pd

# from .classes.lexicon import lexicon
# from .classes.secret_text import secret_text
# from .find_word_indices import run_find_all_MP
# from .get_sentences import run_get_sentence_trees_MP


def run_algorithm(api, text_name, text, lexicon_name,
                  lexicon, letter_offset=2, save_results=True):
    prefix = f"{text_name}-{lexicon_name}-{letter_offset}"
    db = sqlite3.connect(api.config['DATABASE'])

    letters = list("קראטוןםפשדגכעיחלךףזסבהנמצתץ")
    sofit_translation = {
        'ך':    'כ',
        'ם':    'מ',
        'ן':    'נ',
        'ף':    'פ',
        'ץ':    'צ',
    }

    lexicon = lexicon.split(';')
    lexicon = pd.Series(data=lexicon)
    lexicon = lexicon[lexicon.str.contains('|'.join(letters))]
    for sofit, normal in sofit_translation.items():
        lexicon = lexicon.str.replace(sofit, normal)

    df = pd.DataFrame(data=list(text), columns=["char"])
    df['is clean'] = df['char'].isin(letters)
    df.reset_index(inplace=True)
    df.rename(inplace=True, columns={'index': 'source index'})

    df = df[df['is clean']]
    df.drop(inplace=True, columns=["is clean"])
    df.replace(sofit_translation, inplace=True)
    df.reset_index(inplace=True)
# df.reset_index(inplace=True)

    if letter_offset < 0:
        step = -letter_offset
        df = df.iloc[::-1]
        df.reset_index(inplace=True, drop=True)
    else:
        step = letter_offset

    df['clean index'] = df.index

    words = []
    for slice_index in range(step):
        slice = df[(df.index - slice_index) % step == 0]
        slice.reset_index(inplace=True)
        slice_str = slice['char'].str.cat()

        for word in lexicon:
            for match in re.finditer(word, slice_str):
                word_found = {'word': word,
                              'slice': slice_index,
                              'slice start': match.start(),
                              'slice end': match.end(),
                              'clean start': slice.iloc[match.start()]['clean index'],
                              'clean end': slice.iloc[match.end()-1]['clean index'],
                              'source start': slice.iloc[match.start()]['source index'],
                              'source end': slice.iloc[match.end()-1]['source index']
                              }
                words.append(word_found)

    words = pd.DataFrame(data=words)
    print(words)

    sentences_global = []
    for slice_index in range(words.slice.min(), words.slice.max()+1):
        print(f"SLICE {slice_index}")
        slice = words[words['slice'] == slice_index]
        print(slice)
        sentences = []
        for w_index, row in slice.iterrows():
            next_words = words[words['slice start'] == row['slice end']]

            if not next_words.empty:
                for nw_index, word in next_words.iterrows():
                    sentences.append([w_index] + [nw_index])

        print(sentences)
        changed = True
        while changed:
            changed = False
            sentences_new = []
            for s in sentences:
                for sn in sentences:
                    if s[-1] == sn[0]:
                        changed = True
                        sentences_new.append(s+sn[1:])

            if changed:
                sentences = sentences_new
        sentences_global += sentences

    sentence_data = []
    for s in sentences_global:
        sentence = ""
        for wi in s:
            row = words.iloc[wi]
            sentence = ' '.join([sentence, row['word']])

        row_dict = {
            'sentence':     sentence,
            'clean start':  words['clean start'][s[0]],
            'source start': words['source start'][s[0]],
            'offset':       letter_offset
        }
        sentence_data.append(row_dict)

    sentences = pd.DataFrame(data=sentence_data)
    if save_results:
        words.to_sql(name=f"{prefix}-words",
                     con=db,
                     if_exists='replace')
        sentences.to_sql(name=f"{prefix}-sentences",
                         con=db,
                         if_exists='replace')

        # '''
        # execute the main algorithm.
        # text is the text to find sentences from.
        # lexicon is the lexicon from which to find words in the text
        # from_stage is the stage from which the program is about to start:
        #     - stage 0 is from scratch
        #     - stage 1 is after run_find_all_with_MP has been run, with its output used for the next and last stage
        #     - save_results indicates whether the generated sentence trees should be saved into a file
        # '''
        #
        # # "output/found-word-indices/{text.name}-{lexicon.name}.txt" is appended to the cwd the script is run from
        # os.makedirs(api.config['WORDS_FOLDER'], exist_ok=True)
        # found_word_path = os.path.join(
        #     api.config['WORDS_FOLDER'], f"{text.name}-{lexicon.name}-{letter_offset}.txt")
        # if from_stage == 0:
        #
        #     # run word searching algorithm
        #     indices_dict = run_find_all_MP(lexicon.words, text.text)
        #
        #     with open(found_word_path, 'w', encoding='utf8') as output_file:
        #         output_file.write(json.dumps(indices_dict, ensure_ascii=False))
        # elif from_stage == 1:
        #     with open(found_word_path, 'r', encoding='utf8') as input_file:
        #         indices_dict = json.loads(input_file.read())
        #
        # # intermediate stage. The lexicon with word indices is converted to a list,
        # # where each index holds the lengths of every word that starts from the corresponding index in the text
        # word_lengths = [[] for _ in range(len(text.text))]
        #
        # for word, indices in indices_dict.items():
        #     for index in indices:
        #         word_lengths[index].append(len(word))
        #
        # # running sentence extraction from index list
        # all_sentence_trees = run_get_sentence_trees_MP(word_lengths, text.text)
        #
        # if save_results:
        #     # append all sentences to one long list and remove all sentences with less than two words
        #     all_sentences = list(filter(lambda sentence: len(sentence.split(' ')) > 2, reduce(
        #         lambda a, b: a + b, map(lambda tree: tree.get_sentences(), all_sentence_trees), [])))
        #
        #     save_sentences_path = os.path.join(os.path.normpath(
        #         api.config['SENTENCES_FOLDER']), f"{text.name}-{lexicon.name}-{letter_offset}.txt")
        #     os.makedirs(api.config['SENTENCES_FOLDER'], exist_ok=True)
        #
        #     with open(save_sentences_path, 'w', encoding='utf8') as save_file:
        #         save_file.write(json.dumps(all_sentences, ensure_ascii=False))
        #
        print("DEBUG: algorithm finished")
