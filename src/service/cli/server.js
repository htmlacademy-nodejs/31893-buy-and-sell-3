'use strict';
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const express = require(`express`);
const {Router} = require(`express`);

const routes = require(`../api`);

const {
  FILE_NAME,
  HttpCode,
  API_PREFIX
} = require(`../../constants`);
const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());

const router = new Router();

app.use(`/offers`, router.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
}));

app.use(API_PREFIX, routes);

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      console.info(chalk.green(`Ожидаю соединений на ${port}`));
    }).on(`error`, (err) => {
      console.error(`Ошибка при создании сервера`, err);
    });
  }
};
