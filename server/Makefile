SHELL := /bin/bash

run-serve-asgi:
	uvicorn server.asgi:application --host 0.0.0.0 --port 8000

# Django
runserver:
	./manage.py runserver 0.0.0.0:8000