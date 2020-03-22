const localhost = 'http://127.0.0.1:8000';

export const parrotListUrl = `${localhost}/parrots`;
export const addToCartUrl = `${localhost}/add-to-cart/`;
export const orderSummaryUrl = `${localhost}/order-summary/`;
export const checkoutUrl = `${localhost}/checkout/`;
export const addressListUrl = addressType =>
  `${localhost}/addresses/?address_type=${addressType}`;
export const addressCreateUrl = `${localhost}/addresses/create/`;
export const addressUpdateUrl = id => `${localhost}/addresses/${id}/update/`;
export const addressDeleteUrl = id => `${localhost}/addresses/${id}/delete/`;
export const userIdUrl = `${localhost}/user-id/`;
export const orderItemDeleteUrl = id =>
  `${localhost}/order-items/${id}/delete/`;
export const orderItemUpdateQuantityUrl = `${localhost}/order-item/update-quantity/`;
export const paymentListUrl = `${localhost}/payments/`;
