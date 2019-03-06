var http = require('http');
var url = require('url');
var fs = require('fs');
var sql = require('mssql');
var formidable = require('formidable');
var config = {
    user: 'abhilash.venky',
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
http.createServer(function(req, res) {
    console.log("LOG: req url :" + req.url);
    var q = url.parse(req.url, true);
    var filename = "./pages/static" + q.pathname;
    if (filename[filename.length - 1] == '/') {
        filename += 'index.html';
        console.log("LOG: Landing page requested by a client... ");
    }
    if (q.pathname == '/ContactUs') {
        var x = 0;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        console.log("\nLOG: ContactUs page requested by a client...")
        console.log("LOG: Attempting DB Connection...")
        try {
            // connect to your database
            sql.connect(config, function(err) {

                if (err) {
                    console.log("!!!LOG: Error in connection to database. ");
                    res.write("There's a DB server connection error. That's all we can say right now. :/");
                    return;
                }

                // create Request object
                var request = new sql.Request();
                console.log("LOG: Request object created ...")
                    // query to the database and get the records
                request.query('select * from contact', function(err, recordset) {
                    console.log("LOG: Running SQL Query using the request object ...")
                    if (err) console.log("!!!LOG: Error returned by database.")

                    // send records as a response
                    console.log("LOG: Query success... : ");
                    var pr = '';

                    for (i in recordset['recordset']) {
                        console.log("i :" + i);
                        console.log(recordset['recordset'][i]);
                        pr += '<div class="col-sm-4">';
                        pr += '<table class="table">';
                        pr += '<tr><th>' + recordset['recordset'][i]['position'] + '</th></tr>';
                        pr += '<tr><td>' + recordset['recordset'][i]['name'] + '</td></tr>';
                        pr += '<tr><td>' + recordset['recordset'][i]['email'] + '</td></tr>';
                        pr += '<tr><td>' + recordset['recordset'][i]['phone'] + '</td></tr>';
                        pr += '<tr><td>' + recordset['recordset'][i]['phone2'] + '</td></tr>';
                        pr += '</table>';
                        pr += '</div>';
                    }
                    //console.log(pr);
                    fs.readFile('./pages/static/ContactUs.html', function(err, data) {
                        var st = data.toString();
                        console.log(data.toString());
                        st = st.replace('~1', pr);
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
    } else if (q.pathname == '/register') {
        //filename+='.html';
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile('./pages/static/registration.html', function(err, data) {
            var st = data.toString();
            console.log(data.toString());
            res.write(st);
            res.end();
            return;
        });
    } else if (q.pathname == '/register/submit') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            sql.connect(config, function(err) {
                if (err) throw err;
                var request = new sql.Request();
                request.input('fname', fields['fname']);
                request.input('lname', fields['lname']);
                request.input('mobile', fields['mobile']);
                request.input('email', fields['email']);
                request.input('paddr', fields['paddress']);
                request.input('oaddr', fields['oaddress']);
                request.input('telephone', fields['phone']);
                request.input('username', fields['uname']);
                request.input('password', fields['pass']);
                request.input('gender', fields['gender']);
                request.input('dob', fields['dob']);
                request.query("insert into customer(fname,lname,mobile,email,paddr,oaddr,telephone,username,password,gender,dob) values(@fname,@lname,@mobile,@email,@paddr,@oaddr,@telephone,@username,@password,@gender,@dob);", function(err, result) {
                    console.log(result);
                    console.log(fields['fname'] + " " + fields['lname'] + "\n" + err);
                    sql.close();
                    res.write('<head><meta http-equiv="refresh" content="0; URL=/login.html" /></head>');
                    res.end();
                    return;
                });
            });
        });
    } else if (q.pathname == '/login/submit') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            sql.connect(config, function(err) {
                var request = new sql.Request();
                request.input('mail', fields['email']);
                console.log("LOG: email : " + fields['email']);
                request.query("select password from customer where email=@mail;", function(err, result) {
                    //console.log("LOG : Login query result : "+result);
                    //console.log("LOG : Login query result : "+result["recordsets"][0][0].password);
                    if (err) {
                        console.log("!!!LOG: Error in query retrieval... : " + err);
                        return;
                    }
                    sql.close();
                    if (result["recordset"][0]["password"] == fields['password']) {
                        res.write('<head><meta http-equiv="refresh" content="0; URL=/customer_ui/clanding.html" /></head>');
                        res.end();
                        return;
                    }
                });
            });
        });
    } else if (q.pathname == '/login') {
        var cookies = parseCookies(req);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if (false && (cookies['LoggedInCustID'] != null && cookies['LoggedInCustID'] != "-1")) {

            res.write('<head><meta http-equiv="refresh" content="0; URL=http://www.eventit.com/landing/" /></head>');
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            fs.readFile('./pages/static/login.html', function(err, data) {
                res.write(data.toString());
                res.end();
                return;
            });
        }
    } else if (q.pathname == '/customer_ui/askevent/submit') {
        /*var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            if (err) {
                console.log("!!!LOG: Error in query retrieval... : " + err.toString());
                return;
            }
            sql.connect(config, function(err) {

                if (err) {
                    console.log("!!!LOG: Error in query retrieval... : " + err.toString());
                    return;
                }
                var request = new sql.Request();
                request.input('mobile', fields['mobile']);
                request.input('email', fields['email']);
                request.input('budget', fields['budget']);
                request.input('category', fields['event']);
                request.input('location', fields['location']);
                request.query("insert into event(Category,eventLocation,budget,email) values(@category,@location,@budget,@email);", function(err, result) {
                    if (err) {
                        console.log("!!!LOG: Error in query retrieval... : " + err.toString());
                        return;
                    }
                    console.log(result);
                    console.log(fields['budget'] + " " + fields['event'] + "\n" + err);
                    sql.close();
                    res.end();
                    return;
                });
            });
        });*/
        return res.end();
    } else {
        fs.readFile(filename, function(err, data) {
            if (err) {
                console.log(filename + "NOT FOUND!\n")
                fs.readFile('./pages/static/404/index.html', function(err, data1) {
                    var st = data1.toString();
                    res.write(st);
                    //console.log(st)
                    res.end();
                });
                return;
            }
            if (filename[filename.length - 1] == '/') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
            }
            res.write(data);
            return res.end();
        });
    }
}).listen(8080);