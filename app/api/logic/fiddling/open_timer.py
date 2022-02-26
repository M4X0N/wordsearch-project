from more_itertools import sliced
from datetime import datetime
import file_helpers

file_list = ["../lexicons/dictionary2.txt", "../texts/het1.docx"]
start_time = datetime.now()

dict1 = file_helpers.read_text(file_list[0]).split(";")
file1 = file_helpers.read_docx(file_list[1])

print(datetime.now()-start_time) 
print(min([len(w) for w in dict1]))

