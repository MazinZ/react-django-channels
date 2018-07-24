# react-django-channels

A Twitter clone that allows you to search for a user, look at their feed, and pull new tweets as they come in live via websockets + Django channels + Twitter streams. 

# Reasons behind technology choices:
1. Django + Channels, Django Rest Framework
  - I saw that Django Channels 2 was recently released so I wanted to try it out.
2. React
  - I haven't worked much with React and I'm trying to get more familiar with it.

## Setup instructions

Python >= 3.5 is required.

Setup virtual env
```
$ python3 -m venv tf-env
$ source tf-env/bin/activate
```

From /twitter_feed_api:

```
$ pip install -r requirements.txt
$ python manage.py migrate
$ python manage.py runserver
```

From /twitter_feed_frontend:

```
$ npm install
$ npm run build
$ npm start
```

The app should be live at localhost:3000.


## NGINX config

NGINX config to get Gunicorn + Daphne + Django running in a more production-like environment:

```
    upstream app {
        server unix:/home/slync/react-django-channels/twitter_feed_api/twitter_feed_api.sock;
    }

    upstream ws_server {
        server unix:/tmp/daphne.sock;
    }

    server {
        listen 80;
        listen [::]:80;

        server_name 178.128.182.6;

        access_log  /var/log/nginx/access.log;
        error_log  /var/log/nginx/error.log;
        root /home/slync/react-django-channels/twitter_feed_frontend/build;
        index index.html;

        location /api/ {
            try_files $uri @proxy_to_app;
        }

        location /feed/twitter-stream/ {
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_redirect off;
            proxy_pass   http://ws_server;
        }

        location / {
           try_files $uri /index.html =404;
        }

        location @proxy_to_ws {
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_redirect off;

            proxy_pass   http://ws_server;
        }

        location @proxy_to_app {
            proxy_set_header X-Forwarded-Proto http;
            proxy_set_header X-Url-Scheme $scheme;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_redirect off;

            proxy_pass   http://app;
        }
    }
```
