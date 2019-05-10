import React, { Component } from "react";
import { connect } from "react-redux";
import classes from "./Auth.module.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";

class Auth extends Component {
	state = {
		controls: {
			email: {
				elementType: "input",
				elementConfig: {
					type: "email",
					placeholder: "Your Email"
				},
				value: "",
				validation: {
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false
			},
			password: {
				elementType: "input",
				elementConfig: {
					type: "password",
					placeholder: "Password"
				},
				value: "",
				validation: {
					required: true,
					minLength: 6
				},
				valid: false,
				touched: false
			}
		},
		isSignUp: true
	};

	checkValidity = (value, rules) => {
		let isValid = true;
		if (rules.required) {
			isValid = value.trim() !== "" && isValid;
		}
		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}
		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}

		if (rules.isEmail) {
			const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			isValid = pattern.test(value) && isValid;
		}

		if (rules.isNumeric) {
			const pattern = /^\d+$/;
			isValid = pattern.test(value) && isValid;
		}

		return isValid;
	};

	inputChangeHandler = (e, controlName) => {
		const authForm = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: e.target.value,
				valid: this.checkValidity(
					e.target.value,
					this.state.controls[controlName].validation
				),
				touched: true
			}
		};
		this.setState({ controls: authForm });
	};

	submitHandler = e => {
		e.preventDefault();
		this.props.onAuth(
			this.state.controls.email.value,
            this.state.controls.password.value,
            this.state.isSignUp
		);
	};

	switchAuthModeHandler = () => {
		this.setState(prevState => {
			return { isSignUp: !prevState.isSignUp };
		});
	};

	render() {
		const formElements = Object.keys(this.state.controls).map(key => {
			return {
				id: key,
				config: this.state.controls[key]
			};
		});

		const form = formElements.map(formElement => (
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
		));
		return (
			<div className={classes.Auth}>
				<h4>{this.state.isSignUp ? "SIGN UP" : "SIGN IN"}</h4>
				<form onSubmit={this.submitHandler}>
					{form}
					<Button btnType="Success">SUBMIT</Button>
				</form>
				<Button clicked={this.switchAuthModeHandler} btnType="Danger">
					SWITCH TO {this.state.isSignUp ? "SIGN IN" : "SIGN UP"}
				</Button>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp))
	};
};

export default connect(
	null,
	mapDispatchToProps
)(Auth);
