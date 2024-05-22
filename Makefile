venv:
	python3.10 -m venv venv
	venv/bin/pip install flask ruff

run:
	venv/bin/flask --debug run --host=0.0.0.0 

lint:
	ruff check