# MeetUp-Event-Management-Web-App
MeetUp is an event management web app that helps event organizers and friend groups to formally host events in an organized manner.
This personal project is deployed on Heroku and can be accessed with: https://meetup-event-management-webapp.herokuapp.com (the URL no longer works as Heroku stopped supporting the free plan :( )

## Built with
* Node.js(Express)
* MongoDB(Mongoose)
* Bootstrap 5
* EJS
* SendGrid Email SMTP Service

## Run
To run this project on your local machine, clone this repository and use following commands:
```
$ npm install
$ npm start
```
Note that you will need your own MONGODB_URI, SESSION_SECRET, EMAIL, PASSWORD and SENDGRID_API_KEY in a .env file to fully run the webapp locally.

