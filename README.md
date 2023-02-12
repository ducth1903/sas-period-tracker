# SAS Period Tracker

Small Acts for Sustainability - Period Tracker App

## TODO:

- CICD: [Code Pipeline](https://aws.amazon.com/getting-started/hands-on/continuous-deployment-pipeline/)
- [React] bottom sheet transition smoother
- [React] main calendar
- [React] scrollable calendar
- [React] resources page: markdown library is broken
- [Python] deploy
- [Python] CI / unit testing

## Getting Started

- Prerequisites: 
  
  - Install Docker Desktop / Docker Engine
  
  - Install `python3`
  
  - Have `.env` under `mobile` and `server` folders

- **One-time set up only**:
  
  ```bash
  # populate .env with your local IP address
  python sas.py -overwrite-env
  ```

- Run mobile and server with Docker (**recommended**):
  
  ```bash
  make run_docker 
  ```

- If you want to set up and run **locally**:
  
  - Install `nvm` and `npm`. Make sure the version of `npm` and `node` matched below:
    
    ```bash
    node --version
    v16.18.1
    
    npm --version
    8.19.2
    ```
  
  - Build / install first:
    
    ```bash
    # Mobile
    make build_mobile_local
    
    # Server
    make build_server_local
    ```
  
  - Run locally:
    
    ```bash
    # Mobile
    make run_mobile_local
    
    # Server
    make run_server_local
    ```

## 

## Features

### 1. Period Tracking

- Date / Symptoms

- Predict next cycle

- 

### 2. Blog/Resource Content

- All live on S3 bucket

- One master JSON file

- Each content (i.e. question and answer) is a Markdown file

- Images should be uploaded to S3 also. Then Markdown should refer to the image's S3 URL

- Package to render Markdown in React Native: https://github.com/iamacup/react-native-markdown-display (syntax support provided in the link)

- Chatbot for Q&A

### 3. Multiple Languages

- Use internationalization library: i18n-js
  
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
  
  `I18n.t('authentication.email')`
