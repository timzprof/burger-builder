import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
	orders: [],
	loading: false,
	purchased: false
};

const purchaseInit = (state, action) => {
    return updateObject(state, {
        purchased: false
    });
};

const purcahseOrderStart = (state, action) => {
    return updateObject(state, {
        purchased: true
    });
};

const purchaseOrderSuccess = (state, action) => {
    const newOrder = updateObject(action.orderData, {
        id: action.orderId,
        purchased: true
    });
    return updateObject(state, {
        loading: false,
        orders: state.orders.concat(newOrder)
    });
};

const purchaseOrderFailed = (state, action) => {
    return updateObject(state, {
        loading: false
    });
};

const fetchOrdersStart = (state, action) => {
    return updateObject(state, {
        loading: true
    });
};

const fetchOrdersSuccess = (state, action) => {
    return updateObject(state, {
        loading: false,
        orders: action.orders
    });
};

const fetchOrdersFailed = (state, action) => {
    return updateObject(state, {
        loading: false
    });
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.PURCHASE_INIT: return purchaseInit(state, action);
		case actionTypes.PURCHASE_ORDER_START: return purcahseOrderStart(state, action);
		case actionTypes.PURCHASE_ORDER_SUCCESS: return purchaseOrderSuccess(state, action);
		case actionTypes.PURCHASE_ORDER_FAILED: return purchaseOrderFailed(state, action);
		case actionTypes.FETCH_ORDERS_START: return fetchOrdersStart(state, action);
		case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrdersSuccess(state, action);
		case actionTypes.FETCH_ORDERS_FAILED: return fetchOrdersFailed(state, action);
		default: return state;
	}
};

export default reducer;
