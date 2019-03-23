var alert = require('alert-node');
const express = require('express');
const app = express();
var http = require('http');
var url = require('url');
var fs = require('fs');
var sql=require('mssql');
var utils=require('./utilities.js')
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
	if(filename[filename.length-1]=='c')
		filename+='enter_caterer.html';
	else if(filename[filename.length-1]=='m')
		filename+='enter_media_partner.html';
	else if(filename[filename.length-1]=='s')
		filename+='ponsor_select.html';
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
					

					alert('Caterer details entered successfully');
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
	else if(q.pathname=='/submit_m')
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
	else if(q.pathname=='/s')
	{
		var x=0;
		res.writeHead(200, {'Content-Type': 'text/html'});
		console.log("\nLOG: Sponsors page requested by a client...")
			console.log("LOG: Attempting DB Connection...")
			try {
				// connect to your database
				sql.connect(config, function (err) {

					if (err){console.log("!!!LOG: Error in connection to database. "); res.write("There's a DB server connection error. That's all we can say right now. :/"); return;}

					// create Request object
					var request = new sql.Request();
					console.log("LOG: Request object created ...")
					// query to the database and get the records
					request.query('select * from sponsors', function (err, recordset) {
						console.log("LOG: Running SQL Query using the request object ...")
						if (err) console.log("!!!LOG: Error returned by database.")

						// send records as a response
						console.log("LOG: Query success... : ");
						var pr='';

						for(i in recordset['recordset'])
						{
							console.log(recordset['recordset'][i]);
							
								pr+='<tr><th>'+recordset['recordset'][i]['CompanyName']+'</th></tr>';
								pr+='<tr><td>'+recordset['recordset'][i]['name']+'</td></tr>';
								pr+='<tr><td>'+recordset['recordset'][i]['mailid']+'</td></tr>';
								pr+='<tr><td>'+recordset['recordset'][i]['category']+'</td></tr>';
								pr+='<tr><td>'+recordset['recordset'][i]['phonenum']+'</td></tr>';
								pr+='<tr><td>'+recordset['recordset'][i]['city']+'</td></tr>';
								pr+='<tr><td><form action = "/sendemail_'+i+'" method="GET"><input type="submit" value="Call Sponsor"></form></td></tr>';
								
						}
						//console.log(pr);
						fs.readFile('./pages/static/sponsor_select.html', function(err, data){
							var st=data.toString();
							console.log(data.toString());
							st=st.replace('~1',pr);
							res.write(st);
							res.end();
						});
						sql.close();
					});
				});

			} catch (err) {
				console.log("!!!LOG : Error in fetching ContactUs page... : ");
				console.log(err);
			}
		console.log("LOG: Ending ContactUs request block ... ");
		return;
	}
	else if(q.pathname.startsWith('/sendemail'))
	{
		var index = q.pathname[q.pathname.length-1];
		try {
			// connect to your database
			sql.connect(config, function (err) {

				if (err){console.log("!!!LOG: Error in connection to database. "); res.write("There's a DB server connection error. That's all we can say right now. :/"); return;}

				// create Request object
				var request = new sql.Request();
				console.log("LOG: Request object created ...")
				// query to the database and get the records
				request.query('select * from sponsors', function (err, recordset) {
					console.log("LOG: Running SQL Query using the request object ...")
					if (err) console.log("!!!LOG: Error returned by database.")

					// send records as a response
					console.log("LOG: Query success... : ");
					var tomail = recordset['recordset'][index]['mailid'];
					var sendText = "Dear sponsor, We are delighted to inform you that we seek your help in conducting an event. If interested / for more details, please reply to this email id. Thank you, EventIt! :)";
					console.log(tomail);
					utils.MailSend(tomail,sendText);
					sql.close();
				});
			});
			alert('Email has been sent successfully')
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
	catch (err) {
		console.log("!!!LOG : Error in fetching ContactUs page... : ");
		console.log(err);
	}
	}
	else if(q.pathname=='/submit_m')
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
	else if(q.pathname=='/cancel')
	{
		var x=0;
		res.writeHead(200, {'Content-Type': 'text/html'});
		console.log("\nLOG: Sponsors page requested by a client...")
			console.log("LOG: Attempting DB Connection...")
			try {
				// connect to your database
				sql.connect(config, function (err) {

					if (err){console.log("!!!LOG: Error in connection to database. "); res.write("There's a DB server connection error. That's all we can say right now. :/"); return;}

					// create Request object
					var request = new sql.Request();
					console.log("LOG: Request object created ...")
					// query to the database and get the records
					request.query('update event set cancelled = 1 where eventID=1;', function (err, recordset) {
						console.log("LOG: Running SQL Query using the request object ...")
						if (err) console.log("!!!LOG: Error returned by database.")

						// send records as a response
						console.log("LOG: Query success... : ");
						
						alert('The event has been deleted');
						
						sql.close();
					});
				});

			} catch (err) {
				console.log("!!!LOG : Error in fetching ContactUs page... : ");
				console.log(err);
			}
			var redirect = './pages/static/cancelled.html';
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
}).listen(8000);