import * as actionTypes from './actionTypes';
import client from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_ORDER_SUCCESS,
        orderId: id,
        orderData
    };
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_ORDER_FAILED,
        error
    };
}

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_ORDER_START
    };
};

export const purchaseBurger = (orderData, token) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        client
			.post("/orders.json?auth=" + token, orderData)
			.then(response => {
				dispatch(purchaseBurgerSuccess(response.data.name, orderData));
			})
			.catch(error => {
                dispatch(purchaseBurgerFail(error));
			});
    }
}

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};


export const fectchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders
    };
};

export const fectchOrdersFail = (error) => {
    return {
        type: actionTypes.PURCHASE_ORDER_FAILED,
        error
    };
}

export const fectchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = (token, userId) => {
    return dispatch => {
        dispatch(fectchOrdersStart());
        const queryParams = `?auth=${token}&orderBy="userId"&equalTo="${userId}"`;
        client 
			.get("/orders.json" + queryParams)
			.then(res => {
				const fetchedOrders = Object.keys(res.data).map(key => {
					return { ...res.data[key], id: key };
                });
				dispatch(fectchOrdersSuccess(fetchedOrders));
			})
			.catch(error => {
				dispatch(fectchOrdersFail(error));
            });
    };
};