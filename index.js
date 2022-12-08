import * as dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { ChatGPTAPI } from 'chatgpt';

dotenv.config();

// 1. TELEGRAM TOKEN, generate this by going to @BotFather in telegram -> /start -> /newbot
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

// 2. SERVER_URL, it is a fixed url for webhook. Generate it by using ngrok in local or use any
// hosting provider like EC2.
const SERVER_URL = process.env.SERVER_URL;

// 3. PORT, to run your nodejs app
const PORT = process.env.PORT || 5000;

// 4. Session token for chatGPT, to get this got to browser, openChat GPT site,
// open developer tools -> Application -> cookies -> __Secure-next-auth.session-token => Copy the value 
const SESSION_TOKEN = process.env.OPEN_AI_SESSION_TOKEN;

// 5. TELEGRAM_API to send messages 
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// 6. WEBHOOK_URL = https://4e96-116-75-124-136.in.ngrok.io/webhook/${token}
// For listening for events at this endpoint
const URI = `/webhook/${TELEGRAM_TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));


// Intialise the telgram bot by setting up the webhook

const init = async () => {
	const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
	console.log(res.data);
}

// @route: https://4e96-116-75-124-136.in.ngrok.io/webhook/${token}
// @desc: Listening to the webhook events at URI
// @access: public

app.post(URI, async (req, res) => {
	const chatId = req.body.message.chat.id;
	try {
		// Console.log the incoming message
		console.log(req.body);

		// Get chatGPT response by sending message.text
		const chatGptRes = await chatGpt(req.body.message);

		// Take the chatGPT response and send it to the telegram bot
		await axios.post(`${TELEGRAM_API}/sendMessage`, {
			chat_id: chatId,
			text: chatGptRes
		})
		return res.send();
	} catch (error) {
		console.log('Error: ', error);
			// Ping the user that error has occured.
		await axios.post(`${TELEGRAM_API}/sendMessage`, {
			chat_id: chatId,
			text: 'An Error Occurred!'
		});
		return res.send();
	}
});


// Sending prompts to chatGPT and returning responses

const chatGpt = async (message) => {
	try {
		// intialise the new ChatGPTAPI using session token
		const api = new ChatGPTAPI({ sessionToken: SESSION_TOKEN })
		await api.ensureAuth();
		// await response from chatGPT by passing in message.text as prompt
		const response = await api.sendMessage(message.text)
		console.log(response);
		return Promise.resolve(response);
	} catch (err) {
		console.log('Error in chatGPT: ', err)
		return Promise.reject(err);
	}
}

app.listen(PORT, async () =>{
	console.log(`Server is running on PORT ${PORT}`);
	// Call init everytime the Server starts;
	await init();
} );

