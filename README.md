# SAS Period Tracker (Small Acts for Sustainability)

## TODO:
- [ ] CICD: [Code Pipeline](https://aws.amazon.com/getting-started/hands-on/continuous-deployment-pipeline/)
- [ ] [React] bottom sheet transition smoother
- [ ] [React] main calendar
- [ ] [React] scrollable calendar
- [ ] [React] resources page: markdown library is broken
- [ ] [Python] deploy
- [ ] [Python] CI / unit testing

## Getting Started

- Prerequisites: 
  - Install Docker Desktop / Docker Engine  
  - Have `.env` under `mobile` and `server` folders

- **One-time set up only**:  
  ```bash
  # populate .env with your local IP address
  python sas.py -overwrite-env
  
  # or manually set your IP address in .env files for both mobile/ and server/
  # get your IP with
  python sas.py -getip
  
  # Note that mobile/.env should contain port as well: <YOUR_IP>:5000
  ```

- Run mobile and server with Docker (**recommended**):
  ```bash
  make run_docker 
  ```

- Run **locally**:
  - Install `nvm` and `npm`. Make sure the version of `npm` and `node` matched below:
    
    ```bash
    node --version
    v16.18.1
    
    npm --version
    8.19.2
    ```
  
  - Build first:
    ```bash
    # Mobile
    make build_mobile_local
    
    # Server
    make build_server_local
    ```
  
  - Then run locally on two separate terminals:
    ```bash
    # Mobile
    make run_mobile_local
    
    # Server
    make run_server_local
    ```

## Features

### 1. Period Tracking
- Symptoms tracking
- Predict next cycle

### 2. Blog/Resource Content
- All live on S3 bucket
- One master JSON file
- Each content (i.e. question and answer) is a Markdown file
- Images should be uploaded to S3 also. Then Markdown should refer to the image's S3 URL
- Package to render Markdown in React Native: https://github.com/iamacup/react-native-markdown-display (syntax support provided in the link)
- Chatbot for Q&A (ChatGPT?)

### 3. Multiple Languages
- Use internationalization library: `i18n-js`
  ```javascript
  import I18n from "i18n-js";
  
  import en from './locales/en.json';
  import vn from './locales/vn.json';
  import kannada from './locales/kannada.json';
  import hindi from './locales/hindi.json';
  
  // Next 2 lines are for default and current locale
  I18n.defaultLocale = 'en';
  I18n.locale = 'en';
  I18n.fallbacks = true;
  I18n.translations = { en, vn, kannada, hindi };
  
  export default I18n;
  ```

- Inside each of the above JSON files, define the corresponding language for each term
- To use it: 
  ```javascript
  I18n.t('authentication.email')
  ```

## Deployment
### 1. For dev
- Mobile: development build with EAS build [link](https://docs.expo.dev/development/create-development-builds/)
    - `EAS Build` is a hosted service for building app binary for your Expo project.
    - Handles app signing credentials for you
    - Set up env variables on EAS Build: https://docs.expo.dev/build-reference/variables/
    - Sharing the builds with team via internal distribution: https://docs.expo.dev/build/internal-distribution/
    - For Android APK: https://docs.expo.dev/build-reference/apk/
    - For iOS Simulator: https://docs.expo.dev/build-reference/simulators/

- Server: deploy the Flask server to AWS. There are three common ways to deploy on AWS:
    1. Deploy to Elastic Beanstalk
    2. Deploy Docker image to ECR then run task on ECS
    3. AWS Lambda function with API Gateway   

  We use option #2 (push Docker image to ECR and run with ECS). Steps:
    - Build image locally with `make deploy_server_docker`. Note that have to build with `--platform=linux/amd64` to avoid errors when running on ECS.
    - Push image to ECR
    - Create Task in ECS: create cluster, define task, run the task
    - Finally, if the public URL does not work, check security group in EC2 and add port 5000 to Inbound rules.

References:
1. [link1](https://medium.com/geekculture/aws-container-services-part-1-b147e974c745)
2. [link2](https://towardsdatascience.com/how-to-deploy-a-flask-api-on-aws-ecs-part-3-c1ca552e65d)

### 2. For prod
- Mobile: Similar to dev's build but need to follow upload to App Store path.
- Server: same with dev
