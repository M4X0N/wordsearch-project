import os
import sqlite3
from os import walk
from pathlib import Path

import pandas as pd
from docx import Document
from flask import Flask, request
from flask_cors import CORS

from logic.classes.lexicon import lexicon
from logic.run_algorithm import run_algorithm

api = Flask(__name__)
CORS(api)


def allowed_text_file_type(filename):
    ALLOWED_TEXT_FILE_TYPES = ['txt', 'docx']
    return '.' in filename and filename.split('.')[-1] in ALLOWED_TEXT_FILE_TYPES


def allowed_lexicon_file_type(filename):
    ALLOWED_LEXICON_FILE_TYPES = ['txt']
    return '.' in filename and filename.split('.')[-1] in ALLOWED_LEXICON_FILE_TYPES


def valid_letter_offset(letter_offset):
    if not letter_offset.isnumeric():
        return False

    return abs(int(letter_offset)) > 2


def valid_min_max_lengths(min, max):
    if not min.isnumeric() or not max.isnumeric():
        return False

    return 0 < int(min) and int(min) < int(max)


def validate_file(request_files):
    if 'file' not in request_files:
        return "file is missing", 400

    file = request_files['file']

    if file.filename == "":
        return "file name is empty", 400

    if not allowed_text_file_type(file.filename):
        return "file format isn't supported", 400

    return "good", 200

# update files to be saved on cloud instead of locally


@api.route("/api/files/texts", methods=["POST"])
def upload_text():
    print("DEBUG, upload_text")
    result, status = validate_file(request.files)

    if result != "good":
        return result, status

    file = request.files['file']

    os.makedirs(api.config['TEXTS_FOLDER'], exist_ok=True)
    file.save(os.path.join(api.config['TEXTS_FOLDER'], file.filename))
    return "the file was successfully saved", 201


@api.route('/api/files/texts', methods=["GET"])
def get_text_names():
    texts_dir = api.config['TEXTS_FOLDER']
    filenames = next(walk(texts_dir), (None, None, []))[2]

    return {'fileNames': filenames}, 200


@api.route("/api/files/lexicons", methods=["POST"])
def upload_lexicon():
    result, status = validate_file(request.files)

    if result != "good":
        return result, status

    file = request.files['file']

    os.makedirs(api.config['LEXICONS_FOLDER'], exist_ok=True)

    file.save(os.path.join(api.config['LEXICONS_FOLDER'], file.filename))
    return "the file was successfully saved", 201


@api.route('/api/files/lexicons', methods=["GET"])
def get_lexicon_names():
    lexicons_dir = api.config['LEXICONS_FOLDER']
    filenames = next(walk(lexicons_dir), (None, None, []))[2]

    return {'fileNames': filenames}, 200


@api.route('/api/files/sentences/names', methods=["GET"])
def get_sentence_file_names():
    db = sqlite3.connect(api.config['DATABASE'])
    cursor = db.cursor()
    cursor.execute("""
    SELECT name FROM sqlite_master WHERE type='table';
    """)
    tables = cursor.fetchall()
    tables = [x[0] for x in tables if "sentences" in x[0]]

    return {'filenames': tables}, 200

    # sentences_dir = api.config['SENTENCES_FOLDER']
    # filenames = next(walk(sentences_dir), (None, None, []))[2]

    # return {'fileNames': filenames}, 200


@api.route('/api/files/sentences/<path:filename>', methods=["GET"])
def get_sentence_file(filename):
    db = sqlite3.connect(api.config['DATABASE'])
    try:
        df = pd.read_sql(f"SELECT * FROM '{filename}'",
                         db)

    except:
        return "the specified file doesn't exist", 400

    sentences = df['source start'].astype(str).str.cat(df['sentence']).tolist()
    return sentences, 200

    # # TODO: implement as db request
    # if len(filename) == 0:
    #     return "file name must be non empty", 400
    #
    # sentences_dir = os.path.normpath(api.config['SENTENCES_FOLDER'])
    # file_path = os.path.join(sentences_dir, filename)
    #
    # if not os.path.isfile(file_path):
    #     return "the specified file doesn't exist", 400
    #
    # with open(file_path, 'r') as f:
    #     return f.read(), 200


@api.route('/api/sentence-finder', methods=["POST"])
def run_sentence_finder():
    # TODO: remove legacy parts
    text_name = request.json['text_name']
    lexicon_name = request.json['lexicon_name']
    letter_offset = request.json['letter_offset']
    min_word_length = request.json['min_word_length']
    max_word_length = request.json['max_word_length']

    if not allowed_text_file_type(text_name) or not allowed_lexicon_file_type(lexicon_name):
        return "file format isn't supported", 400
    if not valid_letter_offset(letter_offset):
        return "invalid letter offset", 422
    if not valid_min_max_lengths(min_word_length, max_word_length):
        return "invalid word length limits entered", 422

    # open text and lexicon

    # CRUTCHY WAY TO REPAIR
    path_text = Path(api.comfig['TEXTS_FOLDER'])
    path_text.joinpath(text_name)
    path_lexicon = Path(api.comfig['LEXICONS_FOLDER'])
    path_lexicon.joinpath(lexicon_name)

    with open(path_text) as f:
        if path_text.suffix == '.docx':
            text = " ".join([para.text for para in Document(f).paragraphs])
        else:
            text = f.read()

    with open(path_lexicon) as f:
        lex = f.read()

    lex = lexicon(api, lexicon_name)

    # restrict lexicon word lengths
    lex.set_word_limit(int(min_word_length), int(max_word_length))

    run_algorithm(api, text_name, text, lexicon_name, lex,
                  letter_offset=int(letter_offset), save_results=True)

    return "the file was successfully processed and saved by the server", 201
