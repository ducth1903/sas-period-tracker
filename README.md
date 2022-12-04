# SAS Period Tracker
Small Acts for Sustainability - Period Tracker App

## TODO:

- CICD: [Code Pipeline](https://aws.amazon.com/getting-started/hands-on/continuous-deployment-pipeline/)
- [React] bottom sheet transition smoother
- [React] main calendar
- [React] scrollable calendar
- [React] resources page: markdown library is broken
- [Python] deploy

## Frontend - React Native

- npm install
- Copy .env and replace with your IP address, port 8000
- npm start

## Backend - Django Python
- pip install -r requirements.txt
- Copy .env and replace with your IP address (no port needed)
- Ask admin for access to AWS resources
- python manage.py runserver \<IP\>:8000

## Features

### 1. Symptom Tracking

- 

### 2. Blog/Resource Content

- All live on S3 bucket
- One master JSON file
- Each content (i.e. question and answer) is a Markdown file
- Images should be uploaded to S3 also. Then Markdown should refer to the image's S3 URL
- Package to render Markdown in React Native: https://github.com/iamacup/react-native-markdown-display (syntax support provided in the link)

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

  

