//var alert = require('alert-node');
//const express = require('express');
//const app = express();
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
{console.log("Hi");
	var q = url.parse(req.url, true);
    var filename = "./pages/static" + q.pathname;
    console.log(filename);
	if(filename[filename.length-1]=='/')
		filename+='Sponsors.html';
	console.log(q.pathname);
	
	if(q.pathname=='/submit')
	{
		console.log("Hello");
		var form = new formidable.IncomingForm();
		form.parse(req,function(err,fields,files) 
		{console.log(fields['cname']);
			sql.connect(config, function (err){
				var request = new sql.Request();
				console.log("Hhsujshu");
				request.input('cname',fields['cname']);
                request.input('lname',fields['lname']);
                request.input('email',fields['email']);
                request.input('service',fields['service']);
				request.input('mobile',fields['mobile']);
				request.input('city',fields['city']);
				console.log('${req.body.cname}');
				request.query("insert into Sponsors(CompanyName,name,mailid,category,phonenum,city) values(@cname,@lname,@email,@service,@mobile,@city);",function(err, result){
					console.log(result);
					console.log(fields['cname']+"\n"+err);
					sql.close();
					res.end();
					//alert('Sponsors details entered successfully')
				});
			});
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
	// res.writeHead(301,
	// 	{ Location: './'  }
	//   );
	//   res.end();
}).listen(8088);