import telegram.ext
import requests

URL = "https://api-group1bscsns2ab.herokuapp.com/"

HEADERS = {
	'x-api-key': "4A0YrrysiZeGgbOVm?gQEtROcOoJvxRShGeFIL?7xtWEWXX9U0x9DmXH?nP0s0MI"
}

TOKEN = "5518955473:AAFnINxMGnTkvLpoDfXe3EGFC4h8Fx2AvR4"

def start(update, context):
	update.message.reply_text("Welcome to Group 1: Project Telegram Bot\n\nEnter /help to get all the available commands.")

def help(update, context):
	update.message.reply_text('/update_api_key <api-key> - Updates API key needed for authentication.\n\n'\
							  '/update_login <username> <password> - Updates login information needed for authentication.\n\n'\
							  '/authenticate <method> (login/api-key) - Authenticates then entered credentials (API key/Login Information).\n\n'\
							  '/update_credentials - Update App Key and App Secret Key.\n\n'\
							  '/get_credentials - Get App Key and App Secret Key.\n\n'\
							  '/update_devices - Updates the list of devices.\n\n'\
							  '/get_devices - Get the list of devices.\n\n'\
							  '/reset - Reset all information.\n\n'\
							  '/wol - Trigger wake on lan\n\n'\
							  '/pc_state - Returns PC state\n\n'\
							  'Proper Execution:\n1. /update_api_key or /update_login\n2. /authenticate <method>\n3. /update_credentials\n4. /update_devices')

def update_api_key(update, context):
	params = {
		'apiKey': context.args[0]
	}

	endpoint = URL + "authentication/update/apiKey"

	request = requests.post(url=endpoint, data=params, headers=HEADERS)
	response = request.json()

	update.message.reply_text(response["message"])

def update_login(update, context):
	params = {
		'username': context.args[0],
		'password': context.args[1]
	}

	endpoint = URL + "authentication/update/login"

	request = requests.post(url=endpoint, data=params, headers=HEADERS)
	response = request.json()

	if response["success"]:
		update.message.reply_text("Login information updated.")
	else:
		update.message.reply_text(response["message"])

def authenticate(update, context):
	endpoint = URL + f"authentication/authenticate/{context.args[0]}"

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()

	update.message.reply_text(response["message"])

def update_credentials(update, context):
	endpoint = URL + "credential/update"

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()

	if response["success"]:
		update.message.reply_text(response["message"]);
	else:
		update.message.reply_text(response["message"]);

def get_credentials(update, context):
	endpoint = URL + "credential/get"

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()

	if response["success"]:
		update.message.reply_text(f"APP KEY: { response['appkey'] }\nAPP SECRET: {response['appsecert']}");
	else:
		update.message.reply_text(response["message"]);

def update_devices(update, context):
	endpoint = URL + "device/update"

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()
	
	if response["success"]:
		update.message.reply_text(f"[Update Success].\nYou have {len(response['devices'])} Devices \nDevices: \n{response['devices']}")
	else:
		update.message.reply_text(response["message"])

def get_devices(update, context):
	endpoint = URL + "device/get"

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()
	
	if response["success"]:
		update.message.reply_text(f"You have {len(response['devices'])} Devices \nDevices:\n{response['devices']}")
	else:
		update.message.reply_text(response["message"])

def wol(update, context):
	endpoint = URL +"device/wol/toggle"

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()

	update.message.reply_text(response["message"])

def pc_state(update, context):
	endpoint = URL +"device/pc_state/get"

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()

	if response["value"]:
		update.message.reply_text("PC-STATE: On")
	else:
		update.message.reply_text("PC-STATE: Off")

def reset(update, context):
	endpoint = URL + "device/reset"

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()

	update.message.reply_text(response["message"])


updater = telegram.ext.Updater(TOKEN, use_context=True)
disp = updater.dispatcher

disp.add_handler(telegram.ext.CommandHandler("start", start))
disp.add_handler(telegram.ext.CommandHandler("help", help))
disp.add_handler(telegram.ext.CommandHandler("update_api_key", update_api_key))
disp.add_handler(telegram.ext.CommandHandler("update_login", update_login))
disp.add_handler(telegram.ext.CommandHandler("authenticate", authenticate))
disp.add_handler(telegram.ext.CommandHandler("update_credentials", update_credentials))
disp.add_handler(telegram.ext.CommandHandler("get_credentials", get_credentials))
disp.add_handler(telegram.ext.CommandHandler("update_devices", update_devices))
disp.add_handler(telegram.ext.CommandHandler("get_devices", get_devices))
disp.add_handler(telegram.ext.CommandHandler("wol", wol))
disp.add_handler(telegram.ext.CommandHandler("pc_state", pc_state))
disp.add_handler(telegram.ext.CommandHandler("reset", reset))

updater.start_polling()
updater.idle()