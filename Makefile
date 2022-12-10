
run_docker:
	docker compose up

build_mobile_local:
	cd mobile && npm install

run_mobile_local:
	cd mobile && npm start

build_server_local:
	cd server && python -m venv ./venv && source ./venv/bin/activate && pip install -r requirements.txt

run_server_local:
	cd server && python app.py