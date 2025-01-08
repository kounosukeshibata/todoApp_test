# build the app.
FROM node:lts-bookworm-slim as build-env

# Pythonとビルドツールをインストール
RUN apt-get update && apt-get install -y python3 make g++

# set the working dir.
WORKDIR /app

# copy json files to the working dir.
COPY package.json package-lock.json tsconfig.json /app/
COPY webpack.config.ts /app/

# copy the source files to the working dir.
COPY src /app/src

# set the environment.
ARG API_URL
ENV API_URL=$API_URL

# run the build command to build the app.
RUN npm install
RUN npm run build

# set up the production container.
FROM nginx:bookworm

# copy nginx.conf.
COPY nginx.conf /etc/nginx/nginx.conf

# copy the build output from the build-env.
COPY --from=build-env /app/build /usr/share/nginx/html

# expose port.
EXPOSE 80

# command to run nginx.
CMD ["nginx","-g","daemon off;"]
