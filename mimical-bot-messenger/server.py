# coding: utf-8

import warnings
import os
import json
from flask import Flask, request

import chatbot
import messenger

app = Flask(__name__)
#Sources: https://tsaprailis.com/2016/06/02/How-to-build-and-deploy-a-Facebook-Messenger-bot-with-Python-and-Flask-a-tutorial/
# https://github.com/hult/facebook-chatbot-python

#Page access token
FACEBOOK_TOKEN = os.environ['FACEBOOK_TOKEN']
#Verification token
VERIFY_TOKEN = os.environ['VERIFY_TOKEN']
bot = None

@app.route('/', methods=['GET'])
def handle_verification():
  print "Handling Verification."
  if request.args.get('hub.verify_token', '') == VERIFY_TOKEN:
	print "Verification successful!"
	return request.args.get('hub.challenge', '')
  else:
	print "Verification failed!"
	return 'Error, wrong validation token'

@app.route('/', methods=['POST'])
def webhook():
	print "Handling Messages"
	payload = request.get_data()
	print payload
	for sender, message in messenger.messaging_events(payload):
		print "Incoming from %s: %s" % (sender, message)

		response = bot.respond_to(message)

		print "Outgoing to %s: %s" % (sender, response)
		messenger.send_message(FACEBOOK_TOKEN, sender, response)

	return "ok"

if __name__ == '__main__':
	# Suppress nltk warnings about not enough data
	warnings.filterwarnings('ignore', '.*returning an arbitrary sample.*',)

	if os.path.exists("corpus.txt"):
		bot = chatbot.Bot(open("corpus.txt").read())

	app.run()
