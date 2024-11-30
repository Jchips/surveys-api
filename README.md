# surveys-api

Backend for [Surveys app](https://github.com/Jchips/surveys).

The tests do not currently work because SQLite does not support jsonb. The tests are also not currently up-to-date.

## Author: Jelani R

<img src='./src/assets/icon.png' alt='Surveys app icon' width='200'/>

## Architecture

Node.js, Express, base-64, bcrypt, jsonwebtoken, Sequelize, MySQL (currently using), PostgreSQL (supported)

Languages: JavaScript

## `.env` requirements

- PORT:enter-whatever-port-you-want
- DATABASE_URL=postgres-database-url *(if using PostgreSQL db)*
- SECRET=a-secret-for-jwt-tokens

*if using mySQL db:*
- DB_NAME=mysql-database-name
- DB_USER=mysql-atabase-username
- DB_PASS=mysql-database-password
- DB_HOST=mysql-database-hostname

## Routes

### Auth routes

POST: `/signup` - Sign up a user

POST: `/signin` (basic auth) - Sign in with a user that already signed up

GET: `/users` (bearer auth) - Displays all user names (only for admins)

DELETE: `/delete/:username/:id` (bearer auth) - Delete a user

### `/surveys` routes (all routes use bearer auth)

GET: `/surveys` - Fetches all surveys. - With the parameter uid, you can get all surveys from a certain creator by entering their user id number

GET:  `/surveys/:username/:uid` - Fetches all surveys that are not created by the current user and that the user hasn't already responded to

GET: `/surveys/:surveyId` - Fetches specific survey

POST: `/surveys` - Create a survey (only for creators and admins). This will also add questions into the Questions database.

DELETE: `/surveys/:surveyId` - Delete a survey that user created (only for creators and admins)

### `/questions` routes (all routes user bearer auth)

GET: `/questions/:survey_id` - Fetches all survey questions with the given survey id (in ascending order)

POST: `/questions` - Adds a question *(not used in code)*

DELETE: `/questions/:survey_id` - Deletes all survey questions with the given survey id *(not used in code)*

### `/responses` routes (all routes use bearer auth)

GET: `/responses/:surveyId` - Fetches all responses to a survey that you posted (only for creators and admins)

POST: `/responses` - Create a response to a survey

DELETE: `/responses/:surveyId` - Deletes all responses to a given survey (only for creators and admins)

### `/responder` routes (all routes use bearer auth)

POST: `/responder` - Records that a user responded to a survey

### `/remove` routes (all routes use bearer auth)

POST: `/remove` - Adds a survey to the Remove table (remove surveys from specific user feeds)

DELETE: `/remove/:survey_id` - Deletes all Remove items for a given survey

## Example Requests

### Example `/signup` POST request

```JSON
{
  "username": "toad",
  "password": "$2b$10$cansjdvdjkvbkdjvf",
  "role": "creator",
}
```

### Example `/surveys` POST request

```JSON
{
  "createdBy": "dog",
  "title": "Transit",
}
```

### Example `/questions` POST request

```JSON
{
  "survey_id": 1,
  "qIndex": 0,
  "question": "what is your most common mode of transportation?",
  "responseType": "multiChoice",
  "multiChoiceOptions": "car, bike, bus, train/subway, walking, running, flying, swimming, crawling, hopping"
}
```

### Example `/responses` POST request

```JSON
{
  "createdBy": "dog",
  "response": {
    "radioGroup1": 4,
    "textResponse2": "14 hours",
    "username": "bear"
  },
  "surveyId": 1
}
```

### Example `/remove` POST request

```JSON
{
  "user_id": 1,
  "survey_id": 20
}

```

### Example `responders` POST request

```JSON
{
  "user_id": 5,
  "survey_id": 14
}
```

## Changelog

- 1.0.0 (10-22-2024, 1:13am) - Added more tables to the database.
- 0.4.0 (10-12-2024, 4:23am) - Added delete routes for deleting surveys.
- 0.3.0 (10-10-2024, 6:58pm) - Added Remove table/model/routes.
- 0.2.0 (09-06-2024, 6:57pm) - Updated Response model/routes.
- 0.1.1 (09-04-2024) - Updated Survey model/routes and removed tests from GitHub workflow.
- 0.1.0 (08-31-2024) - Functional server.
- 0.0.0 (07-22-2024) - Initial commit.
