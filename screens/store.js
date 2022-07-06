import { createStore, combineReducers } from 'redux';
import personaReducer from './reducers/personaReducer';

const rootReducer = combineReducers({
    personaReducer: personaReducer
})

const configureStore = () => createStore(rootReducer);

export default configureStore;