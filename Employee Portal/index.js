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
	var q = url.parse(req.url, true);
	var filename = "./pages/static" + q.pathname;
	if(filename[filename.length-1]=='/')
		filename+='index.html';
	console.log(q.pathname);
	if(q.pathname=='/ContactUs')
	{
		var x=0;
		res.writeHead(200, {'Content-Type': 'text/html'});
		console.log("ContactUs\n")
         {
			try {
				// connect to your database
				console.log("Hi3")
				sql.connect(config, function (err) {
				
					if (err){ console.log(err);console.log("ERROR");}
			
					// create Request object
					var request = new sql.Request();
					console.log("Hi2")
					// query to the database and get the records
					request.query('select * from contact', function (err, recordset) {
						console.log("Hi1")
						if (err) console.log(err)
			
						// send records as a response
						console.log(recordset);
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
				console.log(err);console.log("ERROR");
			}
			console.log("End");
		}
		console.log("End");
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
}).listen(3030);