from examinetext import ExamineText

torah = ExamineText('../texts/torah.txt', 'txt')
torah.translate()
het = ExamineText('../texts/het1.docx', 'docx')

print(torah.text[:1000])