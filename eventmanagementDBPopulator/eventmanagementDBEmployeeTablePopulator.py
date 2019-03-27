import pyodbc
import abhilashRandomNameGenModule
import abhilashRandomAddressGenModule
import abhilashMiscRandomFunctionsModule
import abhilashRandomTimeGenModule

def main():
    global cnxn
    server = 'tcp:eventmanagementcseb.database.windows.net' 
    database = 'EventManagement' 
    username = 'abhilash.venky' 
    password = 'Ninju123' 
    cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
    #cursor = cnxn.cursor()
    print('Connection successful!')
    
def populateEmployeeTable():
    cursor = cnxn.cursor()
    randomFName= str(abhilashRandomNameGenModule.randomName());
    randomLName= str(abhilashRandomNameGenModule.randomName());
    randomMobilePhoneNumber = str(int(abhilashMiscRandomFunctionsModule.randomMobilePhoneNumber()/1000));
    randomEmail = randomFName +"_"+ randomLName + "@gmail.com"
    randomAddress = str(abhilashRandomAddressGenModule.randomAddress());
    randomGender = abhilashMiscRandomFunctionsModule.randomGender()
    randomDateofBirth = str(abhilashRandomTimeGenModule.randomDate("1971-1-1T12:00:00", "2009-1-1T11:59:00")[:10])
    randomIncome = abhilashMiscRandomFunctionsModule.randomAnnualIncome()
    if randomGender == 'Male':
        randomBit = 0
    else:
        randomBit = 1
    print('Random Name : ',randomFName,randomLName)
    print('Mob : ',randomMobilePhoneNumber)
    print('Email : ',randomEmail)
    print('Addr : ',randomAddress)
    print('isManager : ',randomBit)
    print('Dob : ',randomDateofBirth)
    print('')
    try:
        cursor.execute("insert into employee(name, dob, mobile, email, address, salary, isManager) values('"+(randomFName+" "+randomLName).title()+"','"+randomDateofBirth+"',"+str(randomMobilePhoneNumber)+",'"+randomEmail+"','"+randomAddress+"',"+str(randomIncome)+","+str(randomBit)+");")
        print("Data Insertion Success! ")   
    except Exception as e:
        print('machan thappu nadanthu pochu,',e)
    cnxn.commit()
    
main()
n=25
for i in range(n):
    populateEmployeeTable()
    print("PROGESS : ",((i+1)/n)*100,"%")
