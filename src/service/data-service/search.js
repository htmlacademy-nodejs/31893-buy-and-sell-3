'use strict';

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(searchText) {
    const offers = this._offers.filter((item) => {
      return item.title.includes(searchText);
    });

    return offers;
  }
}

module.exports = SearchService;
