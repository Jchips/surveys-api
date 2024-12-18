'use strict';

require('dotenv').config();
const express = require('express');
const notFound = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');
const authRoutes = require('./auth/routes');
const surveyRoutes = require('./routes/survey');
const responseRoutes = require('./routes/response');
const removeRoutes = require('./routes/remove');
const qRoutes = require('./routes/question');
const responderRoutes = require('./routes/responder');

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.get('/', (req, res) => res.status(200).send('default route is working'));

app.use(authRoutes);
app.use('/surveys', surveyRoutes);
app.use('/responses', responseRoutes);
app.use('/remove', removeRoutes);
app.use('/questions', qRoutes);
app.use('/responder', responderRoutes);

app.use('*', notFound);
app.use(errorHandler);

function start() {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

module.exports = { start, app };
