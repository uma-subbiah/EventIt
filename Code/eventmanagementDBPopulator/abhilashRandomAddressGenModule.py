import csv

def randomAddress():
    fread = open('.\\abhilashRandomAddressSeed.txt','r')
    line_count_prev = int(fread.read())
    #print(line_count_prev)
    with open('.\\resources\\Addresses.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count < line_count_prev:
                line_count = line_count + 1
                pass
            else:
                line_count = line_count + 1
                fwrite = open('.\\abhilashRandomAddressSeed.txt','w')
                fwrite.write(str(line_count))  
                return(row[0])
        ##print('Processed '+str(line_count)+' lines.')
