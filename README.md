# mimical-bot
Messenger chatbot generator  

####How it works
Chrome extension gets cookie info and request params (like _rev, _req, etc) and conversation ids from the page.

Then POSTs these along with chatbot name and password and isPublic to an api endpoint (BACKEND) that starts processing all of these.

API processes this by:

*Scraping message corpus

*Parsing message corpus and training a model

*Saving the model file to an AWS Bucket

*Storing chatbot name, password, and filename in a DB

API also has these endpoints:

'''/getPublicChatbots()''' 

Returns list of available chatbots

/getPublicModel(chatbotName)

Returns id of AWS bucket file

/getModel(chatbotName, password)

Returns id of AWS bucket file

CHATBOT webhook (python) is on separate AWS server that can call this BACKEND server and has access to AWS buckets.

The chatbot runs in a while loop? It starts with this prompt and has a global field that loads a model

Chatbot:

Hi! Who would you like to talk to?

Type "%show all" to list all available public personas. 

This persona is password protected. Please enter a password.

You are now chatting with ____. Type "%restart" to pick a new persona.

Processing Text Corpus:

Use timestamp differences to find out if the chatbot-persona-user is starting the conversation or responding.

Use switches in userid to figure out what the question is vs the answer. 
