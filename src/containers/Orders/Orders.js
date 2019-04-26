import React, { Component } from "react";
import Order from "../../components/Order/Order";
import client from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Orders extends Component {
	state = {
		orders: [],
		loading: true
	};

	componentDidMount() {
		client
			.get("/orders.json")
			.then(res => {
				const fetchedOrders = Object.keys(res.data).map(key => {
					return { ...res.data[key], id: key };
                });
				this.setState({ loading: false, orders: fetchedOrders });
			})
			.catch(error => {
				this.setState({ loading: false });
            });
	}
	render() {
		return (
			<div>
				{this.state.orders.map(order => (
					<Order
						key={order.id}
						ingredients={order.ingredients}
						price={order.price}
					/>
				))}
			</div>
		);
	}
}

export default withErrorHandler(Orders, client);
