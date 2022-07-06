import { RESTORE_TOKEN, SIGN_IN, SIGN_OUT, ADD_CARD, EMAIL } from './types';

export const restoreToken = (persona) => (
    {
        type: RESTORE_TOKEN,
        token: persona
    }
)

export const signIn = (persona) => (
    {
        type: SIGN_IN,
        token: persona
    }
)

export const signOut = () => (
    {
        type: SIGN_OUT
    }
)

export const addCard = (card) => (
    {
        type: ADD_CARD,
        card: card
    }
)

export const addEmail = (email) => (
    {
        type: EMAIL,
        email: email
    }
)