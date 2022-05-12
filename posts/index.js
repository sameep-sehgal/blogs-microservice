const express = require('express');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const {postTitle, body} = req.body;

    posts[postTitle] = {postTitle, body};

    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {postTitle, body}
    });

    //Status 201 means a new resouce is created
    res.status(201).send(posts[postTitle]);
});

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    console.log('Event Received -- ' + type);
    console.log('Data -- ' + data);

    //Status 202 means request is accepted
    res.status(202);
});

app.listen(4000, () => {
    console.log('Listening on post 4000.')
});