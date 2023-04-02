import * as dotenv from 'dotenv';
import express, { request } from 'express';
import axios from 'axios';
import { ChatGPTAPI } from 'chatgpt';
import { BingChat } from 'bing-chat'

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

const chatGptApi = new ChatGPTAPI({
	apiKey: OPEN_AI_TOKEN
});

const bingApi = new BingChat({
	cookie: process.env.BING_COOKIE
});

async function chatGpt(request) {
	const res = await chatGptApi.sendMessage(request);
	return res.text;
}

async function bingGpt(request) {
	const res = await bingApi.sendMessage(request);
	// console.log(JSON.stringify(res));
	console.log(res.text);
	return res.text;
}

const activeGpt = bingGpt;

// run test request to check if it works
const test = activeGpt('hey, are you there?');
console.log(test);


// Intialise the telgram bot by setting up the webhook
const initTelegramApi = async () => {
	const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
	console.log(res.data);
}

function initExpress() {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: false}));
	// @route: https://4e96-116-75-124-136.in.ngrok.io/webhook/${token}
	// @desc: Listening to the webhook events at URI
	// @access: public

	app.post(URI, async (req, res) => {
		const chatId = req.body.message.chat.id;
		try {
			// Console.log the incoming message
			console.log(req.body);
			const request = req.body.message.text;
			console.log('Almighty GPT, ' + request);
			const gptRes = await activeGpt(request);
			console.log('GPT answer: ' + res.text);

			// Take the chatGPT response and send it to the telegram bot
			await axios.post(`${TELEGRAM_API}/sendMessage`, {
				chat_id: chatId,
				text: gptRes
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
		await initTelegramApi();
	} );
}
initExpress();

