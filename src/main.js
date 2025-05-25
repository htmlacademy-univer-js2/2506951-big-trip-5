import TripPresenter from './presenter/trip-presenter.js';
import EventsModel from './models/events-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './models/filter-model.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import EventsApiService from './api/events-api-service.js';

const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic dsdadadagfagad';

const eventsApiService = new EventsApiService(END_POINT, AUTHORIZATION);
const eventsModel = new EventsModel({eventsApiService});
const filterModel = new FilterModel();

const filterContainer = document.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter({filterContainer, filterModel, eventsModel});
filterPresenter.init();

const tripInfoContainer = document.querySelector('.trip-main');
const tripInfoPresenter = new TripInfoPresenter({tripInfoContainer, eventsModel});

const tripPresenter = new TripPresenter({eventsModel, filterModel});
tripPresenter.init();

eventsModel.addObserver(() => {
  tripInfoPresenter.init();
});
