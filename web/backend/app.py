from flask import Flask, request, jsonify
from flask_uploads import UploadSet, IMAGES, configure_uploads
from celery import Celery
import time

app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'
app.config['UPLOADED_IMAGES_DEST'] = 'uploads/images'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

images = UploadSet('images', IMAGES)
configure_uploads(app, images)

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'], backend=app.config['CELERY_RESULT_BACKEND'])

@celery.task(bind=True)
def process_image(self, filename):
    with app.app_context():
        image_path = images.path(filename)
        total_steps = 10 # total number of processing steps
        for i in range(total_steps):
            time.sleep(1) # example of a processing step
            progress = int((i+1)/total_steps*100)
            self.update_state(state='PROGRESS', meta={'progress': progress})
        return {'result': 'success'}

@app.route('/upload-image', methods=['POST'])
def upload_image():
    print(request.files)
    if 'image' not in request.files:
        return 'No image found', 400

    image = request.files['image']

    if not images.file_allowed(image, image.filename):
        return 'Invalid file type', 400

    filename = images.save(image)

    # Create a new Celery task to process the image
    task = process_image.apply_async(args=[filename])

    return jsonify({'task_id': task.id})

@app.route('/task-status/<task_id>')
def task_status(task_id):
    task = process_image.AsyncResult(task_id)

    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'progress': 0
        }
    elif task.state == 'SUCCESS':
        response = {
            'state': task.state,
            'result': task.result
        }
    else:
        response = {
            'state': task.state,
            'progress': task.info.get('progress', 0),
            'status': str(task.info.get('status', ''))
        }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True,port=8000)
