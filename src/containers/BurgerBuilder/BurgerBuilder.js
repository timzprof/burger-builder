import React, {useState, Fragment, useEffect, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import client from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";

const BurgerBuilder = props => {
	const [purchasing, setPurchasing] = useState(false);

	const ings = useSelector(state => {
		return state.burgerBuilder.ingredients;
	});
	const total = useSelector(state => {
		return state.burgerBuilder.totalPrice;
	});
	const error = useSelector(state => {
		return state.burgerBuilder.error;
	});
	const isAuthenticated = useSelector(state => {
		return state.auth.token !== null;
	});

	const dispatch = useDispatch();

	const onIngredientAdded = name => dispatch(actions.addIngredient({name}));
	const onIngredientRemoved = name =>
		dispatch(actions.removeIngredient({name}));
	const onInitIngredients = useCallback(
		() => dispatch(actions.initIngredients()),
		[dispatch]
	);
	const onInitPurchase = () => dispatch(actions.purchaseInit());
	const onSetAuthRedirectPath = path =>
		dispatch(actions.setAuthRedirectPath(path));

	const updatePurchaseState = ingredients => {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0;
	};

	const purchaseHandler = () => {
		if (isAuthenticated) {
			setPurchasing(true);
		} else {
			onSetAuthRedirectPath("/checkout");
			props.history.push("/auth");
		}
	};

	const purchaseCancelHandler = () => {
		setPurchasing(false);
	};

	const purchaseContinueHandler = () => {
		onInitPurchase();
		props.history.push("/checkout");
	};

	useEffect(() => {
		onInitIngredients();
	}, [onInitIngredients]);

	const disabledInfo = {
		...ings
	};
	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}
	let orderSum = null;
	let burger = error ? <p>Ingredients Can't be loaded</p> : <Spinner />;
	if (ings) {
		burger = (
			<Fragment>
				<Burger ingredients={ings} />
				<BuildControls
					ingredientAdded={onIngredientAdded}
					ingredientRemoved={onIngredientRemoved}
					disabled={disabledInfo}
					purchaseable={updatePurchaseState(ings)}
					price={total}
					ordered={purchaseHandler}
					isAuth={isAuthenticated}
				/>
			</Fragment>
		);
		orderSum = (
			<OrderSummary
				ingredients={ings}
				purchaseCanceled={purchaseCancelHandler}
				purchaseContinued={purchaseContinueHandler}
				price={total.toFixed(2)}
			/>
		);
	}

	return (
		<Fragment>
			<Modal show={purchasing} modalClosed={purchaseCancelHandler}>
				{orderSum}
			</Modal>
			{burger}
		</Fragment>
	);
};

export default withErrorHandler(BurgerBuilder, client);
