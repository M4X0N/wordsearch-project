#! /usr/bin/python
import re
import sqlite3

import pandas as pd

DB_NAME = "results.db"
TEXT_NAME = "nztest.txt"
# TEXT_NAME = "torah.txt"
TEXT_NAME = "bereshit-36.txt"
DICT_NAME = "testdict.txt"

# STEP = -4
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

words = []
slices = []
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
# print(words.sort_values(by=['source start']))
# words.sort_values(by=['slice start'], inplace=True)
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
        'offset':       offset
    }
    sentence_data.append(row_dict)

sdf = pd.DataFrame(data=sentence_data)
print(sdf)
