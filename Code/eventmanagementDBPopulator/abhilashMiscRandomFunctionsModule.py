import random
import pyodbc
def randomReview():
    x = random.randint(1,8)
    if(x==1):
        x = random.randint(1,10)
        if(x==1):
            return "Not satisfied"
        elif(x==2):
            return "Bad Event"
        elif(x==3):
            return "Could be more organized"
        elif(x==4):
            return "Staff weren't user friendly"
        elif(x==5):
            return "Disappointing. Please give value service for the money you took"
        elif(x==6):
            return "Horrible Services!"
        elif(x==7):
            return "Mostly it was great, but I felt the decorations could be better."
        elif(x==8):
            return "Please improve your entertainment methods. Quite lame, honestly."
        elif(x==9):
            return "Mostly happy, but a lil' annoyed cuz the event manager yelled at my kid."
        else:
            return "Do you know how to conduct an event at all!? It felt like freaking hell!"
    else:
        x = random.randint(1,10)
        if(x==1):
            return "An absolutely brilliant event"
        elif(x==2):
            return "Loved it. Thanks to the event manager."
        elif(x==3):
            return "Excellent "
        elif(x==4):
            return "A really good party. Thanks."
        elif(x==5):
            return "Loved the food and entertainment."
        elif(x==6):
            return "Music band was the highlight. Loved the event, thanks."
        elif(x==7):
            return "Flawless it was! Quick response from team EventIt on call. Thanks guys!"
        elif(x==8):
            return "A moderately good event. Keep it up."
        elif(x==9):
            return "Apart from the yelling event manager, the event was great!"
        else:
            return "Nice decorations, friendly staff, and an extremely amazing band."
def randomCaste():
    x = random.randint(1,10)
    if(x<=2):
        return "A"
    elif(x<=4):
        return "B"
    elif(x<=6):
        return "C"
    elif(x<=8):
        return "D"
    else:
        return "E"
def ninetyninepercent0():
    if random.randint(1,100) == 100:
        return 1
    else:
        return 0
def randomOccupation():
    x = random.randint(1,20)
    if(x<=8):
        return "Homemaker"
    elif(x<=10):
        return "Engineer"
    elif(x<=11):
        return "Architect"
    elif(x<=12):
        return "Teacher"
    elif(x<=13):
        return "Doctor"
    elif(x<=14):
        return "Writer"
    elif(x<=17):
        return "Farmer"
    elif(x<=18):
        return "Business"
    elif(x<=19):
        return "Model"
    else:
        return "Actress"
def randomEventCategory():
    x = random.randint(1,10)
    if(x<=2):
        return "Marriage"
    elif(x<=3):
        return "House-Warming Ceremony"
    elif(x<=4):
        return "Birthday Party"
    elif(x<=5):
        return "Festival Celebration"
    elif(x<=6):
        return "Wedding Anniversary"
    elif(x<=7):
        return "Farewell Party"
    elif(x<=8):
        return "Tea Party"
    elif(x<=9):
        return "Concert"
    else:
        return "Welcome Party"

def randomMobilePhoneNumber():
    x=random.randint(1,3)
    if(x==1):
        return 9000000000+random.randint(99999999,999999999)    
    elif(x==2):
        return 8000000000+random.randint(99999999,999999999)
    else:
        return 7000000000+random.randint(99999999,999999999)
def randomTelephoneNumber():
    return 2000000+random.randint(99999,999999)
def randomAnnualIncome():
    x=random.randint(1,10)
    if(x==1):
        return 30000
    elif(x==2):
        return 100000
    elif(x==3):
        return 300000
    elif(x<=5):
        return 650000
    elif(x==6):
        return 700000
    elif(x==7):
        return 845000
    elif(x==8):
        return 1200000
    elif(x==9):
        return 2175000
    else:
        return 450000
def deliveries():
    x=random.randint(1,10)
    if(x==1):
        return 3
    elif(x<=4):
        return 2
    else:
        return 1
def randomInfants():
    x=random.randint(1,10)
    if(x==1):
        return 3
    elif(x<=5):
        return 2
    else:
        return 1
def randomDoctor():
    x=['1','5','6','8','9','10','12','13']
    k=random.randint(0,7)
    return x[k]
def nextPatient():
    server = 'tcp:infantmortality.database.windows.net' 
    database = 'infantmortality' 
    username = 'gmdhuruva' 
    password = 'Dbms!@#$%' 
    cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
    cursor = cnxn.cursor()
    cursor.execute("select max(patientid) from delivery;") 
    row = cursor.fetchone() 
    if(row):
        return str(int(row[0])+1)
def nextDelivery():
    server = 'tcp:infantmortality.database.windows.net' 
    database = 'infantmortality' 
    username = 'gmdhuruva' 
    password = 'Dbms!@#$%' 
    cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
    cursor = cnxn.cursor()
    cursor.execute("select max(deliveryid) from delivery;") 
    row = cursor.fetchone() 
    if(row):
        return str(int(row[0])+1)
def randomBirthCertificate():
    return random.randint(1000000,9999999)
def randomGender():
    if(random.randint(0,1)==0):
        return 'Female'
    else:
        return 'Male'
def randomVaccStatus():
    return random.randint(1,7)
def randomKill():
    x=random.randint(1,100)
    if(x<=10):
        return 'yes'
    else:
        return 'no'
def randomKillCause():
    x=random.randint(1,10)
    if(x==1):
        return 'Jaundice'
    elif(x==2):
        return 'Typhoid'
    elif(x==3):
        return 'Tuberculosis'
    elif(x<=5):
        return 'Pneumonia'
    elif(x==6):
        return 'Diarrheal Disease'
    elif(x==7):
        return 'Encephalopathy'
    elif(x==8):
        return 'Low Birth Weight'
    elif(x==9):
        return 'Birth Complication'
    else:
        return 'Accident'
#print('inserting delivery data for partient ID : '+nextPatient()+'delivery ID : '+nextDelivery())
