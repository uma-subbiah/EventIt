//var alert = require('alert-node');
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
		filename+='Display.html';
	console.log(q.pathname);
	
	if(q.pathname=='/submit')
	{
		var form = new formidable.IncomingForm();
		form.parse(req,function(err,fields,files) 
		{
		var x=0;
		res.writeHead(200, {'Content-Type': 'text/html'});
			console.log("LOG: Attempting DB Connection...")
			try {
				// connect to your database
					sql.connect(config, function (err) {
				
					if (err){console.log("!!!LOG: Error in connection to database. "+err); res.write("There's a DB server connection error. That's all we can say right now. :/"); return;}
			
					// create Request object
					var request = new sql.Request();
					console.log("LOG: Request object created ...")
					// query to the database and get the records
					request.input('Place',fields['Place']);
	                request.input('Categories',fields['Categories']);
					request.query("select * from Sponsors where city=@Place and category=@Categories;", function (err, recordset) {
						console.log("LOG: Running SQL Query using the request objegh   ct ...")
						if (err) console.log("!!!LOG: Error returned by database."+err.toString()+err);
			
						// send records as a response
						console.log("LOG: Query success... : ");
						var pr='';
						
						for(i in recordset['recordset'])
						{
							console.log(recordset['recordset'][i]);
							pr+='<div class="col-sm-4">';
								pr+='<table class="table">';
								pr+='<tr><td>'+'sponsor'+recordset['recordset'][i]['id']+'</td></tr>';
								pr+='<tr><td>'+'CompanyName:'+recordset['recordset'][i]['CompanyName']+'</td></tr>';
								pr+='<tr><td>'+'SponsorName:'+recordset['recordset'][i]['name']+'</td></tr>';
								pr+='<tr><td>'+'Mail Id:'+recordset['recordset'][i]['mailid']+'</td></tr>';
								pr+='<tr><td>'+'Category:'+recordset['recordset'][i]['category']+'</td></tr>';
								pr+='<tr><td>'+'Number:'+recordset['recordset'][i]['phonenum']+'</td></tr>';
								pr+='<tr><td>'+'City:'+recordset['recordset'][i]['city']+'</td></tr>';
								pr+='<tr><td>'+'...............................................'+'</td></tr>';
								pr+='</table>';
							pr+='</div>';
						}
						//console.log(pr);
						fs.readFile('./pages/static/content.html', function(err, data){
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
				console.log("!!!LOG : Error in fetching page... : ");
				console.log(err);
			}	
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
	
}).listen(8088);