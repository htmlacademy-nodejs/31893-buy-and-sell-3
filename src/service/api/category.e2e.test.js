'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);

const {HttpCode} = require(`../../constants`);

const mockOffers = [
  {
    id: `ZlYeYG`,
    category: [
      `Книги`
    ],
    description: `Бонусом отдам все аксессуары. Это настоящая находка для коллекционера! Продаю с болью в сердце... При покупке с меня бесплатная доставка в черте города.`,
    picture: `item10.jpg`,
    title: `Продам книги Стивена Кинга`,
    type: `offer`,
    sum: 36332,
    comments: [
      {
        id: `xOLGlS`,
        text: `Почему в таком ужасном состоянии?`
      },
      {
        id: `sR6CDI`,
        text: `Вы что?! В магазине дешевле. А сколько игр в комплекте? Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    id: `QAu0W1`,
    category: [
      `Посуда`
    ],
    description: `Это настоящая находка для коллекционера! Продаю с болью в сердце... Если найдёте дешевле — сброшу цену. Таких предложений больше нет!`,
    picture: `item07.jpg`,
    title: `Продам отличную подборку фильмов на VHS`,
    type: `sale`,
    sum: 85916,
    comments: [
      {
        id: `df4pFF`,
        text: `А где блок питания? Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле.`
      },
      {
        id: `r2sQQa`,
        text: `Неплохо, но дорого. Оплата наличными или перевод на карту?`
      },
      {
        id: `ovS4CV`,
        text: `С чем связана продажа? Почему так дешёво? А где блок питания? А сколько игр в комплекте?`
      },
      {
        id: `Nz_-jg`,
        text: `Неплохо, но дорого.`
      }
    ]
  },
  {
    id: `8oKz0b`,
    category: [
      `Авто`
    ],
    description: `Бонусом отдам все аксессуары. Пользовались бережно и только по большим праздникам. Это настоящая находка для коллекционера! Продаю с болью в сердце...`,
    picture: `item02.jpg`,
    title: `Продам книги Стивена Кинга`,
    type: `offer`,
    sum: 93569,
    comments: [
      {
        id: `h2adHj`,
        text: `Оплата наличными или перевод на карту? А где блок питания? Почему в таком ужасном состоянии?`
      }
    ]
  }
];

const app = express();
app.use(express.json());
category(app, new DataService(mockOffers));

describe(`API returns category list`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(3));

  test(`Category names are "Книги", "Посуда", "Авто"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Книги`, `Посуда`, `Авто`])
      )
  );

});
