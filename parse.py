import os
from os import listdir
from os.path import isfile, join


if __name__ == "__main__":
	dir_path = os.path.dirname(os.path.realpath(__file__))
	messages_path = os.path.join(dir_path, "Messages")
	conversation_dirs = os.listdir(messages_path)
	for dir_name in conversation_dirs:
		convo_path = os.path.join(messages_path, dir_name)
		json_files = [join(convo_path, f) for f in listdir(convo_path) if isfile(join(convo_path, f))]
		for file_path in json_files:
			print(file_path)