import requests,time, os

# Upload image
url = 'http://localhost:5000/upload'
image_path = os.path.join(os.getcwd(),'example1.png')
files = {'file': open('./example1.png', 'rb')}
response = requests.post(url, files=files)
print(response)
task_id = response.json()['task_id']

# Check task status
url = f'http://localhost:5000/task/{task_id}'
response = requests.get(url)

print(response.json())
# Wait for task to complete
while response.json()['status'] == 'Task is pending':
    time.sleep(2)
    response = requests.get(url)
    print(response.json())
