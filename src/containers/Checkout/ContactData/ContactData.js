import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./ContactData.module.css";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import client from "../../../axios-orders";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import { updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Your Name",
				},
				value: "",
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			street: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Street",
				},
				value: "",
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			zipCode: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "ZIP Code"
				},
				value: "",
				validation: {
					required: true,
					minLength: 5,
					maxLength: 5,
					isNumeric: true
				},
				valid: false,
				touched: false
			},
			country: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Country",
				},
				value: "",
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			email: {
				elementType: "input",
				elementConfig: {
					type: "email",
					placeholder: "Your Email",
				},
				value: "",
				validation: {
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false
			},
			deliveryMethod: {
				elementType: "select",
				elementConfig: {
					options: [
						{ value: "fastest", displayValue: "Fastest" },
						{ value: "cheapest", displayValue: "Cheapest" }
					]
				},
				value: 'fastest',
				validation: {},
				valid: true
			}
		},
		formIsValid: false
	};

	orderHandler = e => {
		e.preventDefault();
		const formData = {};
		for (let formElementId in this.state.orderForm) {
			formData[formElementId] = this.state.orderForm[formElementId].value;
		}
		const orderData = {
			ingredients: this.props.ings,
			price: this.props.total,
			orderData: formData,
			userId: this.props.userId
		};
		this.props.onOrderBurger(orderData, this.props.token);
	};

	inputChangeHandler = (e, inputId) => {
		
		const orderFormElement = updateObject(this.state.orderForm[inputId], {
			value: e.target.value,
			valid: checkValidity(e.target.value, this.state.orderForm[inputId].validation),
			touched: true
		});

		const orderForm = updateObject(this.state.orderForm, {
			[inputId]: orderFormElement
		});

		let formIsValid = true;
		for (let inputId in orderForm) {
			formIsValid = orderForm[inputId].valid && formIsValid;
		}
		this.setState({ orderForm, formIsValid });
	};

	render() {
		const formElements = Object.keys(this.state.orderForm).map(key => {
			return {
				id: key,
				config: this.state.orderForm[key]
			};
		});
		let form = (
			<form onSubmit={this.orderHandler}>
				{formElements.map(formElement => (
					<Input
						key={formElement.id}
						elementType={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						invalid={!formElement.config.valid}
						touched={formElement.config.touched}
						shouldValidate={formElement.config.validation}
						changed={e => this.inputChangeHandler(e, formElement.id)}
					/>
				))}
				<Button
					btnType="Success"
					clicked={this.orderHandler}
					disabled={!this.state.formIsValid}
				>
					ORDER
				</Button>
			</form>
		);
		if (this.props.loading) {
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

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		total: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onOrderBurger: (orderData,token) => dispatch(actions.purchaseBurger(orderData, token))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(ContactData, client));
