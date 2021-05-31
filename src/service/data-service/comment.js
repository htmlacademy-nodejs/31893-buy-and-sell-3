'use strict';

const {nanoid} = require(`nanoid`);

const {
  MAX_ID_LENGTH
} = require(`../../constants`);

class CommentService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer, comment) {
    const newComment = {id: nanoid(MAX_ID_LENGTH), text: comment.text};
    offer.comments.push(newComment);

    this._offers = this._offers.filter((item) => item.id !== offer.id).push(offer);

    return newComment;
  }

  drop(commmentId, offerId) {
    const offer = this._offers.find((item) => item.id === offerId);
    const comment = offer.comments.find((item) => item.id === commmentId);

    if (!comment) {
      return null;
    }

    offer.comments = offer.comments.filter((item) => item.id !== commmentId);

    this._offers = this._offers.filter((item) => item.id !== offerId).push(offer);
    return comment;
  }

  findAll(offerId) {
    return this._offers.find((item) => item.id === offerId).comments;
  }
}

module.exports = CommentService;
