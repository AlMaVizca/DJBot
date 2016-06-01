#!/usr/bin/python2
import json
from ansibleapi import *

class Host():
    def __init__(self, address='127.0.0.1'):
        self.address = address
    
    def get_setup(self):
        inventory = [self.address]
        ansible_game = Runner(inventory, 'avizcaino')
        ansible_game.add_setup(inventory)
        ansible_game.run()
        data = ansible_game.get_setup()
        memory = data["ansible_memory_mb"]["real"]["free"]
        lsb = data["ansible_lsb"]["description"]
        devices = data["ansible_devices"]["sda"]["host"]
        host = {
            "hostname": data["ansible_hostname"],
            "memory": memory,
            "lsb": lsb,
            "devices": devices,
        }
        return host
        






