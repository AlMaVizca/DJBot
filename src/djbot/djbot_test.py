import os
import djbot
import unittest
import tempfile
from db import *


class DjbotTestCase(unittest.TestCase):

    def setUp(self):
        self.db_fd, djbot.app.config['DATABASE'] = tempfile.mkstemp()
        djbot.app.config['TESTING'] = True
        self.app = djbot.app.test_client()
        djbot.init_db(djbot.app.config['DATABASE'])


    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(djbot.app.config['DATABASE'])

    def test_data(self):
        rooms = self.app.get('/api/room/')
            
        self.assertDictEqual(rooms, {"rooms":[]})    
        

    def test_ansible(self):
        pass
        
if __name__ == '__main__':
    unittest.main()
