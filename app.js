const client = require('@mailchimp/mailchimp_marketing');
const express = require('express');
const app = express();
const port = 3500;
const API_Key = process.env.APIKEY;
const Server_Number = process.env.SERVER;
const List = process.env.LIST;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

client.setConfig({
    apiKey: API_Key,
    server: Server_Number,
});

app.post('/', (req, res) => {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    console.log(firstName, lastName, email, password);

    const subscribingUser = { firstName: firstName, lastName: lastName, email: email, password: password };

    const run = async() => {
        try {
            const response = await client.lists.addListMember(List, {
                email_address: subscribingUser.email,
                password_num: subscribingUser.password,
                status: 'subscribed',
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName,
                },
            });
            console.log(response);
            res.sendFile(__dirname + '/success.html');
        } catch (err) {
            console.log(err.status);
            res.sendFile(__dirname + '/failure.html');
        }
    };
    run();
});

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running of port ${port}`);
});