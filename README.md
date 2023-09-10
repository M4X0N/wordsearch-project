# wordsearch-project

## run instructions:
1. from one terminal, cd to main project dir and run `python app/api/main.py`
2. from another terminal, go to `/app/frontend` and `npm start`. If it's first time, run `npm install` firstly

## Deployment
Deployment to AWS EC2 instance is done by ansible, see `ansible` folder.

Backend deployed following this guide
https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-22-04


## dependencies:
* for frontend - npm

* for backend:
  * flask 
  * cors
  * python-docx
