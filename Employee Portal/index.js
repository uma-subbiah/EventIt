var alert = require('alert-node');
const express = require('express');
const app = express();
var http = require('http');
var url = require('url');
var fs = require('fs');
var sql=require('mssql');
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
}).listen(8080);