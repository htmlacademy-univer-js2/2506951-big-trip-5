import Presenter from './presenter/presenter';
import EventsModel from './models/events-model';

const eventsModel = new EventsModel();
const presenter = new Presenter({eventsModel});

presenter.init();
