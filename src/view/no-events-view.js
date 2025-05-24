import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../models/filter-model';

function createNoEventsTemplate(filterType) {
  let message;
  switch (filterType) {
    case FilterType.EVERYTHING:
      message = 'Click New Event to create your first point';
      break;
    case FilterType.PAST:
      message = 'There are no past events now';
      break;
    case FilterType.PRESENT:
      message = 'There are no present events now';
      break;
    case FilterType.FUTURE:
      message = 'There are no future events now';
      break;
    default:
      message = 'Click New Event to create your first point';
  }
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class NoEventsView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoEventsTemplate(this.#filterType);
  }
}
