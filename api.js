const express = require('express');
const app = express();
const fs = require("fs");
const PORT = 8080;

app.use(express.json())

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

app.get('/prop-hunters/:user', (req, res) => {
    const { user } = req.params;

    const propHunters = getPropHuntUser(user);

    if(!propHunters) {
        res.status(418).send({ message: 'No user with that username found.' });
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
    const { update } = req.body;

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

const getPropHuntUser = (user) => {
    const hunters = getPropHuntFile();

    return hunters[user];
}

const updatePropHuntUser = (user, data) => {
    let propHunters = getPropHuntFile();

    propHunters[user] = data;

    fs.writeFileSync('./prop-hunters.json', JSON.stringify(propHunters));

    return propHunters[user];
}