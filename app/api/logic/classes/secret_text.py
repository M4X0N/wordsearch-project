import re

class secret_text(): 
    '''
    helper class used to process text into N-skip strings
    '''
    def __init__(self, api, path, letter_offset=2):
        file_extension = path.split('.')[1]
        # "uploaded_texts/{path}" path is appended to the cwd the script is run from
        self.text = getattr(self, f"read_{file_extension}")(f"{api.config['TEXTS_FOLDER']}/{path}")
        self.clean_text()
        self.divide_by_letter_offset(letter_offset)
        self.name = path.split(".")[0]

        print("DEBUG MARKER")
        print(self.text)
        print("DEBUG MARKER")
#       i = 0
#       for char in self.text:
#           print(char,end="")
#           i += 1
#           if i == letter_offset:
#               i = 0
#               print()

    #file readers
    def read_docx(self, file):
        from docx import Document
        return " ".join([para.text for para in Document(file).paragraphs])

    def read_txt(self, file):
        with open(file, 'r', encoding="utf-8") as file:
            return file.read()  

    def clean_text(self):
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

        self.text = re.sub(filter_regexp, '', self.text)
        for sofit, normal in sofit_translation.items():
            self.text = re.sub(sofit, normal, self.text)


    def divide_by_letter_offset(self, letter_offset):
        # prepare text by making N-offset string
        self.text = "".join([self.text[i::letter_offset] for i in range(letter_offset)])

    # seems like an unused helper function
    def check_length(self, second_file, second_file_type):
        torah_length = 447850

        if len(self.text) > torah_length:
            self.text = self.text[:torah_length]
        else:
            second_text = secret_text(second_file, second_file_type, letter_offset = self.letter_offset)
            self.text = self.text + second_file.text
            self.text = self.text[:torah_length]

    def translate(self, eng_to_heb=True):
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

        if eng_to_heb:
            for k,v in letter_dict.items():
                self.text = self.text.replace(v,k)
        else:
            for k,v in letter_dict.items():
                self.text = self.text.replace(k,v)
