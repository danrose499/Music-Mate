# A list of the main chords for each key (major/minor left out)
keyC  = ["C" , "A" , "F" , "D" , "G" , "E" ]
keyDb = ["Db", "Bb", "Gb", "Eb", "Ab", "F" ]
keyD  = ["D" , "B" , "G" , "E" , "A" , "Gb"]
keyEb = ["Eb", "C" , "Ab", "F" , "Bb", "G" ]
keyE  = ["E" , "C#", "A" , "Gb", "B" , "G#"]
keyF  = ["F" , "D" , "Bb", "G" , "C" , "A" ]
keyGb = ["Gb", "Eb", "B" , "G#", "Db", "Bb"]
keyG  = ["G" , "E" , "C" , "A" , "D" , "B" ]
keyAb = ["Ab", "F" , "Db", "Bb", "Eb", "C" ]
keyA  = ["A" , "Gb", "D" , "B" , "E" , "Db"]
keyBb = ["Bb", "G" , "Eb", "C" , "F" , "D" ]
keyB  = ["B" , "G#", "E" , "Db", "Gb", "Eb"]

# A list of each of the 12 notes
key_list = [keyC, keyDb, keyD, keyEb, keyE, keyF, keyGb, keyG, keyAb, keyA, keyBb, keyB]

# A dictionary to map user input to an index for keyList
key_dict = {
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

# Obtain valid input from user
key = input("Select the key you want to play in: ")
while(key not in key_dict.keys()):
    key = input("\nError: That is not a valid key!\nSelect the key you want to play in: ")

keyNum = key_dict[key]

# Main Keys #
main_chords = key_list[keyNum]
main_chords_formatted = [(main_chords[0]), (main_chords[1]+"m"), (main_chords[2]), (main_chords[3]+"m"), (main_chords[4]), (main_chords[5]+"m")]

for i in range(6):
    main_chords_formatted[i] = main_chords_formatted[i].ljust(3,' ')

main_chords_string = " ".join(main_chords_formatted)

# Secondary Dominant Keys #
sd_chords = key_list[(keyNum+7)%12]
sd_chords_formatted = [(sd_chords[0]+"7"), (sd_chords[1]+"7"), (sd_chords[2]+"7"), (sd_chords[3]+"7"), (sd_chords[4]+"7"), (sd_chords[5]+"7")]

for i in range(6):
    sd_chords_formatted[i] = sd_chords_formatted[i].ljust(3, ' ')

sd_chords_string = " ".join(sd_chords_formatted)

# Modal Interchange Keys #
mi_chords = key_list[(keyNum+3)%12]
mi_chords_formatted = [(mi_chords[0]), ("  "), (mi_chords[2]), (mi_chords[3]+"m"), (mi_chords[4])]

for i in range(5):
    mi_chords_formatted[i] = mi_chords_formatted[i].ljust(3, ' ')

mi_chords_string = " ".join(mi_chords_formatted)

# Printing
print("\n")
print("Secondary Dominant chords:", sd_chords_string, " } Don't Mix Chords! Go down (follow arrows)")
print("                           |   |   |   |   |   |")
print("                           V   V   V   V   V   V")
print("Start here -> Main chords:", main_chords_string, " } Mix Chords or go up or down to any chord")
print("                           ^       ^       ^    ")
print("                           V       V       V    ")
print("Modal Interchange chords: ", mi_chords_string, "     } Mix chords or up to any of the three chords")
print()

# A Dictionary of Chord Voicings for Ukulele:
ukulele_chord_dict = {
    "C"  : "0003", "Cm" : "0333", "C7" : "0001",
    "Db" : "1114", "Dbm": "1444", "Db7": "1112",
    "D"  : "2220", "Dm" : "2210", "D7" : "2020",
    "Eb" : "3331", "Ebm": "3321", "Eb7": "3334",
    "E"  : "4442", "Em" : "0321", "E7" : "1202",
    "F"  : "2010", "Fm" : "1013", "F7" : "2310",
    "Gb" : "3121", "Gbm": "2120", "Gb7": "3424",
    "G"  : "0232", "Gm" : "0231", "G7" : "0212",
    "Ab" : "5343", "Abm": "1342", "Ab7": "1323",
    "A"  : "2100", "Am" : "2000", "A7" : "0100",
    "Bb" : "3211", "Bbm": "3111", "Bb7": "1211",
    "B"  : "4322", "Bm" : "4222", "B7" : "2322"
}

# print(ukulele_chord_dict["Ab7"])
print("Printing ukulele chord voicingins for selected key: " + key)
sd_chords_ukulele_voicing = sd_chords[0] + "7 = " + ukulele_chord_dict[sd_chords[0]+"7"] + ", " + sd_chords[1]+"7 = " + ukulele_chord_dict[sd_chords[1]+"7"] + ", "  + sd_chords[2]+"7 = " + ukulele_chord_dict[sd_chords[2]+"7"] + ", "  + sd_chords[3]+"7 = " + ukulele_chord_dict[sd_chords[3]+"7"] + ", "  + sd_chords[4]+"7 = " + ukulele_chord_dict[sd_chords[4]+"7"] + ", "  + sd_chords[5]+"7 = " + ukulele_chord_dict[sd_chords[5]+"7"]
print("\tSecondary Dominant Chords: " + sd_chords_ukulele_voicing)

main_chords_ukulele_voicing = main_chords[0] + " = " + ukulele_chord_dict[main_chords[0]] + ", " + main_chords[1]+"m = " + ukulele_chord_dict[main_chords[1]+"m"] + ", " + main_chords[2] + " = " + ukulele_chord_dict[main_chords[2]] + ", " + main_chords[3]+"m = " + ukulele_chord_dict[main_chords[3]+"m"] + ", " + main_chords[4] + " = " + ukulele_chord_dict[main_chords[4]] + ", " + main_chords[5]+"m = " + ukulele_chord_dict[main_chords[5]+"m"]
print("\tMain Chords: " + main_chords_ukulele_voicing)

mi_chords_ukulele_voicing = mi_chords[0] + " = " + ukulele_chord_dict[mi_chords[0]] + ", " + mi_chords[2] + " = " + ukulele_chord_dict[mi_chords[2]] + ", " + mi_chords[3]+"m" + " = " + ukulele_chord_dict[mi_chords[3]+"m"] + ", " + mi_chords[4] + " = " + ukulele_chord_dict[mi_chords[4]]
print("\tModal Interchange Chords: " + mi_chords_ukulele_voicing)
