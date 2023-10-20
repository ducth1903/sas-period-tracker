
run_docker:
	docker compose up

build_server_docker:
	cd server && docker build -t sas-server .

build_mobile_local:
	cd mobile && npm install

run_mobile_local:
	cd mobile && npm start

# This will clear cache (take longer)
run_mobile_local_clear_cache:
	cd mobile && rm -rf .expo/web/cache && rm -rf node_modules/.cache/babel-loader/* && npm start

build_server_local:
	cd server && python3 -m venv ./venv && source ./venv/bin/activate && pip install -r requirements.txt

run_server_local:
	cd server && source ./venv/bin/activate && python3 app.py

clean:
	cd mobile && npm prune && rm -rf node_modules package-lock.json
	cd server && rm -rf ./venv ./.venv

# Deploy for dev
deploy_dev_mobile_android:
	cd mobile && eas build --platform android --profile preview

deploy_dev_mobile_ios:
	cd mobile && eas build --platform ios --profile preview

deploy_release_mobile_android:
	cd mobile && eas build --platform android --profile release

deploy_release_mobile_ios:
	cd mobile && eas build --platform ios --profile release

deploy_server_docker:
	cd server && docker build --platform=linux/amd64 -t sas-server .

deploy_secret_force:
	cd mobile && eas secret:push --scope project --env-file ./.env

# Build with prod locally
# npx expo start --no-dev
# or
# npx expo start --no-dev --minify (--minify will eliminate unnecessary data such as comments, formatting, and unused code)
