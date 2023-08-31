#! /usr/bin/python
import re
import sqlite3

import pandas as pd

DB_NAME = "results.db"
# TEXT_NAME = "nztest.txt"
TEXT_NAME = "bereshit-36.txt"
# TEXT_NAME = "torah.txt"
DICT_NAME = "hebrew-freq-10000.txt"
# DICT_NAME = "testdict.txt"

# STEP = -4
# STEP = 3
# STEP = -3
STEP = 4


letters = list("קראטוןםפשדגכעיחלךףזסבהנמצתץ")
sofit_translation = {
    'ך':    'כ',
    'ם':    'מ',
    'ן':    'נ',
    'ף':    'פ',
    'ץ':    'צ',
}

db = sqlite3.connect(DB_NAME)
with open(TEXT_NAME) as f:
    full_text = f.read()

with open(DICT_NAME) as f:
    lexicon = f.read()

lexicon = lexicon.split(';')
lexicon = pd.Series(data=lexicon)
lexicon = lexicon[lexicon.str.contains('|'.join(letters))]
for sofit, normal in sofit_translation.items():
    lexicon = lexicon.str.replace(sofit, normal)

df = pd.DataFrame(data=list(full_text), columns=["char"])
df['is clean'] = df['char'].isin(letters)
df.reset_index(inplace=True)
df.rename(inplace=True, columns={'index': 'source index'})


df = df[df['is clean']]
df.drop(inplace=True, columns=["is clean"])
df.replace(sofit_translation, inplace=True)
df.reset_index(inplace=True)
# df.reset_index(inplace=True)

offset = STEP

if offset < 0:
    step = -offset
    df = df.iloc[::-1]
    df.reset_index(inplace=True, drop=True)
else:
    step = offset

df['clean index'] = df.index


def show_progress(prog_dict):
    string = []
    for k, v in prog_dict.items():
        string.append(f"{k}: {v[0]}/{v[1]}")
    string = "; ".join(string)
    print(string, end="\r")


sentences_data = []
for slice_index in range(step):
    words = []
    slice = df[(df.index - slice_index) % step == 0]
    slice.reset_index(inplace=True)
    slice_str = slice['char'].str.cat()

    print(f"DEBUG: slice {slice_index+1}/{abs(offset)}")
    print("searching for words")

    i = 0
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
        show_progress({
            "Slice": (slice_index+1, abs(offset)),
            "Word": (i+1, len(lexicon))
        })
        i += 1
    print()
    words = pd.DataFrame(data=words)
    # print(words)
    if len(words) == 0:
        continue
    words.sort_values(by=['slice start'], inplace=True)

    print("searching for sentences")
    sentences = []
    sentences_finished = []

    def get_next_word_indices(row):
        return words[words['slice start'] == row['slice end']].index.tolist()

    def get_prev_word_indices(row):
        return words[words['slice end'] == row['slice start']].index.tolist()

    words['next word indices'] = words.apply(
        lambda x: get_next_word_indices(x), axis=1)

    words['prev word indices'] = words.apply(
        lambda x: get_prev_word_indices(x), axis=1)

    # print(words)

    # function to get indices of sentence that is ending with given word index
    def get_sentences_indices(word_index):
        # print("getting sentence indices")
        sentence_indices = []
        for s in sentences:
            if s[-1] == word_index:
                sentence_indices.append(sentences.index(s))
        return sentence_indices

    def add_word_to_sentence(sentence_index, word_indices):
        # print('Adding words to sentence')
        original_sentence = sentences.pop(sentence_index)
        for wi in word_indices:
            new_sentence = original_sentence.copy()
            new_sentence.append(wi)
            sentences.append(new_sentence)

    def is_finished(sentence):
        return len(words.loc[sentence[-1]]['next word indices']) == 0

    # Move all sentences that ends with word_index to finished
    def finish_sentences(word_index):
        for s in sentences:
            if s[-1] == word_index:
                sentences_finished.append(
                    sentences.pop(sentences.index(s))
                )

    def clean_sentences():
        for s in sentences:
            if is_finished(s):
                sentences_finished.append(
                    sentences.pop(sentences.index(s))
                )

    i = 0
    # for i in range(len(words)):
    #     row = words.loc[i]
    #     index = row.index
    #     print(row)
    #     exit(0)
    # print(words.to_string())
    for index, row in words.iterrows():
        # If word has prev:
        # print(len(row['prev word indices']))
        # print(len(row['next word indices']))
        if len(row['prev word indices']) > 0:
            # print('Has prev')
            # If word has next: add next index to sentences where it's index is last
            sentence_indices = get_sentences_indices(index)
            if len(row['next word indices']) > 0:
                # print('Has next')
                # print('Sentence indices')
                # print(sentence_indices)
                for si in sentence_indices:
                    add_word_to_sentence(si, row['next word indices'])
            # If word has no next: finish sentences with this index as last and cont.
            else:
                # print("Has no next")
                finish_sentences(sentence_indices)
        # If word has no prev: open new sentence with it's index
        else:
            # print('Has no prev')
            sentence = [index]
            # If word has next: add for every next
            if len(row['next word indices']) > 0:
                # print('Has next')
                sentences.append(sentence)
                sentence_indices = get_sentences_indices(index)
                # print('Sentence indices')
                # print(sentence_indices)
                for si in sentence_indices:
                    add_word_to_sentence(si, row['next word indices'])
            # Else: finish sentence
            else:
                # print('Has no next')
                sentences_finished.append(sentence)
        print("sentences")
        for s in sentences:
            print(s)
            if len(words.loc[s[-1]]['next word indices']) <= 0:
                print("Sentence finished")

        clean_sentences()
        print("After clean sentences")
        for s in sentences:
            print(s)
        print("After clean sentences finished")
        for s in sentences_finished:
            print(s)

        input()
        show_progress({
            "Slice": (slice_index+1, abs(offset)),
            "Word": (i+1, len(words)),
            "S/FS": (len(sentences), len(sentences_finished))
        })
        i += 1
    print()
    print('Sentences finished')
    print(len(sentences_finished))
    # print(sentences_finished)
    print('Sentences')
    print(len(sentences))
    print(sentences[0])
    print(words.loc[sentences[0][-1]])
    print(words.loc[456])
    exit(0)

    for s in sentences:
        print(words.loc[s[-1]])
        input()

    # Converting list of indices to actual sentences
    for s in sentences_finished:
        rows = []
        for index in s:
            rows.append(words.loc[index])
        # print(rows)

        sentence = [x['word'] for x in rows]
        sentence = " ".join(sentence)
        sentence_row = rows[0].to_dict()
        sentence_end = rows[-1].to_dict()

        for key in ['clean start', 'source start']:
            del sentence_end[key]
        for key in ['slice start', 'slice end', 'word',
                    'source end', 'clean end',
                    'next word indices', 'prev word indices']:
            del sentence_row[key]
            del sentence_end[key]
        sentence_row.update(sentence_end)
        sentence_row['sentence'] = sentence
        sentence_row['offset'] = offset
        sentences_data.append(sentence_row)

sentences = pd.DataFrame(data=sentences_data)
print(sentences)

exit(0)

prefix = f"{TEXT_NAME}_{STEP}"
words.drop(columns=['prev word indices', 'next word indices'], inplace=True)
words.to_sql(name=f"{prefix}_words",
             con=db,
             if_exists='replace')
sentences.to_sql(name=f"{prefix}_sentences",
                 con=db,
                 if_exists='replace')

cursor = db.cursor()
cursor.execute("""
SELECT name FROM sqlite_master WHERE type='table';
""")
tables = cursor.fetchall()
tables = [x[0] for x in tables if "sentences" in x[0]]
print(tables)

tablename = tables[0]
df = pd.read_sql(f"SELECT * FROM '{tablename}'",
                 db)

sentences = df['source start'].astype(str).str.cat(df['sentence']).tolist()
print(sentences)
