#!/usr/bin/env node

require('babel-register')({ extensions: ['.js'] });
require('dotenv').config();

require('./src/bot');
