# mimical-bot
Generate a chatbot that sounds like you based on your messenger history using the power of recurrent neural nets!

### Inspiration
One popular application of recurrent neural networks (RNNs) is generating text in the style of another author, such as Shakespeare or J.K.Rowling. All you need is a huge corpus of training text by the author.  Well what if you could generate text that sounds like you? Or better yet, have a chatbot that sounds like you! Why would you want a chatbot that talks like you?  
Here are a few reasons:  
* You could laugh at how often you use :D emoticons   
* Friends and family could talk to your chatbot when they miss you and you are not around  
* If you are busy, you could use your chatbot to auto-reply to people on your behalf! (feature coming soon :P)

### What it does
This system allows you to create your very own chatbot and then converse with it.  

### How we built it
The way it works is through a Chrome extension that allows a flask server running in AWS to download your FB message history. Next we parse the message history into a training corpus AWS and then train a model using your messages. The model then acts as a chatbot through a AWS webhook that talks to FB messenger. 

###Technical Overview
Chrome extension gets cookie info and request params (like _rev, _req, etc) and conversation ids from the page.

Then POSTs these along with chatbot name and password and isPublic to an api endpoint (BACKEND) that starts processing all of these.

API processes this by:

* Scraping message corpus

* Parsing message corpus and training a model

* Saving the model file to an AWS Bucket

* Storing chatbot name, password, and filename in a DB

API also has these endpoints:

 ```
 /getPublicChatbots()
 ```

Returns list of available chatbots

```
/getPublicModel(chatbotName)
```

Returns id of AWS bucket file
```
/getModel(chatbotName, password)
```

Returns id of AWS bucket file

CHATBOT webhook (python) is on separate AWS server that can call this BACKEND server and has access to AWS buckets.

The chatbot runs in a while loop? It starts with this prompt and has a global field that loads a model

#####Chatbot:

Hi! Who would you like to talk to?

Type "%show all" to list all available public personas. 

This persona is password protected. Please enter a password.

You are now chatting with ____. Type "%restart" to pick a new persona.

#####Processing Text Corpus:

Use timestamp differences to find out if the chatbot-persona-user is starting the conversation or responding.

Use switches in userid to figure out what the question is vs the answer. 
