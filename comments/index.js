const express = require('express');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const comments = {};

app.get('/posts/:title/comments', (req, res) => {
    res.send(comments[req.params.title] || []);
});

app.post('/posts/:title/comments', async (req, res) => {
    const {content} = req.body;
    const postTitle = req.params.title;
    const currComments = comments[postTitle] || [];
    const status = 'pending';
    const comment = {content, postTitle, status};

    currComments.push(comment);

    comments[postTitle] = currComments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: comment
    });

    res.status(201).send(currComments);
});

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    console.log('Event Received -- ' + type);

    if(type === 'CommentModerated') {
        const {postTitle, status, content} = data;

        const currComments = comments[postTitle]
        const comment = currComments.find(comment => {
            return comment.content === content;
        });

        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type:'CommentUpdated',
            data: {content, status, postTitle}
        })
    }

    //Status 202 means request is accepted
    res.status(202);
});

app.listen(4001, () => {
    console.log("Listening on port 4001");
});