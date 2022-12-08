# ChatGPT Telegram Bot using Nodejs
## To generate TELEGRAM_TOKEN
 - Go to @BotFather chat in telegram
 - /start
 - /newbot
 - Copy the token and save it in .env under TELEGRAM_TOKEN

## To generate SERVER_URL
- use ngrok for local env or some hosting provider like AWS EC2.

## To generate OPEN_AI_SESSION_TOKEN
 - Login in OpenAi's ChatGPT
 - Open Developer Tools
 - Go to application
 - Go to cookies
 - Copy the value of __Secure-next-auth.session-token and save it in .env under OPEN_AI_SESSION_TOKEN
 
 
![alt text](https://github.com/himanshusr/chatGPT_telegram_nodejs/blob/master/images/session-token.png)
## Run
    1.  cd chatgpt_telegram_nodejs
    2.  npm install
    3.  npm run dev



## License

MIT
