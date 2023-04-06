import requests,os,time

url = "http://localhost:8000/attack/upload-image"
image_path = os.path.join(os.getcwd(),'example1.png')
files = {'image': open(image_path, 'rb')}
response = requests.post(url, files=files)
print(response.json())
print("------------------")
task_id = response.json()['task_id']
print(task_id)
print("------------------")

url = f'http://localhost:8000/attack/status/{task_id}'

while True:
    response = requests.get(url)
    if response.status_code == 200:
        print(response.json()['success'])
        break
    time.sleep(1) 