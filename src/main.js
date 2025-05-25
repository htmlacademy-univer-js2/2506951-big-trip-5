import TripPresenter from './presenter/trip-presenter.js';
import EventsModel from './models/events-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './models/filter-model.js';
import EventsApiService from './api/events-api-service.js';

const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic dsdadadagfagad';

const eventsApiService = new EventsApiService(END_POINT, AUTHORIZATION);
const eventsModel = new EventsModel({eventsApiService});
const filterModel = new FilterModel();

const filterContainer = document.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter({filterContainer, filterModel});
filterPresenter.init();

const tripPresenter = new TripPresenter({eventsModel, filterModel});
tripPresenter.init();
