import requests,time

# Upload image
url = 'http://localhost:8000/upload-image'
files = {'image': open('./image.png', 'rb')}
response = requests.post(url, files=files)
print(response)
task_id = response.json()['task_id']

# Check task status
url = f'http://localhost:8000/task-status/865bd913-b132-4415-8d4f-3cdeccaecbbf'
response = requests.get(url)

print(response.json())
# Wait for task to complete
while response.json()['state'] not in ['SUCCESS', 'FAILURE']:
    time.sleep(2)
    response = requests.get(url)
    print(response.json())
