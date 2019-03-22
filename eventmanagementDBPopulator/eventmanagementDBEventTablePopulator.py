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
    
def populateEventTable():
    cursor = cnxn.cursor()
    randomCategory = abhilashMiscRandomFunctionsModule.randomEventCategory()
    randomFName= str(abhilashRandomNameGenModule.randomName());
    randomLName= str(abhilashRandomNameGenModule.randomName());
    randomEmail = randomFName +"_"+ randomLName + "@gmail.com"
    randomEmpid = random.randint(10,56)
    randomUserid = random.randint(10,682)
    randomAddress = str(abhilashRandomAddressGenModule.randomAddress());
    randomDateofEvent = str(abhilashRandomTimeGenModule.randomDate("1971-1-1T12:00:00", "2009-1-1T11:59:00")[:10])
    randomBudget = abhilashMiscRandomFunctionsModule.randomAnnualIncome()
    isCancelled = abhilashMiscRandomFunctionsModule.ninetyninepercent0()
    print('Category : ',randomCategory)
    print('EmpID : ',randomEmpid)
    print('UserID : ',randomUserid)
    print('Email : ',randomEmail)
    print('Location : ',randomAddress)
    print('isCancelled : ',isCancelled)
    print('budget : ',randomBudget)
    print('DoE : ',randomDateofEvent)
    print('')
    try:
        cursor.execute("insert into event(category,empid,userid,eventlocation,budget,date,email,cancelled) values('"+randomCategory+"',"+str(randomEmpid)+","+str(randomUserid)+",'"+randomAddress+"',"+str(randomBudget)+",'"+randomDateofEvent+"','"+randomEmail+"',"+str(isCancelled)+");")
        print("Data Insertion Success! ")   
    except Exception as e:
        print('machan thappu nadanthu pochu,',e)
    cnxn.commit()
    
main()
n=150
for i in range(n):
    populateEventTable()
    print("PROGESS : ",((i+1)/n)*100,"%")
