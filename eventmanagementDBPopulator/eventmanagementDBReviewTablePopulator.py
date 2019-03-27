import pyodbc
import abhilashRandomNameGenModule
import abhilashRandomAddressGenModule
import abhilashMiscRandomFunctionsModule
import abhilashRandomTimeGenModule
import random
def main():
    global cnxn
    server = 'tcp:eventmanagementcseb.database.windows.net' 
    database = 'EventManagement' 
    username = 'abhilash.venky' 
    password = 'Ninju123' 
    cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
    #cursor = cnxn.cursor()
    print('Connection successful!')
    
def populateReviewTable():
    cursor = cnxn.cursor()
    randomEventid = random.randint(10,227)
    randomComment = abhilashMiscRandomFunctionsModule.randomReview()
    randomOverall = random.randint(1,5)
    randomManager = random.randint(1,5)
    randomFood = random.randint(1,5)
    randomEntertainment = random.randint(1,5)
    randomFuturebook = random.randint(1,5)
    if(randomFuturebook==3):
        randomFuturebook=4
    print('EvID : ',randomEventid)
    print('Overall : ',randomOverall)
    print('Manager : ',randomManager)
    print('Food : ',randomFood)
    print('Entertainment : ',randomEntertainment)
    print('FutureBookingPreference : ',randomFuturebook)
    print('Addnl. Comment : ',randomComment)
    print('')
    try:
        cursor.execute("insert into review(eventid,overallexp,managerbehaviour,foodrating,entertainmentrating,futurebookingpreference,additionalcomments) values("+str(randomEventid)+","+str(randomOverall)+","+str(randomManager)+","+str(randomFood)+","+str(randomEntertainment)+","+str(randomFuturebook)+",'"+randomComment+"');")
        print("Data Insertion Success! ")   
    except Exception as e:
        print('machan thappu nadanthu pochu,',e)
    cnxn.commit()
    
main()
n=500
for i in range(n):
    populateReviewTable()
    print("PROGESS : ",((i+1)/n)*100,"%")
