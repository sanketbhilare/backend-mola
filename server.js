import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 6161;
const app = express();

app.use(cors());
const corsOptions = {
    origin: "http://localhost:3000"
};

const requestEndpointFindUser = "https://api.twitter.com/2/users/by/username/";
const headers = {
    "Authorization": "Bearer " + process.env.Bearer_Token,
}

app.post('/findUser', cors(corsOptions), async (req, res) => {
    const userName = req.query.username;
    const url = requestEndpointFindUser+userName;
    var fetchOptions = {
        method: 'GET',
        headers: headers
    }
    var response = await fetch(url, fetchOptions);
    var jsonResponse = await response.json();
    var data = jsonResponse.data
    if(data != null && data.username === userName) {
        const requestEndpointUserTweets = `https://api.twitter.com/2/users/${data.id}/tweets`;
        fetchOptions.params = {
            "max_results": 10,
        }
        response = await fetch(requestEndpointUserTweets, fetchOptions);
        jsonResponse = await response.json();
        res.json(jsonResponse);
    } else {
        res.json({status: 404, text:"User not found"});
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});