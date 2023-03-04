
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

# Must run 'make build_mobile_local' first
run_server_dummy:
	cd mobile && node dserver.js

clean:
	cd mobile && npm prune && rm -rf node_modules package-lock.json
	cd server && rm -rf ./venv ./.venv