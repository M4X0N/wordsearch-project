from flask import Flask, request
from logic.run_algorithm import run_algorithm
from logic.classes.lexicon import lexicon
from logic.classes.secret_text import secret_text

import os
from os import walk

api = Flask(__name__)

def allowed_text_file_type(filename):
	ALLOWED_TEXT_FILE_TYPES = ['txt', 'docx']
	return '.' in filename and filename.split('.')[-1] in ALLOWED_TEXT_FILE_TYPES

def allowed_lexicon_file_type(filename):
	ALLOWED_LEXICON_FILE_TYPES = ['txt']
	return '.' in filename and filename.split('.')[-1] in ALLOWED_LEXICON_FILE_TYPES

def valid_min_max_lengths(min, max):
	if not isinstance(min, int) or not isinstance(max, int):
		return False

	return 0 < min and min < max

def validate_file(request_files):
	if 'file' not in request_files:
		return "file is missing", 400

	file = request_files['file']

	if file.filename == "":
		return "file name is empty", 400

	if not allowed_text_file_type(file.filename):
		return "file format isn't supported", 400

	return "good"

# update files to be saved on cloud instead of locally
@api.route("/files/texts", methods=["POST"])
def upload_text():	
	result, status = validate_file(request.files)

	if result != "good":
		return result, status

	file = request.files['file']

	file.save(os.path.join(api.config['TEXTS_FOLDER'], file.filename))
	return "the file was successfully saved", 201

@api.route('/files/texts', methods=["GET"])
def get_text_names():
	texts_dir = 'uploaded-texts'
	filenames = next(walk(texts_dir), (None, None, []))[2]

	return {'filenames': filenames}, 200
	
@api.route("/files/lexicons", methods=["POST"])
def upload_lexicon():	
	result, status = validate_file(request.files)

	if result != "good":
		return result, status

	file = request.files['file']

	file.save(os.path.join(api.config['LEXICONS_FOLDER'], file.filename))
	return "the file was successfully saved", 201

@api.route('/files/lexicons', methods=["GET"])
def get_lexicon_names():
	lexicons_dir = 'uploaded-lexicons'
	filenames = next(walk(lexicons_dir), (None, None, []))[2]

	return {'filenames': filenames}, 200

@api.route('/files/sentences', methods=["GET"])
def get_sentence_file_names():
	sentences_dir = 'output/sentences'
	filenames = next(walk(sentences_dir), (None, None, []))[2]

	return {'filenames': filenames}, 200

@api.route('/run_sentence_finder', methods=["POST"])
def run_sentence_finder():
	text_name       = request.json['text_name']
	lexicon_name    = request.json['lexicon_name']
	min_word_length = request.json['min_word_length']
	max_word_length = request.json['max_word_length']

	if not allowed_text_file_type(text_name) or not allowed_lexicon_file_type(lexicon_name):
		return "file format isn't supported", 400
	if not valid_min_max_lengths(min_word_length, max_word_length):
		return "invalid word length limits entered", 422

	# check if checkpoint file already exists in output. If so, run algorithm from stage 1
	checkpoint_filename = f'{text_name}-{lexicon_name}.txt'
	stage = 1 if os.path.isfile(f'output/found-word-indices/{checkpoint_filename}') else 0

	# open text and lexicon
	text = secret_text(text_name)
	lexicon = lexicon(lexicon_name)

	# restrict lexicon word lengths
	lexicon.set_word_limit(min_word_length, max_word_length)

	run_algorithm(text, lexicon, from_stage=stage, save_results=True)

	return "the file was successfully processed and saved by the server", 201