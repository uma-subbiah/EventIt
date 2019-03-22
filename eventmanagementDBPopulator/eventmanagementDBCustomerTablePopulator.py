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
    
def populateCustomerTable():
    cursor = cnxn.cursor()
    randomFName= str(abhilashRandomNameGenModule.randomName());
    randomLName= str(abhilashRandomNameGenModule.randomName());
    randomMobilePhoneNumber = str(abhilashMiscRandomFunctionsModule.randomMobilePhoneNumber());
    randomEmail = randomFName + randomLName + "@gmail.com"
    randomPAddress = str(abhilashRandomAddressGenModule.randomAddress());
    randomOAddress = str(abhilashRandomAddressGenModule.randomAddress());
    randomTelephoneNumber = str(abhilashMiscRandomFunctionsModule.randomTelephoneNumber());
    randomUsername = randomFName+"."+randomLName
    randomPassword = randomFName[len(randomFName)-3:len(randomFName)]+randomLName[len(randomLName)-3:len(randomLName)]
    randomGender = abhilashMiscRandomFunctionsModule.randomGender()
    randomDateofBirth = str(abhilashRandomTimeGenModule.randomDate("1971-1-1T12:00:00", "2009-1-1T11:59:00"))
    print('Random Name : ',randomFName,randomLName)
    print('Mob : ',randomMobilePhoneNumber)
    print('Email : ',randomEmail)
    print('Paddr : ',randomPAddress)
    print('Oaddr : ',randomOAddress)
    print('Tel : ',randomTelephoneNumber)
    print('username : ',randomUsername)
    print('password : ',randomPassword)
    print('gender : ',randomGender)
    print('dob : ',randomDateofBirth)
    print('')
    try:
        cursor.execute("insert into customer(fname, lname, mobile, email, paddr, oaddr, telephone,username, password, gender,dob) values('"+randomFName.title()+"','"+randomLName.title()+"','"+randomMobilePhoneNumber+"','"+randomEmail+"','"+randomPAddress+"','"+randomOAddress+"','"+randomTelephoneNumber+"','"+randomUsername+"','"+randomPassword+"','"+randomGender+"','"+randomDateofBirth+"');")
    except Exception as e:
        print('machan thappu nadanthu pochu,',e)
    cnxn.commit()
    print("Data Insertion Success! ")
main()
n=400
for i in range(n):
    populateCustomerTable()
    print("PROGESS : ",((i+1)/n)*100,"%")
