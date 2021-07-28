'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockOffers = [
  {
    id: `iXtuEN`,
    category: [
      `Книги`
    ],
    description: `Товар в отличном состоянии. Если товар не понравится — верну всё до последней копейки. Отдаю почти даром. При покупке с меня бесплатная доставка в черте города.`,
    picture: `item04.jpg`,
    title: `Куплю пуделя`,
    type: `sale`,
    sum: 46328,
    comments: [
      {
        id: `rS8fpJ`,
        text: `Неплохо, но дорого. Вы что?! В магазине дешевле.`
      }
    ]
  },
  {
    id: `UGpXXK`,
    category: [
      `Книги`
    ],
    description: `Даю недельную гарантию. Бонусом отдам все аксессуары. Таких предложений больше нет! Это настоящая находка для коллекционера!`,
    picture: `item01.jpg`,
    title: `Куплю пуделя`,
    type: `offer`,
    sum: 83167,
    comments: [
      {
        id: `V-m9ib`,
        text: `Совсем немного... А где блок питания?`
      }
    ]
  },
  {
    id: `jbd9zq`,
    category: [
      `Музыка`
    ],
    description: `Продам детские ботиночки, неношенные. Продаю с болью в сердце... Отдаю почти даром. При покупке с меня бесплатная доставка в черте города.`,
    picture: `item15.jpg`,
    title: `Куплю породистого кота`,
    type: `offer`,
    sum: 81446,
    comments: [
      {
        id: `Ibc7xC`,
        text: `А где блок питания? Вы что?! В магазине дешевле.`
      },
      {
        id: `blp4zI`,
        text: `Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво?`
      },
      {
        id: `a-Zi4P`,
        text: `Почему в таком ужасном состоянии?`
      }
    ]
  }
];

const createAPI = async () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockOffers));
  app.use(express.json());
  offer(app, new OfferService(cloneData), new CommentService(cloneData));
  return app;
};

describe(`API returns a list of all offers`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 3 offers`, () => expect(response.body.length).toBe(3));

  test(`First offer's id equals "iXtuEN"`, () => expect(response.body[0].id).toBe(`iXtuEN`));
});

describe(`API returns an offer with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers/iXtuEN`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Куплю пуделя"`, () => expect(response.body.title).toBe(`Куплю пуделя`));
});

describe(`API creates an offer if data is valid`, () => {
  test(`Success deletes an offer`, async () => {
    const newOffer = {
      category: `Котики`,
      title: `Дам погладить котика`,
      description: `Дам погладить котика. Дорого. Не гербалайф`,
      picture: `cat.jpg`,
      type: `OFFER`,
      sum: 100
    };

    const app = await createAPI();
    const response = await request(app)
      .post(`/offers`)
      .send(newOffer);

    expect(response.statusCode).toBe(HttpCode.CREATED);
    expect(response.body).toEqual(expect.objectContaining(newOffer));

    const responseOffers = await request(app).get(`/offers`);
    expect(responseOffers.body.length).toBe(4);
  });
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 200
  };
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 300
  };
  let response;

  beforeAll(async () => {
    const app = await createAPI();

    response = await request(app)
      .put(`/offers/iXtuEN`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed offer`, () => expect(response.text).toBe(`Updated`));
});

test(`API returns status code 404 when trying to change non-existent offer`, async () => {
  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  const app = await createAPI();

  return request(app)
    .put(`/offers/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  const app = await createAPI();

  return request(app)
    .put(`/offers/iXtuEN`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`Deletes an offer`, () => {
  test(`Success deletes an offer`, async () => {
    const app = await createAPI();
    const response = await request(app).delete(`/offers/iXtuEN`);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.id).toBe(`iXtuEN`);

    const responseOffers = await request(app).get(`/offers`);
    expect(responseOffers.body.length).toBe(2);
  });

  test(`API refuses to delete non-existent offer`, async () => {
    const app = await createAPI();

    return request(app)
      .delete(`/offers/NOEXST`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API returns a list of comments to given offer`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers/UGpXXK/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 1 comment`, () => expect(response.body.length).toBe(1));

  test(`Comment's text is "Совсем немного... А где блок питания?"`,
      () => expect(response.body[0].text).toBe(`Совсем немного... А где блок питания?`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этих полей`
  };
  let response; let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/offers/UGpXXK/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/offers/UGpXXK/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const invalidComment = {
    NOEXST: `Не указан text`
  };

  const app = await createAPI();

  return request(app)
    .post(`/offers/UGpXXK/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/offers/UGpXXK/comments/V-m9ib`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted comment`, () => expect(response.body.id).toBe(`V-m9ib`));

  test(`Offer count is 0 now`, () => request(app)
    .get(`/offers/UGpXXK/comments`)
    .expect((res) => expect(res.body.length).toBe(0))
  );
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/offers/UGpXXK/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
