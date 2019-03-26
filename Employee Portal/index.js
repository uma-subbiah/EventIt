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
http.createServer(function (req, res) 
{
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
	console.log(q.pathname);
	
	if(q.pathname=='/submit')
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
                request.query("select category,e.empid,eventlocation,name from event e ,employee m where e.empID=m.empID and eventID="+eventid+";", function(err, result) {
                    if (err){
						console.log("error")
					}
					console.log("LOG: Event Query Success");
					try{
						for (i in result['recordset']) {
							console.log(result['recordset'][i]);
						}
						var category = result["recordset"][0]["category"];
						var location = result["recordset"][0]["eventlocation"]
						var managerid = result["recordset"][0]["empid"]
						var managername = result["recordset"][0]["name"]
						st = st.replace('@@eventID',fields['eventid'])
						st = st.replace('@@eventCAT',category);
						st = st.replace('@@eventLOCATION',location);
						st = st.replace('@@eventMANAGER',managername);
						st = st.replace('@@eventManagerID','EmpID:'+managerid);
						res.write(st);
                    	res.end();
					}
					catch (e)
					{
						console.log('LOG: Error in processing result.'+e.toString())
					}
                    //console.log(fields['fname'] + " " + fields['lname'] + "\n" + err);
                    sql.close();
                });
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