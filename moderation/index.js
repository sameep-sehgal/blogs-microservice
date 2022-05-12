const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/events', async (req,res) => {
    const {type, data} = req.body;

    if(type == 'CommentCreated') {
        const {content} = data;
        const status = content.includes('orange')? 'rejected': 'approved';

        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {...data, status}
        });
    }

    res.status(202);
})


app.listen(4003, () => {
    console.log("Listening on Port 4003 -- Moderation Service");
});