'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExist = require(`../middlewares/offer-exist`);
const commentValidator = require(`../middlewares/comment-validator`);

const route = new Router();

module.exports = (app, offerService, commentService) => {
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const offers = offerService.findAll();
    res.status(HttpCode.OK)
      .json(offers);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
        .json(offer);
  });

  route.put(`/:offerId`, offerValidator, async (req, res) => {
    const {offerId} = req.params;
    const updated = await offerService.update(offerId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.drop(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), async (req, res) => {
    const {offerId} = req.params;

    const comments = await commentService.findAll(offerId);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {commentId, offerId} = req.params;
    const deleted = await commentService.drop(commentId, offerId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deleted);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
