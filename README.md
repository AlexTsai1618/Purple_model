# Purple_model

### How to use

1. Install the required packages

```bash
pip install pipenv
pipenv install
```
2. Run the virtual environment

```bash
pipenv shell
```
3. Run celery

```bash
celery -A app.celery worker --loglevel=info
```

4. Run the web
```bash
python3 ./web/backend/app.py
```

### How to install extra packages

```bash
pipenv install <package_name>
```

Todo:
### Web
- [ ] original image preview
- [ ] progress bar
- [ ] backend send image to frontend