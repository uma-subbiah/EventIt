var utils=require('./utilities.js');
utils.MailSend('niranjankumar26081998@gmail.com',"Hello");
/*var nodemailer=require('nodemailer');
    var transporter = nodemailer.createTransport
    (
        {
            service: 'gmail',
            auth: 
            {
                user: 'ninju26@gmail.com',
                pass: 'NiNjU1998+'
            }
        }
    );
    var mailOptions = 
    {
        from: 'ninju26@gmail.com',
        to: 'niranjankumar26081998@gmail.com',
        subject: 'Sending Email using Node.js',
        text:'\nWith Regards,\nTeam EventIt.'
    };
    transporter.sendMail(mailOptions, function(error, info)
    {
        if (error) 
        {
            console.log(error);
        } 
        else 
        {
            console.log('Email sent: ' + info.response);
        }
        return;
    });*/