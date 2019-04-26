import React, { Component } from "react";
import classes from "./ContactData.module.css";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import client from "../../../axios-orders";

class ContactData extends Component {
	state = {
		name: "",
		email: "",
		address: {
			street: "",
			postCode: ""
		},
		loading: false
	};

	orderHandler = e => {
		e.preventDefault();
		this.setState({ loading: true });
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price,
			customer: {
				name: "Timilehin",
				address: {
					street: "Bakare",
					zipCode: "101255",
					country: "Nigeria"
				},
				email: "timz@gmail.com"
			},
			deliveryMethod: "Pay on Delivery"
		};
		client
			.post("/orders.json", order)
			.then(response => {
                this.setState({ loading: false });
                this.props.history.push('/');
			})
			.catch(error => {
				console.log(error);
				this.setState({ loading: false });
			});
	};

	render() {
		let form = (
			<form>
				<input
					className={classes.Input}
					type="text"
					name="name"
					placeholder="Your Name"
				/>
				<input
					className={classes.Input}
					type="email"
					name="email"
					placeholder="Your Email"
				/>
				<input
					className={classes.Input}
					type="text"
					name="street"
					placeholder="Your Street"
				/>
				<input
					className={classes.Input}
					type="text"
					name="postal"
					placeholder="Your Postal Code"
				/>
				<Button btnType="Success" clicked={this.orderHandler}>
					ORDER
				</Button>
			</form>
		);
		if (this.state.loading) {
			form = <Spinner />;
		}
		return (
			<div className={classes.ContactData}>
				<h4>Enter your Contact Data</h4>
				{form}
			</div>
		);
	}
}

export default ContactData;
