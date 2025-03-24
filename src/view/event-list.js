import AbstractView from '../framework/view/abstract-view';

function getEventListTemplate() {
  return `
        <ul class="trip-events__list"></ul>
    `;
}

export default class EventList extends AbstractView {
  get template() {
    return getEventListTemplate();
  }
}
