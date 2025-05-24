import TripPresenter from './presenter/trip-presenter';
import EventsModel from './models/events-model';

const eventsModel = new EventsModel();
const presenter = new TripPresenter({eventsModel});

presenter.init();
