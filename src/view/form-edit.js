import {formatDate, getDestination, getDuration, getEventIconUrl, getTypeOffers} from '../utils/utils';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

function getOfferTemplate(offer, eventOffers) {
  const {title, price, id} = offer;
  const isChecked = eventOffers.includes(id);
  const controlId = `event-offer-${id}-1`;

  return `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="${controlId}" type="checkbox" name="event-offer-${id}" value="${id}" ${isChecked ? 'checked' : ''}>
            <label class="event__offer-label" for="${controlId}">
              <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>
  `;
}

function getEditFormTemplate(event, destinations, offers, isDisabled = false, isSaving = false, isDeleting = false) {
  const {dateFrom, dateTo, type: eventType, destination: eventDestination, basePrice, offers: eventOffers} = event;
  const destination = getDestination(eventDestination, destinations);
  const eventIconUrl = getEventIconUrl(eventType);
  const startTime = formatDate(dateFrom, 'DD/MM/YY HH:MM');
  const endTime = formatDate(dateTo, 'DD/MM/YY HH:MM');
  const typeOffers = getTypeOffers(eventType, offers) || [];
  const isEventTypeChecked = (type) => type === eventType ? 'checked' : '';

  const priceNumber = Number(basePrice);
  const isPriceValid = !Number.isNaN(priceNumber) && priceNumber > 0;
  const isDestinationValid = !!destination;
  const isDurationValid = !!getDuration(dateFrom, dateTo);
  const isSubmitDisabled = !isPriceValid || !isDestinationValid || !isDurationValid || isDisabled;

  const saveButtonText = isSaving ? 'Saving...' : 'Save';
  const deleteButtonText = isDeleting ? 'Deleting...' : 'Delete';

  return `
            <li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="${eventIconUrl}" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        <div class="event__type-item">
                          <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${isEventTypeChecked('taxi')}>
                          <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${isEventTypeChecked('bus')}>
                          <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${isEventTypeChecked('train')}>
                          <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${isEventTypeChecked('ship')}>
                          <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${isEventTypeChecked('drive')}>
                          <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${isEventTypeChecked('flight')}>
                          <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${isEventTypeChecked('check-in')}>
                          <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${isEventTypeChecked('sightseeing')}>
                          <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${isEventTypeChecked('restaurant')}>
                          <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${eventType}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" required value="${destination?.name ?? ''}" list="destination-list-1">
                    <datalist id="destination-list-1">
                        ${destinations.map((d) => `<option value="${d.name}"></option>`).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>${saveButtonText}</button>
                  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${deleteButtonText}</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                        ${typeOffers.map((offer) => getOfferTemplate(offer, eventOffers)).join('')}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination?.description ?? ''}</p>
                    ${destination?.pictures?.length ? `
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
                      </div>
                    </div>
                    ` : ''}
                  </section>
                </section>
              </form>
            </li>
  `;
}

export default class EditForm extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleClick = null;
  #handleDelete = null;
  #datepicker = null;
  #isDisabled = false;
  #isSaving = false;
  #isDeleting = false;

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({type: evt.target.value, offers: [] });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const foundDestination = this.#destinations.find((dest) => dest.name === destinationName);
    if (foundDestination) {
      this.updateElement({destination: foundDestination.id});
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({basePrice: Number.parseInt(evt.target.value, 10) });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const {offers} = this._state;
    const {value} = evt.target;
    const newOffers = offers.includes(value) ? offers.filter((i) => i !== value) : [...offers, value];
    this.updateElement({offers: newOffers});
  };

  #dateChangeHandler = (date, isStartTime) => {
    const payload = isStartTime ? {dateFrom: date} : {dateTo: date};
    this.updateElement(payload);
  };

  #setDatePicker = (evt) => {
    const isStartTime = evt.target.getAttribute('name') === 'event-start-time';
    this.#datepicker = flatpickr(
      this.element.querySelector('.event__field-group--time'),
      {
        dateFormat: 'H i',
        defaultDate: isStartTime ? this._state.dateFrom : this._state.dateTo,
        enableTime: true,
        onChange: (res) => this.#dateChangeHandler(res[0], isStartTime),
      },
    );
  };

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    if (this.#handleDelete) {
      this.#handleDelete();
    }
  };

  constructor({event, destinations, offers, submitHandler, clickHandler, deleteHandler}) {
    super();
    this._setState(event);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = submitHandler;
    this.#handleClick = clickHandler;
    this.#handleDelete = deleteHandler;
    this._restoreHandlers();
  }

  get template() {
    return getEditFormTemplate(this._state, this.#destinations, this.#offers, this.#isDisabled, this.#isSaving, this.#isDeleting);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(event) {
    this.updateElement(event);
  }

  setSaving() {
    this.#isSaving = true;
    this.#isDisabled = true;
    this.updateElement({});
  }

  setDeleting() {
    this.#isDeleting = true;
    this.#isDisabled = true;
    this.updateElement({});
  }

  setAborting() {
    this.#isSaving = false;
    this.#isDeleting = false;
    this.#isDisabled = false;
    this.updateElement({});
  }

  _restoreHandlers() {
    this.element.querySelector('.event.event--edit').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault();
      this.#handleClick();
    });
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((element) => element.addEventListener('change', this.#offersChangeHandler));
    this.element.querySelectorAll('.event__input--time').forEach((element) => element.addEventListener('click', this.#setDatePicker));
  }
}
