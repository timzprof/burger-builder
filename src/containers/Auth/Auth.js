import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import classes from "./Auth.module.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';

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

	inputChangeHandler = (e, controlName) => {
		const authForm =  updateObject(this.state.controls, {
			[controlName]: updateObject(this.state.controls[controlName], {
				value: e.target.value,
				valid: checkValidity(
					e.target.value,
					this.state.controls[controlName].validation
				),
				touched: true
			})
		})
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

	componentDidMount() {
		if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
			this.props.onSetAuthRedirectPath();
		}
	}

	render() {
		const formElements = Object.keys(this.state.controls).map(key => {
			return {
				id: key,
				config: this.state.controls[key]
			};
		});

		let form = formElements.map(formElement => (
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
        
        if(this.props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;

        if(this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
		}
		
		let authRedirect = null;

		if(this.props.isAuthenticated){
			authRedirect = <Redirect to={this.props.authRedirectPath}/>;
		}

		return (
			<div className={classes.Auth}>
				{authRedirect}
				<h4>{this.state.isSignUp ? "SIGN UP" : "SIGN IN"}</h4>
                {errorMessage}
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

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirect: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Auth);
