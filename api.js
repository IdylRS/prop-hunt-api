const express = require('express');
const app = express();
const fs = require("fs");
const PORT = 8080;

app.use(express.json())

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

app.get('/prop-hunters/:users', (req, res) => {
    const { users } = req.params;

    console.log(`Getting users: ${users}`);

    const propHunters = getPropHuntUser(users);

    if(!propHunters) {
        res.status(418).send({ message: 'No users with those usernames found.' });
    }

    res.status(200).send(JSON.stringify(propHunters));
    
    return;
});

app.get('/prop-hunters', (req, res) => {
    const propHunters = getPropHuntFile();
    res.status(200).send(JSON.stringify(propHunters));
});

app.post('/prop-hunters/:user', (req, res) => {
    const { user } = req.params;
    const update = req.body;

    user.replaceAll('%20', ' ');

    if(!update) {
        res.status(418).send({ message: 'No data sent to update '});
    }

    const updatedUser = updatePropHuntUser(user, update);

    res.status(200).send(updatedUser);
});

const getPropHuntFile = () => {
    const file = fs.readFileSync("./prop-hunters.json");

    return JSON.parse(file);
}

const getPropHuntUser = (users) => {
    const userList = users.split(",");
    const hunters = getPropHuntFile();

    return userList.map(u => hunters[u]).filter(n => n);
}

const updatePropHuntUser = (user, data) => {
    let propHunters = getPropHuntFile();

    propHunters[user] = data;

    fs.writeFileSync('./prop-hunters.json', JSON.stringify(propHunters));

    return propHunters[user];
}