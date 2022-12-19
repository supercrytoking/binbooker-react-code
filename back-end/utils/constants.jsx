// match OrderItem.class.php
export const PAYMENT_METHODS = {
  invoice: "invoice",
  creditCard: "credit-card", // new credit card
  stripe: "stripe", // credit card on file
  preAuth: "pre-auth", // collect credit card so can create stripe profile, but dont charge it yet
  cash: "cash"
};

export const CURRENCY = {
  CAD: "CAD",
  USD: "USD"
};

export const NO_PICKUP_DATE = "2100-01-01"; // this is also in library/config.php
