#!/usr/bin/env node
const config = require('../config.json');
const Cli = require('../dist/cli').default;
const FrameworkManager = require('../dist/src/FrameworkManager').default;

const cli = new Cli(config, FrameworkManager.instance);
cli.start();
