# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /mobile
ENV REACT_NATIVE_PACKAGER_HOSTNAME="{}"
COPY package.json package.json
RUN npm install
COPY . .
EXPOSE 19000
CMD ["npm", "start"]
