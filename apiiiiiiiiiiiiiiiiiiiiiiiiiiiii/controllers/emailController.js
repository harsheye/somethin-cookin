    const formData = require('form-data');
    const Mailgun = require('mailgun.js');
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'b6fd8ad45d32896a00d10a3a759ac2-3724298e-8968d9ed'});
    
    mg.messages.create('sandbox-123.mailgun.org', {
        from: "Excited User <mailgun@onlinesbii.live>",
        to: ["harshbelaakha@proton.me"],
        subject: "Hello",
        text: "Testing some Mailgun awesomeness!",
        html: "<h1>Testing some Mailgun awesomeness!</h1>"
    })
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err)); // logs any error