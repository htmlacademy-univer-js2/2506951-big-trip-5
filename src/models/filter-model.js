import Observable from '../framework/observable';

export const UpdateType = {
  FILTER: 'filter'
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filterType) {
    if (this.#filter === filterType) {
      return;
    }
    this.#filter = filterType;
    this._notify(updateType, filterType);
  }
}
