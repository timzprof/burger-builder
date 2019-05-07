import * as actionTypes from './actionTypes';

export const addIngredient = (payload) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        payload: {
            ingredientName: payload.name
        }
    }
}

export const removeIngredient = (payload) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        payload: {
            ingredientName: payload.name
        }
    }
}