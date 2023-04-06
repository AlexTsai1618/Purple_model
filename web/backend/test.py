
import requests

def test_attack():
    # Upload image
    with open('example1.png', 'rb') as f:
        files = {'image': f}
        response = requests.post('http://localhost:8000/attack/upload-image', files=files)
        assert response.status_code == 200

        # Get task_id from response
        task_id = response.json()['task_id']

    # Check status (PENDING, then SUCCESS)
    response = requests.get(f'http://localhost:8000/attack/status/{task_id}')
    assert response.status_code == 200
    assert response.json()['success'] == True

    # Get image result URL from response
    image_result_url = response.json()['image_result_url']
    assert image_result_url.startswith('http://localhost:8000/result/images/')
    assert image_result_url.endswith('.png')

if __name__ == '__main__':
    test_attack()