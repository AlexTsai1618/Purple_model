import os
import unittest
import requests

class TestApp(unittest.TestCase):

    def test_attack_status(self):
        response = requests.get('http://127.0.0.1:8000/attack/status/task_id')
        self.assertEqual(response.status_code, 202) # Check that the status is 'PENDING' for a new task
        response = requests.get('http://127.0.0.1:8000/attack/status/task_id')
        self.assertEqual(response.status_code, 200) # Check that the status is 'SUCCESS' for a completed task
        self.assertIn('image_result_url', response.json()) # Check that the response includes the expected key

    def test_defend(self):
        with open('example1.png', 'rb') as f:
            files = {'image': f}
            response = requests.post('http://127.0.0.1:8000/defense/upload-image', files=files)
        self.assertEqual(response.status_code, 200) # Check that the response status is OK
        self.assertTrue(response.json()['success']) # Check that the response indicates success
        self.assertIn('image_url', response.json()) # Check that the response includes the expected key
        self.assertTrue(os.path.exists('static/uploads/example1.png')) # Check that the image file was saved
        self.assertTrue(os.path.exists('static/results/example1_d.png')) # Check that the modified image file was saved
