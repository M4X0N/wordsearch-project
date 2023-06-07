from flask import Flask, request
from flask_cors import CORS
from logic.run_algorithm import run_algorithm
from logic.classes.lexicon import lexicon
from logic.classes.secret_text import secret_text

import os
from os import walk

api = Flask(__name__)
# CORS(api, origins="http://localhost:3000")
# TODO: port number. It's from another container!

def allowed_text_file_type(filename):
    ALLOWED_TEXT_FILE_TYPES = ['txt', 'docx']
    return '.' in filename and filename.split('.')[-1] in ALLOWED_TEXT_FILE_TYPES

def allowed_lexicon_file_type(filename):
    ALLOWED_LEXICON_FILE_TYPES = ['txt']
    return '.' in filename and filename.split('.')[-1] in ALLOWED_LEXICON_FILE_TYPES

def valid_letter_offset(letter_offset):
    if not letter_offset.isnumeric():
        return False

    return int(letter_offset) > 0
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
@api.route("/files/texts", methods=["POST"])
def upload_text():  
    result, status = validate_file(request.files)

    if result != "good":
        return result, status

    file = request.files['file']

    os.makedirs(os.path.dirname('uploaded-texts/'), exist_ok=True)
    
    file.save(os.path.join(api.config['TEXTS_FOLDER'], file.filename))
    ### TODO DEBUG
    print("DEBUGMARKER")
    return "the file was successfully saved", 201

@api.route('/files/texts', methods=["GET"])
def get_text_names():
    texts_dir = 'uploaded-texts'
    filenames = next(walk(texts_dir), (None, None, []))[2]

    return {'fileNames': filenames}, 200
    
@api.route("/files/lexicons", methods=["POST"])
def upload_lexicon():   
    result, status = validate_file(request.files)

    if result != "good":
        return result, status

    file = request.files['file']

    os.makedirs(os.path.dirname('uploaded-lexicons/'), exist_ok=True)

    file.save(os.path.join(api.config['LEXICONS_FOLDER'], file.filename))
    return "the file was successfully saved", 201

@api.route('/files/lexicons', methods=["GET"])
def get_lexicon_names():
    lexicons_dir = 'uploaded-lexicons'
    filenames = next(walk(lexicons_dir), (None, None, []))[2]

    return {'fileNames': filenames}, 200

@api.route('/files/sentences/names', methods=["GET"])
def get_sentence_file_names():
    sentences_dir = 'output/sentences'
    filenames = next(walk(sentences_dir), (None, None, []))[2]

    return {'fileNames': filenames}, 200

@api.route('/files/sentences/<path:filename>', methods=["GET"])
def get_sentence_file(filename):
    if len(filename) == 0:
        return "file name must be non empty", 400

    sentences_dir = os.path.normpath('output/sentences')
    file_path = os.path.join(sentences_dir, filename)

    if not os.path.isfile(file_path):
        return "the specified file doesn't exist", 400

    with open(file_path, 'r') as f:
        return f.read(), 200


@api.route('/sentence-finder', methods=["POST"])
def run_sentence_finder():
    text_name       = request.json['text_name']
    lexicon_name    = request.json['lexicon_name']
    letter_offset   = request.json['letter_offset']
    min_word_length = request.json['min_word_length']
    max_word_length = request.json['max_word_length']

    if not allowed_text_file_type(text_name) or not allowed_lexicon_file_type(lexicon_name):
        return "file format isn't supported", 400
    if not valid_letter_offset(letter_offset):
        return "invalid letter offset", 422
    if not valid_min_max_lengths(min_word_length, max_word_length):
        return "invalid word length limits entered", 422
    
    # open text and lexicon
    text = secret_text(text_name, int(letter_offset))
    lex = lexicon(lexicon_name)

    text_name = text_name.split('.')[0]
    lexicon_name = lexicon_name.split('.')[0]

    # check if checkpoint file already exists in output. If so, run algorithm from stage 1
    checkpoint_filename = f'{text_name}-{lexicon_name}-{letter_offset}.txt'
    stage = 1 if os.path.isfile(f'output/found-word-indices/{checkpoint_filename}') else 0

    # restrict lexicon word lengths
    lex.set_word_limit(int(min_word_length), int(max_word_length))

    run_algorithm(text, lex, letter_offset=int(letter_offset), from_stage=stage, save_results=True)

    return "the file was successfully processed and saved by the server", 201

# healthcheck
@api.route('/', methods=["GET"])
def health_check():
    return('', 204)
