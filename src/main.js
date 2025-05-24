import TripPresenter from './presenter/trip-presenter';
import EventsModel from './models/events-model';
import FilterPresenter from './presenter/filter-presenter';
import FilterModel from './models/filter-model';

const eventsModel = new EventsModel();
const filterModel = new FilterModel();

const filterContainer = document.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter({filterContainer, filterModel});
filterPresenter.init();

const tripPresenter = new TripPresenter({eventsModel, filterModel});
tripPresenter.init();
