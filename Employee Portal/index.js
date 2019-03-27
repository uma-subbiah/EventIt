//
var alert = require('alert-node'); 
const express = require('express');
const app = express();
var http = require('http');
var url = require('url');
var fs = require('fs');
var sql = require('mssql');
var bodyParser = require('body-parser');
var formidable=require('formidable');
var config = {
	user:'abhilash.venky',
	password: 'Ninju123',
	server: 'eventmanagementcseb.database.windows.net',
	database: 'EventManagement',
	options: {
	  encrypt: true
	 } 
};
function parseCookies(request) {
    var list = {},
        rc = request.headers.cookie;
        rc && rc.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    
    return list;
}
http.createServer(function (req, res) 
{
	var cookies=parseCookies(req),u,info;
	if(cookies["login"]!=null && cookies["login"]!="0")
	{
		info=cookies["login"].split("~");
		u=(info[0]=="u");
	}
	else
	{
		res.write('<head><meta http-equiv="refresh" content="0; URL=http://eventit.com:8080/login" /></head>');
		return res.end();
	}
	var q = url.parse(req.url, true);
	var filename = "./pages/static" + q.pathname;
	if (filename[filename.length - 1] == '/') {
        filename += 'index.html';
        console.log("LOG: Employee Landing page requested by a client... ");
    }
	if(filename[filename.length-1]=='c')
		filename+='enter_caterer.html';
	else if(filename[filename.length-1]=='m')
		filename+='enter_media_partner.html';
	//console.log(q.pathname);
	if(q.pathname=='/employeelanding')
	{
		var st,newdiv;
		fs.readFile('./pages/static/employee_landing_page.html', function(err, data) 
		{
			if (err) 
			{
				console.log(filename)
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("Internal Error.");
			}	
			st = data.toString(); 
  		});
		fs.readFile('./eventDIV.txt', function(err, data) 
		{
			if (err) 
			{
				console.log(filename)
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("Internal Error.");
			}	
			newdiv = data.toString(); 
  		});
			sql.connect(config, function (err){
				var request = new sql.Request();
				
				console.log('${req.body.cname}');
				request.query("select eventID, empID, userId, Category, eventLocation, name, d.fname as cFName, d.lname as cLName from event e, employee c, customer d where e.empID = c.ID and d.ID=userID and empID="+info[1]+";",function(err, result){
					if(err)
					{
						console.log("Query Error : "+err)
						sql.close();
						return;
					}
					st = st.replace('employee!',result['recordset'][0]['name']+'!')
					var thisdiv;
					console.log("Query Success.")
					for (i in result['recordset']) {
						console.log(result['recordset'][i]);
						thisdiv = newdiv
						thisdiv = thisdiv.replace('@@eventid',result['recordset'][i]['eventID'])
						thisdiv = thisdiv.replace('@@eventid',result['recordset'][i]['eventID'])
						thisdiv = thisdiv.replace('@@eventid',result['recordset'][i]['eventID'])
						thisdiv = thisdiv.replace('@@eventCategory',result['recordset'][i]['Category'])
						thisdiv = thisdiv.replace('@@eventPlace',result['recordset'][i]['eventLocation'])
						thisdiv = thisdiv.replace('@@cName',result['recordset'][i]['cFName']+' '+result['recordset'][i]['cLName'])
						st = st.replace('<!--@@ADDdiv-->',thisdiv)
					}
					res.write(st);
					res.end()
					sql.close();
				});
			});
	}
	else if(q.pathname=='/submit')
	{
		console.log("Hi");
		var form = new formidable.IncomingForm();
		form.parse(req,function(err,fields,files) 
		{
			sql.connect(config, function (err){
				var request = new sql.Request();
				
				request.input('cname',fields['cname']);
				request.input('lname',fields['lname']);
				request.input('mobile',fields['mobile']);
				request.input('email',fields['email']);
				request.input('oaddress',fields['oaddress']);
				request.input('phone',fields['phone']);
				request.input('service',fields['service']);
				request.input('city',fields['city']);
				console.log('${req.body.cname}');
				request.query("insert into service_provider(name,contact_person,mobile,email,oaddress,phone,service,city) values(@cname,@lname,@mobile,@email,@oaddress,@phone,@service,@city);",function(err, result){
					console.log(result);
					console.log(fields['cname']+"\n"+err);
					sql.close();
					

					alert('Caterer details entered successfully')
				});
			});
		});
		var redirect = './pages/static/entered.html';
		fs.readFile(redirect, function(err, data) 
		{
			if (err) 
			{
				console.log(filename)
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("404 Not Found!!!!!!!!");
			}	 
			else
    		{
				res.writeHead(200, {'Content-Type': 'text/html'});
			}
    		res.write(data);
    		return res.end();
  		});
	}
	else if(q.pathname=='/eventstats')
	{
		var st;
		fs.readFile('./pages/static/eventStatistics/index.html', function(err, data) 
		{
			if (err) 
			{
				console.log(filename)
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("404 Not Found!!!!!!!!");
			}	 
			else
    		{
				st = data.toString();
			}
		  });
		var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            sql.connect(config, function(err) {
				var request = new sql.Request();
				var eventid = fields['eventid']
				console.log("LOG Ev ID ",eventid)
                request.query("select category,e.empid as id,eventlocation,name from event e ,employee m where e.empID=m.ID and eventID="+eventid+";", function(err, result) {
                    if (err){
						console.log("error",err)
						return
					}
					console.log("LOG: Event Query Success");
					try{
						for (i in result['recordset']) {
							//console.log(result['recordset'][i]);
						}
						var category = result["recordset"][0]["category"];
						var location = result["recordset"][0]["eventlocation"]
						var managerid = result["recordset"][0]["id"]
						var managername = result["recordset"][0]["name"]
						st = st.replace('@@eventID',fields['eventid'])
						st = st.replace('@@currentEvent','eventID-'+fields['eventid'])
						st = st.replace('@@eventCAT',category);
						st = st.replace('@@CATEGORY',category);
						st = st.replace('@@eventLOCATION',location);
						st = st.replace('@@eventMANAGER',managername);
						st = st.replace('@@eventManagerID','EmpID: '+managerid);
					}
					catch (e)
					{
						
						console.log('LOG: Error in processing result.'+e.toString())
					}
                    //console.log(fields['fname'] + " " + fields['lname'] + "\n" + err);
				});
				request.query("select eventid,avg(overallExp) as overall,avg(managerbehaviour) as manager,avg(foodrating) as food,avg(entertainmentRating) as entertainment,avg(futureBookingPreference) as future from review group by eventid having eventid="+eventid+";", function(err, result) {
                    if (err){
						console.log("error")
					}
					console.log("LOG: Event Query Success");
					try{
						for (i in result['recordset']) {
							//console.log(result['recordset'][i]);
						}
						overallprog = parseFloat(result["recordset"][0]["overall"])*20;
						managerprog = parseFloat(result["recordset"][0]["manager"])*20;
						foodprog = parseFloat(result["recordset"][0]["food"])*20;
						entertainmentprog = parseFloat(result["recordset"][0]["entertainment"])*20;
						futureprog = parseFloat(result["recordset"][0]["future"])*20;
						st = st.replace('@@overallval',result["recordset"][0]["overall"]);
						st = st.replace('@@managerval',result["recordset"][0]["manager"]);
						st = st.replace('@@foodval',result["recordset"][0]["food"]);
						st = st.replace('@@entertainmentval',result["recordset"][0]["entertainment"]);
						st = st.replace('@@futureval',result["recordset"][0]["future"]);
						st = st.replace('//##currentEventOverall',result["recordset"][0]["overall"]);
						st = st.replace('//##currentEventManager',result["recordset"][0]["manager"]);
						st = st.replace('//##currentEventFood',result["recordset"][0]["food"]);
						st = st.replace('//##currentEventEntertainment',result["recordset"][0]["entertainment"]);
						st = st.replace('//##currentEventFuture',result["recordset"][0]["future"]);
						var k = 0;
						while(k!=3)
						{
							st = st.replace('@@overallprog',overallprog);
							st = st.replace('@@managerprog',managerprog);
							st = st.replace('@@foodprog',foodprog);
							st = st.replace('@@entertainmentprog',entertainmentprog);
							st = st.replace('@@futureprog',futureprog);
							k = k + 1;
						}
					}
					catch (e)
					{
						console.log('LOG: Error in processing result.'+e.toString())
					}
                    //console.log(fields['fname'] + " " + fields['lname'] + "\n" + err);
                    sql.close();
				});
				request.query("select userid,fname, lname,additionalComments as comments from review r, event i, customer c where r.eventID=i.eventID and userid=c.ID and i.eventid="+eventid, function(err, result) {
                    if (err){
						console.log("error",err)
					}
					console.log("LOG: Event Query Success");
					try{
						for (i in result['recordset']) {
							//console.log(result['recordset'][i]);
						}
						st = st.replace('@@NAME1',result["recordset"][0]["fname"]);
						st = st.replace('@@NAME2',result["recordset"][0]["lname"]);
						st = st.replace('@@NAME3','Riyank Mukhopadhyay');
						st = st.replace('@@REV1',result["recordset"][0]["comments"]);
					}
					catch (e)
					{
						fs.readFile('./pages/static/404/index.html', function(err, data1) {
							var st = data1.toString();
							st = st.replace('404. Bye. :/','The entered event ID is invalid.')
							res.write(st);
							res.end();
							sql.close();
							return;
						});
						console.log('LOG: Error in processing result.'+e.toString())
					}
					try{
						st = st.replace('@@REV2',result["recordset"][1]["comments"]);
						st = st.replace('@@REV3',result["recordset"][2]["comments"]);

					}
					catch(e)
					{
						st = st.replace('@@REV2',"Quite an amazing event. Thanks for the special moments. :)");
						st = st.replace('@@REV3',"HOLY COW (sly smile)! Thanks for making me and my kids so happy. Will surely come back to eventIt!");
					}
                    //console.log(fields['fname'] + " " + fields['lname'] + "\n" + err);
                    sql.close();
				});
				request.query("select eventid, avg(overallexp) as overall, avg(managerbehaviour) as manager, avg(foodrating) as food, avg(entertainmentrating) as entertainment, avg(futurebookingpreference) as future from review where eventid IN(select eventid from event where category IN (select distinct(Category) from review r, event e where r.eventid = e.eventid and e.eventid="+eventid+")) GROUP BY eventid;", function(err, result) {
                    if (err){
						console.log("QUERY ERROR")
						console.log(err);
						return
					}
					console.log("LOG: Event Query Success");
					try{
						for (i in result['recordset']) {
							//console.log(result['recordset'][i]);
						}
						st = st.replace('//##eventID1Overall',result["recordset"][1]["overall"]);
						st = st.replace('//##eventID1Manager',result["recordset"][1]["manager"]);
						st = st.replace('//##eventID1Food',result["recordset"][1]["food"]);
						st = st.replace('//##eventID1Entertainment',result["recordset"][1]["entertainment"]);
						st = st.replace('//##eventID1Future',result["recordset"][1]["future"]);
						st = st.replace('@@eventID1','eventID-'+result["recordset"][1]["eventid"]);

						st = st.replace('//##eventID2Overall',result["recordset"][2]["overall"]);
						st = st.replace('//##eventID2Manager',result["recordset"][2]["manager"]);
						st = st.replace('//##eventID2Food',result["recordset"][2]["food"]);
						st = st.replace('//##eventID2Entertainment',result["recordset"][2]["entertainment"]);
						st = st.replace('//##eventID2Future',result["recordset"][2]["future"]);
						st = st.replace('@@eventID2','eventID-'+result["recordset"][2]["eventid"]);

						st = st.replace('//##eventID3Overall',result["recordset"][3]["overall"]);
						st = st.replace('//##eventID3Manager',result["recordset"][3]["manager"]);
						st = st.replace('//##eventID3Food',result["recordset"][3]["food"]);
						st = st.replace('//##eventID3Entertainment',result["recordset"][3]["entertainment"]);
						st = st.replace('//##eventID3Future',result["recordset"][3]["future"]);
						st = st.replace('@@eventID3','eventID-'+result["recordset"][3]["eventid"]);

						st = st.replace('//##eventID4Overall',result["recordset"][4]["overall"]);
						st = st.replace('//##eventID4Manager',result["recordset"][4]["manager"]);
						st = st.replace('//##eventID4Food',result["recordset"][4]["food"]);
						st = st.replace('//##eventID4Entertainment',result["recordset"][4]["entertainment"]);
						st = st.replace('//##eventID4Future',result["recordset"][4]["future"]);
						st = st.replace('@@eventID4','eventID-'+result["recordset"][4]["eventid"]);


					}
					catch (e)
					{
						console.log('LOG: Error in processing result.'+e.toString())
					}
					//console.log(fields['fname'] + " " + fields['lname'] + "\n" + err);
					res.write(st);
                    res.end();
                    sql.close();
				})
            });
        });
	}
	else 	if(q.pathname=='/submit_m')
	{
		console.log("Hi");
		var form = new formidable.IncomingForm();
		form.parse(req,function(err,fields,files) 
		{
			sql.connect(config, function (err){
				var request = new sql.Request();
				
				request.input('cname',fields['cname']);
				request.input('lname',fields['lname']);
				request.input('mobile',fields['mobile']);
				request.input('email',fields['email']);
				request.input('oaddress',fields['oaddress']);
				request.input('phone',fields['phone']);
				request.input('service',fields['service']);
				request.input('city',fields['city']);
				console.log('${req.body.cname}');
				request.query("insert into media_partner(name,contact_person,mobile,email,oaddress,phone,type_,city) values(@cname,@lname,@mobile,@email,@oaddress,@phone,@service,@city);",function(err, result){
					console.log(result);
					console.log(fields['cname']+"\n"+err);
					sql.close();
					

					alert('Media Partner details entered successfully')
				});
			});
		});
		var redirect = './pages/static/entered.html';
		fs.readFile(redirect, function(err, data) 
		{
			if (err) 
			{
				console.log(filename)
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("404 Not Found!!!!!!!!");
			}	 
			else
    		{
				res.writeHead(200, {'Content-Type': 'text/html'});
			}
    		res.write(data);
    		return res.end();
  		});
	}
	else	
	{
		fs.readFile(filename, function(err, data) 
		{
			if (err) 
			{
				console.log(filename)
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("404 Not Found!!!!!!!!");
			}	 
			if(filename[filename.length-1]=='/') 
    		{
				res.writeHead(200, {'Content-Type': 'text/html'});
			}
    		res.write(data);
    		return res.end();
  		});
	}
}).listen(3000);