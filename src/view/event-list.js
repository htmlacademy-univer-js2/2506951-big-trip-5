import {createElement} from '../render';

function getEventListTemplate() {
  return `
        <ul class="trip-events__list"></ul>
    `;
}

export default class EventList {
  getTemplate() {
    return getEventListTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
