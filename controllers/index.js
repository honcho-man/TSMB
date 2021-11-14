const db = require('../config/index').get(process.env.NODE_ENV);
const fs = require('fs');
const handlebars = require('handlebars');
const transporter = require('../utils/mailer')
const multer = require('multer')

module.exports = {
    giftUser: async function (req, res) {
        const giftData = {
            recipient_name: req.body.recipient_name,
            recipient_email: req.body.recipient_email,
            recipient_phone: req.body.recipient_phone,
            benefactor_name: req.body.benefactor_name,
            benefactor_email: req.body.benefactor_email,
            benefactor_phone: req.body.benefactor_phone,
            msg: req.body.msg
        }
        fs.readFile('./utils/emails/gift_recipient.html', { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                console.log('RecipientErr:'+ err);
            } else {
                var template = handlebars.compile(html);
                var replacements = {
                    recipientName: giftData.recipient_name,
                    recipientEmail: giftData.recipient_email,
                    benefactorName: giftData.benefactor_name,
                    benefactorPhone: giftData.benefactor_phone,
                    msg: '"'+giftData.msg+'"'
                };
                var mail = template(replacements);
                var giftEmailData = {
                    from: db.SMTP_USER,
                    to: giftData.recipient_email,
                    subject: 'Congratulations '+giftData.recipient_name+'🎉',
                    html: mail
                }
            }

            transporter.sendMail(giftEmailData, function (err, info) {
                if (err) {
                    console.log('RecipientErr:'+ err);
                    res.status(500).send(err); // <----- HERE
                } else {
                    console.log("Successfully sent email.");
                    res.status(200).send('Successfully sent email!')//.redirect('login')
                    fs.readFile('./utils/emails/gift_benefactor.html', { encoding: 'utf-8' }, function (err, html) {
                        if (err) {
                            console.log('BenefactorErr:'+ err);
                        } else {
                            var template = handlebars.compile(html);
                            var replacements = {
                                recipientName: giftData.recipient_name,
                                recipientEmail: giftData.recipient_email,
                                benefactorName: giftData.benefactor_name,
                                benefactorPhone: giftData.benefactor_phone,
                                //msg: giftData.msg
                            };
                            var BenefactorMail = template(replacements);
                            var BenefactorMailgiftEmailData = {
                                from: db.SMTP_USER,
                                to: giftData.benefactor_email,
                                subject: 'Hello there',
                                html: BenefactorMail
                            }
                        }
            
                        transporter.sendMail(BenefactorMailgiftEmailData, function (err, info) {
                            if (err) {
                                console.log('BenefactorErr:'+ err);
                                //res.status(500).send(err); // <----- HERE
                            } else {
                                console.log("Successfully sent email.");
                                //res.status(200).send('Successfully sent email!')//.redirect('login')
                            }
                        });
                    }); 
                    fs.readFile('./utils/emails/gift.html', { encoding: 'utf-8' }, function (err, html) {
                        if (err) {
                            console.log('BenefactorErr:'+ err);
                        } else {
                            var template = handlebars.compile(html);
                            var replacements = {
                                recipientName: giftData.recipient_name,
                                recipientEmail: giftData.recipient_email,
                                recipientPhone: giftData.recipient_phone,
                                benefactorName: giftData.benefactor_name,
                                benefactorEmail: giftData.benefactor_email,
                                benefactorPhone: giftData.benefactor_phone,
                                msg: giftData.msg
                            };
                            var Mail = template(replacements);
                            var MailgiftEmailData = {
                                from: db.SMTP_USER,
                                to: 'olanrewaju.oe@gmail.com, oladipupoladokun@gmail.com',
                                subject: 'New TSMB Gift Order',
                                html: Mail
                            }
                        }
            
                        transporter.sendMail(MailgiftEmailData, function (err, info) {
                            if (err) {
                                console.log('Err:'+ err);
                                //res.status(500).send(err); // <----- HERE
                            } else {
                                console.log("Successfully sent email.");
                                //res.status(200).send('Successfully sent email!')//.redirect('login')
                            }
                        });
                    }); 
                }
            });
        }); 
    },
    imageUpload: async function (req, res) {
        //console.log(req.file)
        res.status(200).send('image uploaded');
    },
    pay: async function (req, res) {      
        const payData = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            filename: req.body.filename
        }
        //console.log(payData.filename)
        //res.status(200).send('okay!');
        fs.readFile('./utils/emails/pay.html', { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                console.log('payErr:'+ err);
                res.status(500);
            } else {
                var template = handlebars.compile(html);
                var replacements = {
                    fullName: payData.fullname,
                    email: payData.email,
                    phone: payData.phone
                };
                var Mail = template(replacements),
                    __dirname = './public'
                var MailpayEmailData = {
                    from: db.SMTP_USER,
                    to: 'olanrewaju.oe@gmail.com,oladipupooladokun@gmail.com',
                    subject: 'New Payment Evidence for TSMB',
                    html: Mail,
                    attachments: [{
                        path: __dirname + '/files/' +payData.filename
                    }]
                }
            }

            transporter.sendMail(MailpayEmailData, function (err, info) {
                if (err) {
                    console.log('payErr:'+ err);
                    res.status(500).send(err); // <----- HERE
                } else {
                    console.log("Successfully sent email.");
                    res.status(200).send('Successfully sent email!')//.redirect('login')
                }
            });
        });
    }
}