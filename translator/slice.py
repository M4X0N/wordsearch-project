chars_to_remove = ['-',':',';',',','.',' ','\'','\n','1','2','3','4','5','6','7','8','9','0']

filename = 'bereshit-36.txt'
output = 'slice.txt'

with open(filename, 'r') as file:
    oneliner = ""
    for line in file.readlines():
        for char in chars_to_remove:
            line = line.replace(char, '')
        print(line)
        oneliner += line

print("\n\n\n")
print(oneliner)

with open(output, 'a') as newfile:
     newfile.write(oneliner)

slicedline = ""
i = 3
for char in oneliner:
    if i == 4:
        slicedline += char
        i = 1
    i+=1

print("\n\n\n")
print(slicedline)

if "זהבתובע" in slicedline:
    print("YES")
else:
    print("NO")

#   with open(output, 'a') as newfile:
#       old_lines = file.readlines()
#       for line in old_lines:
#           for char in chars_to_remove:
#               line = line.replace(char, '')
#           for k, v in letter_dict.items():
#               line = line.replace(v, k)
#           newfile.write(line)
