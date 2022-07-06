import { RESTORE_TOKEN, SIGN_IN, SIGN_OUT, ADD_CARD, EMAIL } from '../actions/types';

const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    crediCard: [],
    email: ""
}

const personaReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESTORE_TOKEN:
            return {
                ...state,
                userToken: action.token,
                isLoading: false,
            };
        case SIGN_IN:
            return {
                ...state,
                userToken: action.token,
                isSignout: false
            };
        case SIGN_OUT:
            return {
                ...state,
                isSignout: true,
                userToken: null,
                crediCard: [],
                email: ""
            };
        case EMAIL:
            return {
                ...state,
                email: action.email
            };
        case ADD_CARD:
            return {
                ...state,
                crediCard: state.crediCard.concat(action.card)
            };
        default:
            return state;
    }
}

export default personaReducer;