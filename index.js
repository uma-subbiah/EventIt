var http = require('http');
var url = require('url');
var fs = require('fs');
var sql=require('mssql');
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
	console.log("LOG: req url :"+req.url);
	var q = url.parse(req.url, true);
	var filename = "./pages/static" + q.pathname;
	if(filename[filename.length-1]=='/')
	{
		filename+='index.html';
		console.log("LOG: Landing page requested by a client... ");
	}
	if(q.pathname=='/ContactUs')
	{
		var x=0;
		res.writeHead(200, {'Content-Type': 'text/html'});
		console.log("\nLOG: ContactUs page requested by a client...")
			console.log("LOG: Attempting DB Connection...")
			try {
				// connect to your database
				sql.connect(config, function (err) {
				
					if (err){console.log("!!!LOG: Error in connection to database. "); res.write("There's a DB server connection error. That's all we can say right now. :/"); return;}
			
					// create Request object
					var request = new sql.Request();
					console.log("LOG: Request object created ...")
					// query to the database and get the records
					request.query('select * from contact', function (err, recordset) {
						console.log("LOG: Running SQL Query using the request object ...")
						if (err) console.log("!!!LOG: Error returned by database.")
			
						// send records as a response
						console.log("LOG: Query success... : ");
						var pr='';
						
						for(i in recordset['recordset'])
						{
							console.log(recordset['recordset'][i]);
							pr+='<div class="col-sm-4">';
								pr+='<table class="table">';
								pr+='<tr><th>'+recordset['recordset'][i]['position']+'</th></tr>';
								pr+='<tr><td>'+recordset['recordset'][i]['name']+'</td></tr>';
								pr+='<tr><td>'+recordset['recordset'][i]['email']+'</td></tr>';
								pr+='<tr><td>'+recordset['recordset'][i]['phone']+'</td></tr>';
								pr+='<tr><td>'+recordset['recordset'][i]['phone2']+'</td></tr>';
								pr+='</table>';
							pr+='</div>';
						}
						//console.log(pr);
						fs.readFile('./pages/static/ContactUs.html', function(err, data){
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
	else if(q.pathname=='/register')
	{
		//filename+='.html';
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.readFile('./pages/static/registration.html', function(err, data){
			var st=data.toString();
			console.log(data.toString());
			res.write(st);
			res.end();
			return;
		});
	}
	else if(q.pathname=='/register/submit')
	{
		var form = new formidable.IncomingForm();
		form.parse(req,function(err,fields,files) 
		{
			sql.connect(config, function (err){
				var request = new sql.Request();
				request.input('uname',fields['uname']);
				request.input('pass',fields['pass']);
				request.query("insert into test(username,pass) values(@uname,@pass);",function(err, result){
					console.log(result);
					console.log(fields['fname']+" "+fields['lname']+"\n"+err);
					sql.close();
					res.end();
					return;
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
				console.log(filename+"NOT FOUND!\n")
				fs.readFile('./pages/static/404/index.html',function (err, data1){
					var st=data1.toString();
					res.write(st);
					console.log(st)
					res.end();
				});
				return;
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