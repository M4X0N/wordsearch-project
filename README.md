# wordsearch-project

## run instructions:
1. from one terminal, cd to main project dir and run [path to python] app/api/main.py
2. from another terminal, cd to [project dir]/app/frontend then run npm start

## Docker instructions:
### Frontend:
at app/frontend

`# docker build . -t wordsearch-frontend`

`# docker run -p 80:3000 -d wordsearch-frontend:latest`

at app/api

`# docker build . -t wordsearch-backend`

`# docker run -p 5000:5000 -d wordsearch-backend:latest`


dependencies to be installed:
for frontend npm will do it

for backend:
flask
cors
python-docx

## TODO
* Make frontend run. There is a problem with dependencies
* Reorganize repo: frontend and backend folders on root. Progress reports format
* Docker: container repo.
* Ansible: install dependencies, run docker-compose
