import json

def get_host():
    host = {}
    with open('context.json', 'r') as host_file:
        host = json.load(host_file)
    return host

def get_rooms():
    rooms = [{ 'name': 'C' , 'network': '192.168.1.0/24', 'machines': 5},{ 'name': 'python' , 'network': '192.168.2.0/24', 'machines': 3},{ 'name': 'javascript' , 'network': '192.168.3.0/24', 'machines': 6},{ 'name': 'bash' , 'network': '192.168.4.0/24', 'machines': 7},{ 'name': 'C++' , 'network': '192.168.5.0/24', 'machines': 7}, { 'name': 'ruby' , 'network': '192.168.5.0/24', 'machines': 7}]
    return rooms
        