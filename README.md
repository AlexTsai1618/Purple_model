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
cd web/backend
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
- [x] original image preview
- [x] progress bar (discuss)
- [x] Pipline intergration (attack)
- [ ] Pipline intergration (defense)
- [ ] Pipline celery get task.info
- [ ] backend send image to frontend