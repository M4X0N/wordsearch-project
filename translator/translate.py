import re

def clean_text(text):
    # clean characters from text, need to add list of characters to choose from
    # chars_to_remove = [',','.','\'',' ','1','2','3','4','5','6','7','8','9','0','\n']


    filter_regexp = r'[^קראטוןםפשדגכעיחלךףזסבהנמצתץ]'
    sofit_translation = {
            'ך':    'כ',
            'ם':    'מ',
            'ן':    'נ',
            'ף':    'פ',
            'ץ':    'צ',
            }

    text = re.sub(filter_regexp, '', text)
    for sofit, normal in sofit_translation.items():
        text = re.sub(sofit, normal, text)

    return text

letter_dict = {
	'א':   '(',
	'ב':   'B',
	'ג':   'G',
	'ד':   'D',
	'ה':   'H',
	'ו':   'W',
	'ז':   'Z',
	'ח':   'X',
	'ט':   '+',
	'י':   'Y',
	'כ':   'K',
	'ל':   'L',
	'מ':   'M',
	'נ':   'N',
	'ס':  'S',
	'ע':   ')',
	'פ':  'P',
	'צ':   'C',
	'ק':   'Q',
	'ר':   'R',
	'ש':  '$',
	'ת':   'T',
}

inv_dict = {v: k for k, v in letter_dict.items()}
chars_to_remove = [',','.','\'','1','2','3','4','5','6','7','8','9','0']

filename = 'bereshit-36.txt'
output = 'bereshit36_t.txt'

with open(filename, 'r', encoding="utf-8") as file:
    with open(output, 'a') as newfile:
        text = clean_text(file.read())
        newfile.write(text)
