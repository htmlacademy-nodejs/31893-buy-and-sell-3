'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const fill = require(`./fill`);
const version = require(`./version`);
const server = require(`./server`);

const Cli = {
  [fill.name]: fill,
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
};

module.exports = {
  Cli,
};
