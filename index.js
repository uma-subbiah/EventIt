var http = require('http');
var url = require('url');
var fs = require('fs');
var sql = require('mssql');
var formidable = require('formidable');
var utils = require('./utilities.js')
var awsservices = require('./AWSnodeproj/sns_publishsms')

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
    /*{
        res.writeHead(200, {
            'Set-Cookie': {'mycookie'='test';'x'='hrl';'y'='hrlo';},
            'Content-Type': 'text/plain'
          });
    }*/
    //console.log("LOG: req url :"+req.url);
    var q = url.parse(req.url, true);
    var filename = "./pages/static" + q.pathname;
    if (filename[filename.length - 1] == '/') {
        filename += 'index.html';
        console.log("LOG: Landing page requested by a client... ");
    }
    var cookies=parseCookies(req);
    //onsole.log(cookies.toString());
    if (q.pathname == '/AdminLanding') {
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
                request.query('select * from rev_sum', function(err, recordset) {
                    console.log("LOG: Running SQL Query using the request object ...")
                    if (err) {
                        console.log("!!!LOG: Error returned by database.")
                        return res.end();
                    }
                    // send records as a response
                    console.log("LOG: Query success... : ");
                    var pr = '';
                    var y = recordset['recordset'];
                    var z = [
                        [y[4]['1'], y[3]['1'], y[2]['1'], y[1]['1'], y[0]['1']],
                        [y[4]['2'], y[3]['2'], y[2]['2'], y[1]['2'], y[0]['2']],
                        [y[4]['3'], y[3]['3'], y[2]['3'], y[1]['3'], y[0]['3']],
                        [y[4]['4'], y[3]['4'], y[2]['4'], y[1]['4'], y[0]['4']],
                        [y[4]['5'], y[3]['5'], y[2]['5'], y[1]['5'], y[0]['5']]
                    ];
                    pr = require('JSON').stringify(z);
                    console.log("LOG : " + pr);
                    fs.readFile('./pages/static/ChartFeedback/index.html', function(err, data) {
                        var st = data.toString();
                        // console.log(data.toString());
                        st = st.replace('~1', pr);
                        console.log(st);
                        res.write(st);
                        res.end();
                        sql.close();
                        return;

                    });

                });
            });

        } catch (err) {
            console.log("!!!LOG : Error in fetching ContactUs page... : ");
            console.log(err);
        }
    } else if (q.pathname == '/ContactUs') {
        var x = 0;
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
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
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        fs.readFile('./pages/static/registration.html', function(err, data) {
            var st = data.toString();
            //console.log(data.toString());
            res.write(st);
            res.end();
            return;
        });
    } else if (q.pathname == '/review/submit') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            sql.connect(config, function(err) {
                var request = new sql.Request();
                request.input('eventID', parseInt(fields['eventID']));
                request.input('name', fields['name']);
                request.input('email', fields['email']);
                request.input('overallexp', parseInt(fields['overallexp']));
                request.input('managerbehaviour', parseInt(fields['managerbehaviour']));
                request.input('foodrating', parseInt(fields['foodrating']));
                request.input('entertainmentrating', parseInt(fields['entertainmentrating']));
                request.input('futurebookingpreference', parseInt(fields['futurebookingpreference']));
                request.input('additionalcomments', fields['message']);
                request.query("insert into review(eventID,overallExp,managerbehaviour,foodrating,entertainmentrating,futurebookingpreference,additionalComments) values(@eventID,@overallexp,@managerbehaviour,@foodrating,@entertainmentrating,@futurebookingpreference,@additionalComments);", function(err, result) {
                    console.log('LOG : futurebookingpref .. :' + fields['futurebookingpreference']);
                    if (err) {
                        console.log(err.toString());
                        res.end();
                        return;
                    }
                    console.log("LOG: query result" + result);
                    //console.log(fields['fname'] + " " + fields['lname'] + "\n" + err);
                    sql.close();
                    res.write('Check console logs for review status.');
                    res.end();
                    return;
                });
            });
        });
    } else if (q.pathname == '/register/submit') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            sql.connect(config, function(err) {
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
                    if (err) throw err;
                    console.log("LOG: REG SUCCESSFUL!");
                    //console.log(fields['fname'] + " " + fields['lname'] + "\n" + err);
                    sql.close();
                    res.write('<head><meta http-equiv="refresh" content="0; URL=/regsuccess" /></head>');
                    res.end();
                });
                var datetime = new Date();
                var sendText = "Dear " + fields['fname'] + ", you have been successfully registered on EventIt.com! Please feel free to log in anytime at http://eventit.com/login";
                awsservices.sendSMS(sendText, fields['mobile']);
                utils.MailSend(fields['email'], sendText);
                fs.appendFile('./MailLogs/MAIL_LOGS.txt', '\n==\n=='+datetime+'\nMAIL\n'+sendText, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                  });
            });
        });
    } else if (q.pathname == '/invite') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            console.log(fields['guests']);
            var sendText = "Dear friend, we cordially invite you for our celebrations on 31.3.19, at the Residency!";
            utils.MailSend(fields['guests'], sendText);
        });

        //redirect user:

        var redirect = './pages/static/customer_ui/confirmed_invite.html';
        fs.readFile(redirect, function(err, data) {
            if (err) {
                console.log(filename)
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                return res.end("404 Not Found!!!!!!!!");
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
            }
            res.write(data);
            return res.end();
        });

    } else if (q.pathname == '/login/submit') {
        var st,redirect;
        var ckie="";
        fs.readFile('./pages/static/RegSuccess/index.html', function(err, data) {
            if (err) throw err;
            st = data.toString();
            st = st.replace('Successfully Registered!', 'Kashtam Pa');
            st = st.replace('Your account has been registered! Check your phone for confirmation.', 'FirstLine')
            st = st.replace('Registration Success!', 'TitleLine')
        });
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            console.log('LOG : gonna connect..')
            sql.connect(config, function(err) {
                console.log('LOG : connecting..')
                if (err) {
                    console.log('DB Connection ERROR.')
                    st = st.replace('FirstLine', 'Either your internet\'s messed up, or the DB IS DOWN.')
                    st = st.replace('TitleLine', 'Connectivity Problem')
                    res.write(st);
                    res.end();
                    sql.close();
                    return;
                }
                var request = new sql.Request();
                var querytext = "select * from tablename where email='@mail';";
                console.log("LOG: email : " + fields['email']);
                var usertype = fields['usertype'];
                console.log("LOG: usertype : " + usertype);
                if (usertype == 'user') 
                {
                    ckie="u";
                    querytext = querytext.replace('tablename', 'customer');
                    redirect = "/landing";
                }
                else if(usertype=="manager") 
                {
                    ckie="m";
                    querytext = querytext.replace('tablename', 'manager');
                    redirect = "/landing";
                } 
                else 
                {
                    ckie="e"
                    querytext = querytext.replace('tablename', 'employee');
                    redirect = "http://eventit.com:3000/";
                }
                querytext = querytext.replace('@mail', fields['email']);
                console.log("query is " + querytext);
                request.query(querytext, function(err, result) {
                    //console.log("LOG : Login query result : "+result);
                    //console.log("LOG : Login query result : "+result["recordsets"][0][0].password);
                    console.log('LOG:querying...');
                    if (err) {
                        console.log("!!!LOG: Error in query retrieval... : " + err);
                        res.write('<head><meta http-equiv="refresh" URL=#"/><body><h1>Kashtam pa<h1></body></head>');
                        res.end();
                        sql.close();
                        return;
                    }
                    console.log('LOG:no query retrieval error...');
                    console.log('QUERY RESUL :' + result);
                    
                    try {
                        if (result["recordset"][0]["password"] == fields['password']) {
                            console.log("LOG: Login success. redirecting to "+redirect)
                            ckie=ckie+"~"+result["recordset"][0]["ID"]+"~"+result["recordset"][0]["mobile"]+"~"+result["recordset"][0]["email"];
                            res.writeHead(200, {
                                'Set-Cookie': 'login='+ckie+";Path=/",
                                'Content-Type': 'text/html'
                              });
                            res.write('<head><meta http-equiv="refresh" content="0; URL='+redirect+'" /></head>');
                            
                            res.end();
                        } else {
                            console.log("LOG: Login failed. Incorrect Password");
                            st = st.replace('FirstLine', 'We\'re so ... uhm... CONCERNED to say you might\'ve forgotten your password. Nothin\' to worry, just think harder. ( whilst we \'i++\' until your account is blocked\'. :/ )')
                            st = st.replace('TitleLine', 'Incorrect Password')
                            res.write(st);
                            res.end();
                        }
                    } catch (e) {
                        console.log("!!!LOG: Error encountered while matching user data : " + e)
                        console.log('LOG: Login failed. This email probably doesn\'t exist in DB.')
                        st = st.replace('FirstLine', 'We\'re so sorry to say you were never a part of eventIT. Nothin\' to worry, click the button below to get yourself registerd in minutes!')
                        st = st.replace('TitleLine', 'Non-existant User')
                        st = st.replace('>LOGIN</a>', '>REGISTER</a>')
                        st = st.replace('href="/login"', 'href="/register"')
                        res.write(st);
                        res.end();
                    } finally {
                        sql.close();
                    }
                });
            });
        });
    } else if (q.pathname == '/regsuccess') {
        fs.readFile('./pages/static/RegSuccess/index.html', function(err, data) {
            if (err) throw err;
            var st = data.toString();
            res.write(st);
            res.end();
        });
    } else if (q.pathname == '/reviewsuccess') {
        console.log('LOG: review/success detected');
        fs.readFile('./pages/static/RegSuccess/index.html', function(err, data) {
            if (err) throw err;
            var st = data.toString();
            st = st.replace('Successfully Registered!', 'Thanks for submitting the review!');
            st = st.replace('Your account has been registered! Check your phone for confirmation.', 'Your review has been recorded. Thanks.We\'ll improve from it (hopefully, that is).')
            st = st.replace('Registration Success!', 'Review Submitted!')
            res.write(st);
            res.end();
        });
    } 
    else if (q.pathname == '/login') 
    {
        //var cookies = parseCookies(req);
        
        if (cookies["login"]!=null && cookies["login"]!="0") 
        {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            console.log("Cookie parse success "+cookies["login"]+"\n");
            res.write('<head><meta http-equiv="refresh" content="0; URL=/landing/" /></head>');
            //res.write('<head><meta http-equiv="refresh" content="0; URL=http://eventit.com:8080/landing/" /></head>');
            return res.end();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            fs.readFile('./pages/static/login.html', function(err, data) {
                res.write(data.toString());
                res.end();
                return;
            });
        }
    } else if (q.pathname == '/customer_ui/askevent/submit') {
        console.log("LOG: Event ask detected ...");
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            if (err) {
                console.log("!!!LOG: Error in parsing form... : " + err.toString());
                return;
            }
            sql.connect(config, function(err) {

                if (err) {
                    console.log("!!!LOG: Error in connection... : " + err.toString());
                    return;
                }
                var request = new sql.Request();
                request.input('mobile', fields['mobile']);
                request.input('email', fields['email']);
                request.input('budget', fields['budget']);
                request.input('category', fields['event']);
                request.input('location', fields['location']);
                request.query("insert into event(Category,eventLocation,budget,email) values(@category,@location,@budget,@email)", function(err, result) {
                    if (err) {
                        console.log("!!!LOG: Error in query retrieval... : " + err.toString());
                        //return;
                    }
                    console.log(result);
                    console.log(fields['budget'] + " " + fields['event'] + " " + fields['email'] + " " + fields['location'] + "\n" + err);
                    sql.close();
                    res.end();
                    var datetime = new Date();
                    var sendText = "Greetings from EventIt! Your event is under process! Please feel free to track your event at http://eventit.com/login";
                    try {
                        awsservices.sendSMS(sendText, fields['mobile']);
                    } catch (err) {
                        console.log("AWS error.close.close.Abhilash's fault")
                    };
                    utils.MailSend(fields['email'], sendText);
                    fs.appendFile('./MailLogs/MAIL_LOGS.txt', '\n==\n=='+datetime+'\nMAIL\n'+sendText, function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                      });
                    return;
                });
            });
        });
        res.end();
    }
    else if(q.pathname=="/logout")
    {
        res.writeHead(200, {
            'Set-Cookie': 'login=0;Path=/',
            'Content-Type': 'text/html'
          });
        res.write('<head><meta http-equiv="refresh" content="0; URL=http://eventit.com:8080/" /></head>');
        return res.end();
    }
    else if(q.pathname.startsWith("/landing",0))
    {
        var info,e,m,u;
        if(cookies["login"]!=null && cookies["login"]!="0")
        {
            info=cookies["login"].split("~");
            m=(info[0]=="m");
            u=(info[0]=="u");
            console.log(u);
        }
        else
        {
            res.write('<head><meta http-equiv="refresh" content="0; URL=/login" /></head>');
            return res.end();
        }
        if(u&&q.pathname=="/landing")
        {
            fs.readFile('./pages/static/customer_ui/clanding.html', function(err, data1) {
                var st = data1.toString();
                res.write(st);
                res.end();
            });
        }
        else 
        {
            fs.readFile(filename, function(err, data) 
            {
                if (err) 
                {
                    console.log(filename + "NOT FOUND!\n")
                    fs.readFile('./pages/static/404/index.html', function(err, data1) 
                    {
                        var st = data1.toString();
                        res.write(st);
                        return res.end();
                    }); 
                }
                else 
                {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.write(data.toString());
                    return res.end();
                }
            });
        }
    } 
    else {
        
        fs.readFile(filename, function(err, data) {
            if (err) {
                console.log(filename + "NOT FOUND!\n")
                fs.readFile('./pages/static/404/index.html', function(err, data1) {
                    var st = data1.toString();
                    res.write(st);
                    res.end();
                });
                return;
            }
            if (filename[filename.length - 1] == '/') {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
            }
            res.write(data);
            return res.end();
        });
    }
}).listen(8080);
