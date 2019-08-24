import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import classes from "./Auth.module.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = props => {
	const [authForm, setAuthForm] = useState({
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
	});
	const [isSignup, setIsSignUp] = useState(false);

	const inputChangeHandler = (e, controlName) => {
		const newAuthForm =  updateObject(authForm, {
			[controlName]: updateObject(authForm[controlName], {
				value: e.target.value,
				valid: checkValidity(
					e.target.value,
					authForm[controlName].validation
				),
				touched: true
			})
		})
		setAuthForm(newAuthForm);
	};

	const submitHandler = e => {
		e.preventDefault();
		props.onAuth(
			authForm.email.value,
            authForm.password.value,
            isSignUp
		);
	};

	const switchAuthModeHandler = () => {
		setIsSignUp(!isSignup);
	};

	const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;

	useEffect(() =>{
		if(!buildingBurger && authRedirectPath !== '/'){
			onSetAuthRedirectPath();
		}
	}, [buildingBurger, authRedirectPath, onSetAuthRedirectPath])

	render() {
		const formElements = Object.keys(authForm).map(key => {
			return {
				id: key,
				config: authForm[key]
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
				changed={e => inputChangeHandler(e, formElement.id)}
			/>
        ));
        
        if(props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;

        if(props.error) {
            errorMessage = (
                <p>{props.error.message}</p>
            );
		}
		
		let authRedirect = null;

		if(props.isAuthenticated){
			authRedirect = <Redirect to={props.authRedirectPath}/>;
		}

		return (
			<div className={classes.Auth}>
				{authRedirect}
				<h4>{isSignUp ? "SIGN UP" : "SIGN IN"}</h4>
                {errorMessage}
				<form onSubmit={submitHandler}>
					{form}
					<Button btnType="Success">SUBMIT</Button>
				</form>
				<Button clicked={switchAuthModeHandler} btnType="Danger">
					SWITCH TO {isSignUp ? "SIGN IN" : "SIGN UP"}
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
