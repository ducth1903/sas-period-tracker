
run_docker:
	docker compose up

build_mobile_local:
	cd mobile && npm install

run_mobile_local:
	cd mobile && npm start

# This will clear cache (take longer)
run_mobile_local_clear_cache:
	cd mobile && rm -rf .expo/web/cache && rm -rf node_modules/.cache/babel-loader/* && npm start

build_server_local:
	cd server && python -m venv ./venv && source ./venv/bin/activate && pip install -r requirements.txt

run_server_local:
	cd server && source ./venv/bin/activate && python app.py

# Must run 'make build_mobile_local' first
run_server_dummy:
	cd mobile && node dserver.js

# Deploy for dev
deploy_dev_mobile_android:
	cd mobile && eas build --platform android --profile development

deploy_dev_mobile_ios:
	cd mobile && eas build --platform ios --profile development

clean:
	cd mobile && npm prune && rm -rf node_modules package-lock.json
	cd server && rm -rf ./venv ./.venv