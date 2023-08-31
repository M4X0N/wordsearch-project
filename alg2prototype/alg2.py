#! /usr/bin/python
import re
import sqlite3

import pandas as pd

DB_NAME = "results.db"
# TEXT_NAME = "nztest.txt"
# TEXT_NAME = "bereshit-36.txt"
TEXT_NAME = "torah.txt"
# DICT_NAME = "hebrew-freq-10000.txt"
DICT_NAME = "testdict.txt"

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

    words['prev word indices'] = words.apply(
        lambda x: get_prev_word_indices(x), axis=1)

    words['next word indices'] = words.apply(
        lambda x: get_next_word_indices(x), axis=1)

    words['prev count'] = words.apply(
        lambda x: len(x['prev word indices']), axis=1)
    words['next count'] = words.apply(
        lambda x: len(x['next word indices']), axis=1)
    words_backup = words.copy()

    single_words = words[words['next count'] == 0]
    single_words = single_words[single_words['prev count'] == 0]
    sentences_finished.append(single_words.index.to_list())
    words.drop(inplace=True, index=single_words.index)

    starts = words[words['prev count'] == 0]
    words.drop(inplace=True, index=starts.index)
    ends = words[words['next count'] == 0]
    words.drop(inplace=True, index=ends.index)

    for index, row in starts.iterrows():
        isin = ends.index.isin(row['next word indices'])
        if isin.any():
            for end_index in ends[isin].index:
                # print(f"Sentence finished {index} w/ index {end_index}")
                sentences_finished.append([index, end_index])

        isin = words.index.isin(row['next word indices'])
        if isin.any():
            for next_index in words[isin].index:
                # print(f"Sentence appended {index} w/ index {next_index}")
                sentences.append([index, next_index])
        show_progress({
            "Slice": (slice_index+1, abs(offset)),
            "Finished/Sentences": (len(sentences_finished), len(sentences))
        })

    while len(sentences) > 0:
        s = sentences.pop()
        if not words.index.isin([s[-1]]).any():
            sentences_finished.append(s)
            continue
        row = words.loc[s[-1]]

        isin = ends.index.isin(row['next word indices'])
        if isin.any():
            for end_index in ends[isin].index:
                # print(f"Sentence finished {s} w/ index {end_index}")
                s.append(end_index)
                sentences_finished.append(s)

        isin = words.index.isin(row['next word indices'])
        if isin.any():
            for next_index in words[isin].index:
                # print(f"Sentence appended {s} w/ index {next_index}")
                s.append(next_index)
                sentences.append(s)
        show_progress({
            "Slice": (slice_index+1, abs(offset)),
            "Sentences/Finished": (len(sentences), len(sentences_finished))
        })

    print()
    # Converting list of indices to actual sentences
    words = words_backup
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
                    'prev count', 'next count',
                    # 'source end', 'clean end',
                    'next word indices', 'prev word indices']:
            del sentence_row[key]
            del sentence_end[key]
        sentence_row.update(sentence_end)
        sentence_row['sentence'] = sentence
        sentence_row['offset'] = offset
        sentences_data.append(sentence_row)

sentences = pd.DataFrame(data=sentences_data)
sentences.drop_duplicates(inplace=True)
print(sentences)

prefix = f"{TEXT_NAME}={STEP}"
words.drop(columns=['prev word indices', 'next word indices'], inplace=True)
words.to_sql(name=f"{prefix}=words",
             con=db,
             if_exists='replace')
sentences.to_sql(name=f"{prefix}=sentences",
                 con=db,
                 if_exists='replace')

cursor = db.cursor()
cursor.execute("""
SELECT name FROM sqlite_master WHERE type='table';
""")
tables = cursor.fetchall()
tables = [x[0] for x in tables if "sentences" in x[0]]

tablename = tables[0]
df = pd.read_sql(f"SELECT * FROM '{tablename}'",
                 db)

sentences = df['source start'].astype(str).str.cat(df['sentence']).tolist()
