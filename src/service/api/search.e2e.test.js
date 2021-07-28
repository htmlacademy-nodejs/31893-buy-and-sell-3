'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);

const {HttpCode} = require(`../../constants`);

const mockOffers = [
  {
    id: `3H9uD2`,
    category: [
      `Разное`
    ],
    description: `При покупке с меня бесплатная доставка в черте города. Продаю с болью в сердце... Отдаю почти даром. Пользовались бережно и только по большим праздникам.`,
    picture: `item14.jpg`,
    title: `Продам книги Стивена Кинга`,
    type: `offer`,
    sum: 50551,
    comments: [
      {
        id: `QzDMPc`,
        text: `Вы что?! В магазине дешевле. Почему в таком ужасном состоянии?`
      },
      {
        id: `OxVO5f`,
        text: `Почему в таком ужасном состоянии?`
      },
      {
        id: `aO2NWy`,
        text: `Вы что?! В магазине дешевле. Почему в таком ужасном состоянии?`
      },
      {
        id: `kloTsy`,
        text: `А сколько игр в комплекте? А где блок питания? Вы что?! В магазине дешевле.`
      }
    ]
  },
  {
    id: `AbJOAS`,
    category: [
      `Музыка`
    ],
    description: `Если товар не понравится — верну всё до последней копейки. Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Отдаю почти даром.`,
    picture: `item15.jpg`,
    title: `Продам новую приставку Sony Playstation 5`,
    type: `offer`,
    sum: 32716,
    comments: [
      {
        id: `iH6IN6`,
        text: `Совсем немного...`
      }
    ]
  },
  {
    id: `1Kz4Ou`,
    category: [
      `Животные`
    ],
    description: `Продам детские ботиночки, неношенные. Таких предложений больше нет! Если товар не понравится — верну всё до последней копейки. Это настоящая находка для коллекционера!`,
    picture: `item04.jpg`,
    title: `Продам книги Стивена Кинга`,
    type: `sale`,
    sum: 93573,
    comments: [
      {
        id: `2y2cjx`,
        text: `С чем связана продажа? Почему так дешёво?`
      },
      {
        id: `qJQPVm`,
        text: `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        id: `zFTAft`,
        text: `А где блок питания?`
      },
      {
        id: `MWuLIY`,
        text: `Совсем немного... А сколько игр в комплекте?`
      }
    ]
  }
];

const app = express();
app.use(express.json());
search(app, new DataService(mockOffers));

describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам новую приставку`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`AbJOAS`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      })
      .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST)
);
