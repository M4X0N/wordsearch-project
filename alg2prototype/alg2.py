#! /usr/bin/python
import re
import sqlite3

import pandas as pd

DB_NAME = "results.db"
TEXT_NAME = "nztest.txt"
# TEXT_NAME = "torah.txt"
# TEXT_NAME = "bereshit-36.txt"
DICT_NAME = "testdict.txt"

STEP = -4

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


print(df)
if STEP < 0:
    STEP *= -1
    df = df.iloc[::-1]
    df.reset_index(inplace=True, drop=True)

df['clean index'] = df.index
print(df)

words = []
slices = []
for slice_index in range(STEP):
    slice = df[(df.index - slice_index) % STEP == 0]
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

# sentences = []
# for slice_index in range(words.slice.max()+1):
#     prev_end = None
#     sentence = []
#     slice = words[words['slice'] == slice_index]
#     for index, row in slice.iterrows():
#         print("WORD:")
#         print(row)
#         next_word = slice[slice['slice start'] == row['slice end']]
#         if not next_word.empty:
#             print("NEXT WORD:")
#             print(next_word)
#
# TODO: как мне блин собрать слова в предложения?

print(words)
# print(sentences)
# sentences = pd.DataFrame(data=sentences)
exit(0)
