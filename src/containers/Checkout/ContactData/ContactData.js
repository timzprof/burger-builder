import React, { Component } from "react";
import classes from "./ContactData.module.css";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import client from "../../../axios-orders";

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Your Name",
					value: ""
				},
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
					value: ""
				},
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
					placeholder: "ZIP Code",
					value: ""
				},
				validation: {
					required: true,
					minLength: 5,
					maxLength: 5
				},
				valid: false,
				touched: false
			},
			country: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Country",
					value: ""
				},
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
					value: ""
				},
				validation: {
					required: true
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
				validation: {},
				valid: true
			}
		},
		formIsValid: false,
		loading: false
	};

	checkValidity = (value, rules) => {
		let isValid = true;
		if(rules.required) {
			isValid = value.trim() !== '' && isValid;
		}
		if(rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}
		if(rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}
		return isValid;
	}

	orderHandler = e => {
		e.preventDefault(); 
		this.setState({ loading: true });
		const formData = {};
		for (let formElementId in this.state.orderForm) {
			formData[formElementId] = this.state.orderForm[formElementId].value;
		}
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price,
			orderData: formData
		};
		client
			.post("/orders.json", order)
			.then(response => {
				this.setState({ loading: false });
				this.props.history.push("/");
			})
			.catch(error => {
				console.log(error);
				this.setState({ loading: false });
			});
	};

	inputChangeHandler = (e, inputId) => {
		const orderForm = {
			...this.state.orderForm
		};
		const orderFormElement = { ...orderForm[inputId] };
		orderFormElement.value = e.target.value;
		orderFormElement.valid = this.checkValidity(orderFormElement.value, orderFormElement.validation);
		orderFormElement.touched = true;
		orderForm[inputId] = orderFormElement;
		let formIsValid = true;
		for(let inputId in orderForm) {
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
						changed={(e) => this.inputChangeHandler(e, formElement.id)}
					/>
				))}
				<Button btnType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid}>
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
