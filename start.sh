#!/bin/bash

# Install required packages
pip install pipenv
pipenv install

# Activate virtual environment
pipenv shell && cd web/backend && celery -A app.celery worker --loglevel=info && python3 ./web/backend/app.py

