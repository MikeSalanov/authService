#!/bin/sh

npx sequelize-cli db:migrate

exec node app.js
