import React, {useState, Fragment} from "react";
import {connect} from "react-redux";
import classes from "./Layout.module.css";
import Toolbar from "../Navigation/Toolbar/Toolbar";
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";

const Layout = props => {
	const [showSideDrawer, setShowSideDrawer] = useState(false);

	const sideDrawerClosed = () => {
		setShowSideDrawer(false);
	};

	const sideDrawerToggleHandler = () => {
		setShowSideDrawer(!showSideDrawer);
	};

	return (
		<Fragment>
			<Toolbar
				isAuth={props.isAuthenticated}
				drawToggleClicked={sideDrawerToggleHandler}
			/>
			<SideDrawer
				isAuth={props.isAuthenticated}
				open={showSideDrawer}
				closed={sideDrawerClosed}
			/>
			<main className={classes.Content}>{props.children}</main>
		</Fragment>
	);
};

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

export default connect(mapStateToProps)(Layout);
