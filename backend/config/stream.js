const { StreamChat } = require('stream-chat');
require("dotenv").config();

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret) {
    console.error("Stream API Key or Secret is Missing..!");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret); //* Create stream instance

//* Function for create or update stream user..
const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]); // create user and if user exists --> Update it
        return userData
    } catch (err) {
        console.error("Error Creating / Updating Stream User:", err.message)
    }
};

//* Function for generating stream token for the user
//* This token is used to authenticate the user with Stream Chat
const generateStreamToken = async (userId) => {
    try {
        const userIdStr = userId.toString(); // Convert userId to string
        const token = streamClient.createToken(userIdStr); // Generate token for the user
        return token;
    } catch (err) {
        console.error("Error Generating Stream Token:", err.message);
    }
}


module.exports = {
    upsertStreamUser,
    generateStreamToken
};
