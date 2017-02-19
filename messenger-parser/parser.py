import json
import os
from os import listdir
from os.path import isfile, join


def createOutputFiles(messages, user_id):
	trainA = open("train.en","a")
	trainB = open("train.fr","a")

	i = 0
	initialized = False
	while i<len(messages):
		if(not initialized):
			if(messages[i]["author"]!=user_id):
				initialized = True
				trainA.write(messages[i]["body"])
		else:
			if(messages[i]["author"]!=user_id and i!=len(messages)-1):
				trainA.write(messages[i]["body"]+"\n")
			else:
				trainB.write(messages[i]["body"]+"\n")
		i+=1
	
def getImportantData(messages):
	tempMessages = []

	for i in range(len(messages)):
		try:
			temp = {}
			temp["body"] = messages[i]["body"].encode('ascii').decode()
			temp["author"] = messages[i]["author"]
			temp["timestamp"] = messages[i]["timestamp"]
			tempMessages.append(temp)
		except:
			pass
		
	return tempMessages

def combineMessages(messages):
	if(len(messages)<2):
		return
	
	i = 1
	while(i<len(messages)):
		try:
			if(messages[i]["author"]==messages[i-1]["author"]):
				temp = {}
				temp["author"] = messages[i]["author"]
				temp["timestamp"] = messages[i]["timestamp"]
				temp["body"] = messages[i-1]["body"]+"\n"+messages[i]["body"]
				messages[i-1:i+1] = []
				messages.insert(i-1, temp)
			else:
				i+=1
		except:
			print(messages[i])
			break

def removeNewLines(messages):
	for i in range(len(messages)):
		messages[i]["body"] = messages[i]["body"].replace("\n", ". ")

def parseJSONFile(textFile, user_id):
	f = open(textFile)

	text = f.read()

	f.close()
	jsonDict = json.loads(text)
	messages = jsonDict['payload']['actions']


	messages = getImportantData(messages)
	
	combineMessages(messages)
	removeNewLines(messages)
	createOutputFiles(messages, user_id)
	
if(__name__=="__main__"):
	#Change fb_id to the id of the chatbot you want to create
	fb_id = "fbid:1593894711"
	dir_path = os.path.dirname(os.path.realpath(__file__))
	messages_path = os.path.join(dir_path, "Messages")
	conversation_dirs = os.listdir(messages_path)
	for dir_name in conversation_dirs:
		convo_path = os.path.join(messages_path, dir_name)
		json_files = [join(convo_path, f) for f in listdir(convo_path) if isfile(join(convo_path, f))]
		for file_path in json_files:
			if "complete" not in file_path:
				print(file_path)    
				parseJSONFile(file_path, fb_id)
