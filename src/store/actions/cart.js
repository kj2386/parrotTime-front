
import { authAxios } from '../../utils';
import * as actionTypes from './actionTypes';
import { orderSummaryUrl } from '../../constants';

export const cartStart = () => {
  return {
    type: actionTypes.CART_START
  };
};

export const cartSuccess = data => {
  console.log(data);
  return {
    type: actionTypes.CART_SUCCESS,
    data
  };
};

export const cartFail = error => {
  return {
    type: actionTypes.CART_FAIL,
    error: error
  };
};

export const fetchCart = () => {
  return dispatch => {
    dispatch(cartStart());
    authAxios
      .get(orderSummaryUrl)
      .then(res => {
        dispatch(cartSuccess(res.data));
      })
      .catch(err => {
        dispatch(cartFail(err));
      });
  };
};
