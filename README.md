# ChatGPT Telegram Bot using Nodejs
## To generate TELEGRAM_TOKEN
 - Go to @BotFather chat in telegram
 - /start
 - /newbot
 - Copy the token and save it in .env under TELEGRAM_TOKEN

## To generate OPEN_AI_SESSION_TOKEN
 - go here, create account, create token https://platform.openai.com/account/api-keys

## To generate SERVER_URL
- use ngrok for local env or some hosting provider like AWS EC2.

## How to use on local machine with ngrok
brew install ngrok

### Create account on https://ngrok.com/, add token
ngrok config add-authtoken _your token from dashboard_

### Launch ngrok local connection (default port 8000)
ngrok http _http server port from .env_

### Copy ngrok url (forwarding line)
_random-generated-letters_.eu.ngrok.io

### Put ngrok url (without https://) to .env
SERVER_URL='_blablabla_.eu.ngrok.io'

## Run
    1.  git clone https://github.com/himanshusr/chatGPT_telegram_nodejs.git
    2.  cd chatgpt_telegram_nodejs
    3.  npm install
    4.  cp .env.sample .env
    5.  npm run dev

## License

MIT
