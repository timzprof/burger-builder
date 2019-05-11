import React, { Component, lazy, Suspense } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Layout from "./components/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Spinner from "./components/UI/Spinner/Spinner";
import * as actions from "./store/actions/index";

const Checkout = lazy(() => import("./containers/Checkout/Checkout"));
const Orders = lazy(() => import("./containers/Orders/Orders"));
const Auth = lazy(() => import("./containers/Auth/Auth"));
const Logout = lazy(() => import("./containers/Auth/Logout/Logout"));

const LazyRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props => (
			<Suspense fallback={<Spinner />}>
				<Component {...props} />
			</Suspense>
		)}
	/>
);

class App extends Component {
	componentDidMount() {
		this.props.onTryAutoSignup();
	}

	render() {
		let routes = (
			<Switch>
				<Route path="/" exact component={BurgerBuilder} />
				<LazyRoute path="/auth" component={Auth} />
				<Redirect to="/" />
			</Switch>
		);

		if (this.props.isAuthenticated) {
			routes = (
				<Switch>
					<Route path="/" exact component={BurgerBuilder} />
					<LazyRoute path="/auth" component={Auth} />
					<LazyRoute path="/checkout" component={Checkout} />
					<LazyRoute path="/orders" component={Orders} />
					<LazyRoute path="/logout" component={Logout} />
					<Redirect to="/" />
				</Switch>
			);
		}
		return (
			<div>
				<Layout>{routes}</Layout>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckState())
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(App)
);
