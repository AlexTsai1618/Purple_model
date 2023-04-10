import os,time
from flask import render_template, request, jsonify, make_response, send_from_directory
from celery.result import AsyncResult
from flask import Flask, request, jsonify, current_app
from flask_uploads import UploadSet, IMAGES, configure_uploads
from flask_cors import CORS
from celery import Celery
import time
from attack import Attack
from defense import Defense
app = Flask(__name__, static_url_path='/static')
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['UPLOADED_IMAGES_DEST'] = 'static/uploads'
app.config['UPLOADS_DEFAULT_URL'] = 'http://localhost:5000/static/uploads'
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['CELERY_BROKER_URL'] = 'amqp://guest@localhost//'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'], backend=app.config['CELERY_RESULT_BACKEND'])
celery.conf.update(app.config)
images = UploadSet('images', IMAGES)
configure_uploads(app, images)

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'], backend=app.config['CELERY_RESULT_BACKEND'])

@celery.task(bind=True)
def process_image(self, filename):
    print('hello')
    with app.app_context():
        image_path = images.path(filename)
        total_steps = 10 # total number of processing steps
        for i in range(total_steps):
            time.sleep(1) # example of a processing step
            progress = int((i+1)/total_steps*100)
            self.update_state(state='PROGRESS', meta={'progress': progress})
        return {'result': 'success'}

@celery.task(bind=True)
def attack(self, input_file, output_file,filename):
    with app.app_context():
        # self.update_state(state='PROGRESS')
        Attack(input_file, output_file).run()
        print("attack done")
        # self.update_state(state='PROGRESS', meta={'progress': 50})
        image_result_url = "http://localhost:8000/result/images/"+ filename
        return self.update_state(state='SUCCESS',meta={'result': image_result_url})


@celery.task(bind=True)
def defend(self, input_file, output_file,filename):
    with app.app_context():
        # self.update_state(state='PROGRESS')
        Defense(input_file, output_file).run()
        print("attack done")
        # self.update_state(state='PROGRESS', meta={'progress': 50})
        image_result_url = "http://localhost:8000/result/images/"+ filename
        return self.update_state(state='SUCCESS',meta={'result': image_result_url})
        




@app.route('/attack/upload-image', methods=['POST'])
    
def upload_attack_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No image found'}), 400

    image = request.files['image']

    filename = images.save(image)
    # Create a new Celery task to process the image
    print(os.path.join(os.getcwd(),'uploads',filename))
    output_file = os.path.join(os.getcwd(),'static','results',filename.split('.')[0] + "_a"+'.png')
    task = attack.delay(os.path.join(os.getcwd(),'static','uploads',filename), output_file,filename.split('.')[0] + "_a"+'.png')
    
    image_upload_url = "http://localhost:8000/upload/images/"+filename
    
    return jsonify({'success': True,'image_upload_url':image_upload_url,'task_id': task.task_id}),200

    # return jsonify({'success': True,'image_upload_url':image_upload_url}),200

@app.route('/attack/status/<task_id>')
def attack_status(task_id):
    
    task = AsyncResult(task_id, app=celery)
    print(task.state)
    # return jsonify({'success': True}),200
    if task.state == 'SUCCESS':
        meta = task._get_task_meta()
        result = meta.get("result")
        return jsonify({'status': 'SUCCESS','success': True,'image_result_url':result}),200
    elif task.state == 'PENDING':
        return jsonify({'status': 'PENDING','success': False, }), 202
    else:
        return jsonify({'status': 'FAIL','success': False}), 404



@app.route('/defense/upload-image', methods=['POST'])
def upload_defend_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No image found'}), 400

    image = request.files['image']

    filename = images.save(image)
    # Create a new Celery task to process the image
    print(os.path.join(os.getcwd(),'uploads',filename))
    output_file = os.path.join(os.getcwd(),'static','results',filename.split('.')[0] + "_d"+'.png')
    task = defend.delay(os.path.join(os.getcwd(),'static','uploads',filename), output_file,filename.split('.')[0] + "_d"+'.png')
    
    image_upload_url = "http://localhost:8000/upload/images/"+filename
    
    return jsonify({'success': True,'image_upload_url':image_upload_url,'task_id': task.task_id}),200



@app.route('/defense/status/<task_id>')
def defense_status(task_id):
    
    task = AsyncResult(task_id, app=celery)
    print(task.state)
    if task.state == 'SUCCESS':
        meta = task._get_task_meta()
        result = meta.get("result")
        return jsonify({'status': 'SUCCESS','success': True,'image_result_url':result}),200
    elif task.state == 'PENDING':
        return jsonify({'status': 'PENDING','success': False, }), 202
    else:
        return jsonify({'status': 'FAIL','success': False}), 404


@app.route('/result/images/<path:filename>')
def get_result_image(filename):
    return send_from_directory(os.path.join(os.getcwd(),'static','results'), filename)


@app.route('/upload/images/<path:filename>')
def get_upload_image(filename):
    return send_from_directory(os.path.join(os.getcwd(),'static','uploads'), filename)


if __name__ == '__main__':
    app.run(debug=True,port=8000)


