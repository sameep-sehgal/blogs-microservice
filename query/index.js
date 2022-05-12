const express = require('express');
const cors = require('cors');
const { response } = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if(type === 'PostCreated') {
        const {postTitle, body} = data;

        posts[postTitle] = {postTitle, body, comments:[]};
    }

    if(type === 'CommentCreated') {
        const {content, postTitle, status} = data;

        posts[postTitle].comments.push({content, status});
    }

    if(type === 'CommentUpdated') {
        const {content, postTitle, status} = data;

        const post = posts[postTitle];
        const comments = post.comments;
        
        for(let i = 0; i < comments.length; i++) {
            if(comments[i].content === content)
                comments[i].status = status;
        }
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    console.log('Event Received -- ' + type);
    
    handleEvent(type, data);

    //Status 202 means request is accepted
    res.status(202);
});

app.listen(4002, async () => {
    console.log('Listening on Port 4002.');
    
    console.log('Getting all the missed events.');
    const response = await axios.get('http://localhost:4005/events');

    for(let event of response.data)
        handleEvent(event.type, event.data);

    console.log('All the missed events handled.');
});