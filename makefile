launch:
	pipenv shell && cd web/backend && python3 app.py
	celery -A web.backend.app.celery worker --loglevel=info


# create a launch task that will run pipenv shell first then run the app.py file
# Path: makefile
launch:
	pipenv shell && cd web/backend && python3 app.py
	celery -A web.backend.app.celery worker --loglevel=info