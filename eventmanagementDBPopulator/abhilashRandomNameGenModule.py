import csv
import random

def randomName():
    fread = open('.\\abhilashRandomNameSeed.txt','r')
    line_count_prev = int(fread.read())
    if random.uniform(0,1) < 0.5:
        f = open('.\\resources\\Indian-Female-Names.csv')
    else:
        f = open('.\\resources\\Indian-Male-Names.csv') 
    #print(line_count_prev)
    with f as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count < line_count_prev:
                line_count = line_count + 1
                pass
            else:
                line_count = line_count + 1
                fwrite = open('.\\abhilashRandomNameSeed.txt','w')
                fwrite.write(str(line_count))  
                return(row[0])
        ##print('Processed '+str(line_count)+' lines.')
