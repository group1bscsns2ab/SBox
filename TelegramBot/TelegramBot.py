import telegram.ext
import requests
import os

URL = "https://api-group1bscsns2ab.herokuapp.com/"

HEADERS = {
	'x-api-key': os.environ['API-KEY']
}

TOKEN = os.environ['TOKEN']

def start(update, context):
	update.message.reply_text("SBox by BSCSNS2AB - Group 1\n\nEnter /help to get all the available commands.")

def help(update, context):
	update.message.reply_text('/update_api_key <api-key> - updates API key needed for authentication.\n\n'\
							  '/update_login <email> <password> - updates login information needed for authentication.\n\n'\
							  '/authenticate <method> (login/api-key) - authenticates then entered credentials (API key/Login Information).\n\n'\
							  '/update_credentials - update App Key and App Secret Key.\n\n'\
							  '/get_credentials - get App Key and App Secret Key.\n\n'\
							  '/update_devices - updates the list of devices.\n\n'\
							  '/get_devices - get the list of devices.\n\n'\
							  '/update_pc_address <ipaddress> <macaddress> - updates PC ipaddress and mac address.\n\n'\
							  '/get_pc_address - get pc address.\n\n'\
							  '/reset - Reset all information.\n\n'\
							  'Proper Execution:\n'\
							  '1. /update_api_key <api-key> OR /update_login <email> <password>\n'\
							  '2. /authenticate <method> (login/api-key)\n'\
							  '3. /update_credentials\n'\
							  '4. /update_devices\n'\
							  '5. /update_pc_address <ipaddress> <macaddress>')

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
	
	devices = ""

	for index, device in enumerate(response['devices'], start=0):
		if index == 0:
			devices += f"\n[PC]\nNAME: {device[1]}\nID: {device[0]}\n\n"
		else:
			devices += f"NAME: {device[1]}\nID: {device[0]}\n\n"

	if response["success"]:
		update.message.reply_text(f"You have {len(response['devices'])} devices\n" + devices)
	else:
		update.message.reply_text(response["message"])

def get_devices(update, context):
	endpoint = URL + "device/get"

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()

	devices = ""

	for index, device in enumerate(response['devices'], start=0):
		if index == 0:
			devices += f"\n[PC]\nNAME: {device[1]}\nID: {device[0]}\n\n"
		else:
			devices += f"NAME: {device[1]}\nID: {device[0]}\n\n"
		

	if response["success"]:
		update.message.reply_text(f"You have {len(response['devices'])} devices\n" + devices)
	else:
		update.message.reply_text(response["message"])

def update_pc_address(update, context):
	endpoint = URL + f"device/PC/{context.args[0]}/{context.args[1]}" 

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()

	update.message.reply_text(response["message"])

def get_pc_address(update, context):
	endpoint = URL + "device/PC/get" 

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()

	update.message.reply_text(f"IP ADDRESS: {response['PC'][0]}\nMAC ADDRESS: {response['PC'][1]}")

def reset(update, context):
	endpoint = URL + "device/reset"

	request = requests.get(url=endpoint, headers=HEADERS)
	response = request.json()

	update.message.reply_text(response["message"])

def unknown(update, context):
	update.message.reply_text("Unknown command. Type /help to get the list of all available command.")


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
disp.add_handler(telegram.ext.CommandHandler("update_pc_address", update_pc_address))
disp.add_handler(telegram.ext.CommandHandler("get_pc_address", get_pc_address))
disp.add_handler(telegram.ext.CommandHandler("reset", reset))
disp.add_handler(telegram.ext.MessageHandler(telegram.ext.Filters.command, unknown))

updater.start_polling()
updater.idle()