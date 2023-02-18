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

// 4. Create API key here: https://platform.openai.com/account/api-keys
const OPEN_AI_TOKEN = process.env.OPEN_AI_SESSION_TOKEN;
console.log('ai token: ' + OPEN_AI_TOKEN);

// 5. TELEGRAM_API to send messages
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// 6. WEBHOOK_URL = https://4e96-116-75-124-136.in.ngrok.io/webhook/${token}
// For listening for events at this endpoint
const URI = `/webhook/${TELEGRAM_TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const api = new ChatGPTAPI({
	apiKey: OPEN_AI_TOKEN
});

async function chatGpt(request) {
	console.log('Almighty GPT3, ' + request);
	const res = await api.sendMessage(request);
	console.log('GPT3 answer: ' + res.text);
	return res.text;
}

// run test request to check if it works
chatGpt('hey, are you there?');

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
		const chatGptRes = await chatGpt(req.body.message.text);

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


app.listen(PORT, async () =>{
	console.log(`Server is running on PORT ${PORT}`);
	// Call init everytime the Server starts;
	await init();
} );

