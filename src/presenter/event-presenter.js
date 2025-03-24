import EditForm from '../view/form-edit';
import EventItem from '../view/event-item';
import {remove, render, replace} from '../framework/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #destinations = null;
  #offers = null;
  #eventItem = null;
  #editForm = null;
  #eventListComponent = null;
  #event = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFromEditToItem();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  constructor({destinations, offers, eventListComponent, onDataChange, onModeChange}) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#eventListComponent = eventListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(event) {
    const prEventItem = this.#eventItem;
    const prEditForm = this.#editForm;
    this.#event = event;
    this.#editForm = new EditForm({event: this.#event, destinations: this.#destinations, offers: this.#offers, submitHandler: () => {
      this.#replaceFromEditToItem();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }, clickHandler: () => {
      this.#replaceFromEditToItem();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }});
    this.#eventItem = new EventItem({
      event: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      clickHandler: () => {
        this.#replaceFromItemToEdit();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      favoriteClickHandler: () => {
        this.#handleFavoriteChange();
      }
    });

    if (prEventItem === null || prEditForm === null) {
      render(this.#eventItem, this.#eventListComponent.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventItem, prEventItem);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editForm, prEditForm);
    }

    remove(prEventItem);
    remove(prEditForm);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFromEditToItem();
    }
  }

  #replaceFromEditToItem() {
    replace(this.#eventItem, this.#editForm);
    this.#mode = Mode.DEFAULT;
  }

  #replaceFromItemToEdit() {
    replace(this.#editForm, this.#eventItem);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #handleFavoriteChange() {
    this.#handleDataChange({...this.#event, is_favourite: !this.#event.is_favourite});
  }
}
