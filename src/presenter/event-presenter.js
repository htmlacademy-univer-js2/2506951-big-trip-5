import EditForm from '../view/form-edit.js';
import EventItem from '../view/event-item.js';
import {remove, render, replace, RenderPosition} from '../framework/render.js';
import {ACTION_TYPE, UpdateType} from '../utils/const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADDING: 'ADDING'
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
  #handleDestroy = null;
  #mode = Mode.DEFAULT;
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editForm.reset(this.#event);
      this.#replaceFromEditToItem();
    }
  };

  constructor({destinations, offers, eventListComponent, onDataChange, onModeChange}) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#eventListComponent = eventListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#handleDestroy = arguments[0].onDestroy || (() => {});
  }

  init(event, isNew = false) {
    this.#event = event;
    if (isNew) {
      this.#mode = Mode.ADDING;
      this.#editForm = new EditForm({
        event: this.#event,
        destinations: this.#destinations,
        offers: this.#offers,
        submitHandler: (value) => {
          this.#handleDataChange(ACTION_TYPE.ADD_EVENT, UpdateType.MINOR, value);
        },
        clickHandler: () => {
          this.destroy();
        }
      });
      render(this.#editForm, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
      const formElement = this.#editForm.element.querySelector('form');
      formElement.addEventListener('reset', (evt) => {
        evt.preventDefault();
        this.destroy();
      });
      return;
    }
    const prEventItem = this.#eventItem;
    const prEditForm = this.#editForm;
    this.#event = event;
    this.#editForm = new EditForm({
      event: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      submitHandler: (value) => {
        this.#handleDataChange(ACTION_TYPE.UPDATE_EVENT, UpdateType.PATCH, value);
      },
      clickHandler: () => {
        this.#editForm.reset(this.#event);
        this.#replaceFromEditToItem();
      },
      deleteHandler: this.#handleDeleteClick
    });
    this.#eventItem = new EventItem({
      event: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      clickHandler: () => {
        this.#replaceFromItemToEdit();
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
      this.#editForm.reset(this.#event);
      this.#replaceFromEditToItem();
    }
  }

  setAborting() {
    if (this.#mode === Mode.EDITING || this.#mode === Mode.ADDING) {
      this.#editForm.setAborting();
      return;
    }

    this.#eventItem.shake();
  }

  setSaving() {
    if (this.#mode === Mode.EDITING || this.#mode === Mode.ADDING) {
      this.#editForm.setSaving();
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING || this.#mode === Mode.ADDING) {
      this.#editForm.setDeleting();
    }
  }

  #replaceFromEditToItem() {
    replace(this.#eventItem, this.#editForm);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #replaceFromItemToEdit() {
    replace(this.#editForm, this.#eventItem);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #handleFavoriteChange() {
    this.#handleDataChange(ACTION_TYPE.UPDATE_EVENT, UpdateType.PATCH, {...this.#event, isFavorite: !this.#event.isFavorite});
  }

  #handleDeleteClick = () => {
    this.#handleDataChange(ACTION_TYPE.DELETE_EVENT, UpdateType.MINOR, this.#event);
  };

  destroy() {
    remove(this.#eventItem);
    remove(this.#editForm);
    this.#handleDestroy();
  }
}
