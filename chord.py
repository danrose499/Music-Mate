key = input("Select the key you want to play in: ")

keyC  = [" C", " A", " F", " D", " G", " E"]
keyDb = ["Db", "Bb", "Gb", "Eb", "Ab", " F"]
keyD  = [" D", " B", " G", " E", " A", "Gb"]
keyEb = ["Eb", " C", "Ab", " F", "Bb", " G"]
keyE  = [" E", "C#", " A", "Gb", " B", "G#"]
keyF  = [" F", " D", "Bb", " G", " C", " A"]
keyGb = ["Gb", "Eb", " B", "G#", "Db", "Bb"]
keyG  = [" G", " E", " C", " A", " D", " B"]
keyAb = ["Ab", " F", "Db", "Bb", "Eb", " C"]
keyA  = [" A", "Gb", " D", " B", " E", "Db"]
keyBb = ["Bb", " G", "Eb", " C", " F", " D"]
keyB  = [" B", "G#", " E", "Db", "Gb", "Eb"]

keyList = [keyC, keyDb, keyD, keyEb, keyE, keyF, keyGb, keyG, keyAb, keyA, keyBb, keyB]

keyDict = {
    "C" : 0, 
    "C#": 1,  "Db": 1, 
    "D" : 2,
    "D#": 3,  "Eb": 3,
    "E" : 4,
    "F" : 5,
    "F#": 6,  "Gb": 6,
    "G" : 7,
    "G#": 8,  "Ab": 8,
    "A" : 9,
    "A#": 10, "Bb": 10,
    "B" : 11
}
keyNum = keyDict[key]
main_keys = keyList[keyNum]
main_keys_formatted = [(main_keys[0]), (main_keys[1]+"m"), (main_keys[2]), (main_keys[3]+"m"), (main_keys[4]), (main_keys[5]+"m")]

sd_keys = keyList[(keyNum+7)%12]
sd_keys_formatted = [(sd_keys[0]+"7"), (sd_keys[1]+"7"), (sd_keys[2]+"7"), (sd_keys[3]+"7"), (sd_keys[4]+"7"), (sd_keys[5]+"7")]

mi_keys = keyList[(keyNum+3)%12]
mi_keys_formatted = [(mi_keys[0]), (mi_keys[2]), (mi_keys[3]+"m"), (mi_keys[4])]

print("Main keys:")
print(main_keys_formatted)

print("Secondary Dominant keys:")
print(sd_keys_formatted)

print("Modal Interchange keys:")
print(main_keys_formatted)

#make_string = “ “.join(list)
