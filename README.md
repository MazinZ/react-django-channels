# react-django-channels

Project hosted here: http://178.128.182.6/

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

# Reasons behind technology choices:
1. Django + Channels, Django Rest Framework
  - I saw that Django Channels 2 was recently released so I wanted to try it out.
2. React
  - I haven't worked much with React (all of my SPA experience has been in AngularJS) and I'm trying to get more familiar with it.

## Challenges & Thoughts for improvement
1. I had issues getting testing working in time.

2. If I were to do this again, I'd probably use Node + socket.io since it's a pretty easy combo to set up. Channels 2 came out fairly recently so documentation is sparse. 

3. Re-do UI design. Design is really important to me (https://www.behance.net/mazinzakaria) but I focused on implementation here.

4. Add pagination/infinite scrolling. I only pull 10 tweets when showing the user page -- I got suspended from Twitter's API so I limited results. Pagination would be fairly simple to implement though.

5. All tweets involving the user are shown when listening for new tweets, not only tweets by that user. I kept this in because it makes it easier to test the tweet pushing functionality. Filtering out tweets not by the user only requires implementing the `filter_data` function that I included a basic shell of in `consumers.py`

6. Add search for words/keywords, not just users. I kept this out to keep the scope of the project small, but it would require a change to the Feed component and the consumer/api view.

7. Twitter creds should be set to env variables, not within the settings.py file. That was the main reason why I introduced the proxy server to being with.

8. Error handling


## Other stuff

I deployed the project with NGINX/Gunicorn/Daphne. Here's the NGINX config:

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
