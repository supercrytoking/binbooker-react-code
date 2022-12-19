import React from "react";
import { withRouter, Redirect, Route, Switch } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { bool, number, shape, string } from "prop-types";
import NavWithHistory from "./components/Nav/NavWithHistory.jsx";
import CompanyHeader from "./components/CompanyHeader/CompanyHeader.jsx";
import BinBookerFooter from "./components/BinBookerFooter/BinBookerFooter.jsx";
import CodeContainer from "./Code/CodeContainer.jsx";
import DateContainer from "./Date/DateContainer.jsx";
import ServiceContainer from "./Service/ServiceContainer.jsx";
import InfoContainer from "./Info/InfoContainer.jsx";
import PaymentContainer from "./Payment/PaymentContainer.jsx";
import Confirmation from "./Confirmation/Confirmation.jsx";
import { PAYMENT_METHODS } from "Utils/constants.jsx";
import { formatPostalCode } from "Utils/library.jsx";
import "./CreateOrder.scss";

// This is the 'create-order' feature that is called from both the back-end and the front-end
// So it manages the state (details) for the order being created.

const blankService = {
  id: null,
  title: "",
  description: "",
  imagePath: "",
  rentalPrice: 0,
  extraDaysPrice: 0,
  binId: 0
};

const blankOrder = {
  id: null,
  dropOffDate: null,
  manualDiscount: 0,
  couponCode: "",
  couponValue: 0,
  paymentMethod: null,
  pickUpDate: null,
  service: blankService,
  poNumber: "",
  bin: null
};

class CreateOrder extends React.Component {
  static propTypes = {
    isLoggedIn: bool.isRequired,

    user: shape({
      cityText: string,
      companyName: string,
      confirmationText: string,
      dateText: string,
      email: string,
      infoText: string,
      logoPath: string,
      phoneNumber: string,
      reviewText: string,
      serviceText: string,
      showHeader: bool,
      stripePublishableKey: string,
      tax1: number,
      tax1Name: string,
      tax2: number,
      tax2Name: string,
      termsAndConditions: string,
      url: string
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      order: { ...blankOrder, paymentMethod: props.user.defaultPaymentMethod },
      customer: {
        id: null,
        firstName: "",
        lastName: "",
        companyName: "",
        phone: "",
        email: "",
        notes: null, // null so when place an order from front-end, it doesnt blank out whatever was in the DB previously

        deliveryStreet1: "",
        deliveryCity: "",
        deliveryPostalCode: "",
        deliveryProvince: props.user.province,
        driverNotes: "",

        billingStreet1: "",
        billingCity: "",
        billingPostalCode: "",
        billingProvince: props.user.province,

        stripeId: ""
      },
      dontChoosePickUpDateIsChecked: false
    };
  }

  componentDidMount() {
    this.setStateIfDemoAccount();
  }

  setStateIfDemoAccount = () => {
    if (window.location.host === "sample.binbooker.com") {
      let customer = {
        id: this.props.isLoggedIn ? 68 : null,
        firstName: "Bugs",
        lastName: "Bunny",
        companyName: "",
        phone: "111-222-1111",
        email: "bugs@acme.com",
        notes: "He is a wascally wabbit",
        deliveryStreet1: "11 Broadway Street",
        deliveryCity: "Seattle",
        deliveryPostalCode: "98116",
        deliveryProvince: "WA",
        driverNotes: "",
        billingStreet1: "11 Broadway Street",
        billingCity: "Seattle",
        billingPostalCode: "98116",
        billingProvince: "WA",
        stripeId: this.props.isLoggedIn ? "cus_BXAcHphEpDA6nt" : ""
      };

      if (this.props.user.currency === "CAD") {
        customer.deliveryCity = "Toronto";
        customer.deliveryPostalCode = "M4A 2M9";
        customer.deliveryProvince = "ON";
        customer.billingCity = "Toronto";
        customer.billingPostalCode = "M4A 2M9";
        customer.billingProvince = "ON";
      }

      this.setState({ customer });
    }
  };

  handleCodeChange = newPostalCode => {
    const customer = Object.assign({}, this.state.customer);
    customer.deliveryPostalCode = newPostalCode;

    //only do this if they havent done the 'info' step yet; dont want to overwrite what they entered
    if (customer.firstName === "") {
      customer.billingPostalCode = newPostalCode;
    }

    this.setState({ customer });
  };

  handleDatesChange = props => {
    let startDate = null;
    let endDate = null;

    if (props.hasOwnProperty("startDate")) {
      startDate = props.startDate;
      endDate = props.endDate;
    } else {
      startDate = props;
    }

    const order = Object.assign({}, this.state.order);
    order.dropOffDate = startDate;
    order.pickUpDate = endDate;
    order.service.id = null; // unset it
    order.bin = blankOrder.bin; // unset it

    this.setState({ order });
  };

  handleToggleDontChoosePickUpDate = () => {
    this.setState({
      dontChoosePickUpDateIsChecked: !this.state.dontChoosePickUpDateIsChecked,
      order: { ...this.state.order, pickUpDate: null }
    });
  };

  handleServiceChange = service => {
    const order = Object.assign({}, this.state.order);
    order.service = service;
    order.bin = blankOrder.bin; // unset it
    this.setState({ order });
  };

  handleChangeActiveBin = bin => {
    const order = Object.assign({}, this.state.order);
    order.bin = bin;
    this.setState({ order });
  };

  handleSelectSuggestedDates = ({ startDate, endDate }, service) => {
    const order = Object.assign({}, this.state.order);
    order.dropOffDate = startDate;
    order.pickUpDate = endDate;
    order.service = service;
    this.setState({ order });
    this.props.history.push("info");
  };

  handleInfoChange = (customer, isSame) => {
    if (isSame) {
      customer.deliveryStreet1 = customer.billingStreet1;
      customer.deliveryCity = customer.billingCity;
      customer.deliveryProvince = customer.billingProvince;
    }

    this.setState({ customer });
  };

  handleChangeManualDiscount = manualDiscount => {
    const newOrder = Object.assign({}, this.state.order);
    newOrder.manualDiscount = +manualDiscount;
    this.setState({ order: newOrder });
  };

  handleChangePaymentMethod = paymentMethod => {
    const newOrder = Object.assign({}, this.state.order);
    newOrder.paymentMethod = paymentMethod;
    this.setState({ order: newOrder });
  };

  handleChangePoNumber = e => {
    const newOrder = Object.assign({}, this.state.order);
    newOrder.poNumber = e.target.value;
    this.setState({ order: newOrder });
  };

  handleCreateAnotherOrder = history => {
    this.setState({
      order: { ...blankOrder, paymentMethod: this.props.user.defaultPaymentMethod }
    });

    history.push("date");
  };

  handleChangeCouponCode = code => {
    const order = Object.assign({}, this.state.order);
    order.couponCode = code;
    this.setState({ order });
  };

  handleClickApplyCoupon = value => {
    const order = Object.assign({}, this.state.order);
    order.couponValue = parseFloat(value);
    this.setState({ order });
  };

  renderNav(currentStep) {
    return currentStep === "confirmation" ? null : <NavWithHistory currentStep={currentStep} />;
  }

  render() {
    const currentStep = window.location.pathname.replace("back/create-order/", "").replace("/", "");

    const StripeAlert = this.props.user.useTestStripe ? (
      <Alert bsStyle="warning">
        WARNING: Your account is currently using TEST Stripe keys. You can only charge real credit cards when using LIVE
        Stripe keys.
      </Alert>
    ) : null;

    return (
      <div className="create-order">
        {!this.props.isLoggedIn && this.props.user.showHeader && (
          <CompanyHeader
            email={this.props.user.email}
            logoPath={`/images/logos/${this.props.user.logoPath}`}
            phoneNumber={this.props.user.phoneNumber}
            url={this.props.user.url}
          />
        )}

        {currentStep && this.renderNav(currentStep)}
        {StripeAlert}

        <div className="create-order__body col-md-offset-2 col-md-8">
          <Switch>
            <Redirect exact from="/" to="code" />
            <Redirect exact from="/back/create-order" to="/back/create-order/code" />
            <Route
              path="*/code"
              render={({ history }) => (
                <CodeContainer
                  postalCode={this.state.customer.deliveryPostalCode}
                  isBackEnd={this.props.isLoggedIn}
                  onChange={this.handleCodeChange}
                  onValidContinue={() => {
                    const newCustomer = Object.assign({}, this.state.customer);
                    newCustomer.deliveryPostalCode = formatPostalCode(
                      this.state.customer.deliveryPostalCode,
                      this.props.user.currency
                    );
                    newCustomer.billingPostalCode = newCustomer.deliveryPostalCode;
                    this.setState({ customer: newCustomer });
                    history.push("date");
                  }}
                />
              )}
            />
            <Route
              path="*/date"
              render={({ history }) => {
                if (!this.state.customer.deliveryPostalCode) {
                  return <Redirect to="code" />;
                }

                return (
                  <DateContainer
                    deliveryPostalCode={this.state.customer.deliveryPostalCode}
                    dontChoosePickUpDateIsChecked={this.state.dontChoosePickUpDateIsChecked}
                    dropOffDate={this.state.order.dropOffDate}
                    history={history}
                    isBackEnd={this.props.isLoggedIn}
                    onChange={this.handleDatesChange}
                    onClickBack={() => {
                      history.push("code");
                    }}
                    onToggleDontChoosePickUpDate={this.handleToggleDontChoosePickUpDate}
                    onValidContinue={() => {
                      history.push("service");
                    }}
                    pickUpDate={this.state.order.pickUpDate}
                  />
                );
              }}
            />
            <Route
              path="*/service"
              render={({ history }) => {
                if (
                  !this.state.order.dropOffDate ||
                  (!this.state.dontChoosePickUpDateIsChecked && !this.state.order.pickUpDate)
                ) {
                  return <Redirect to="date" />;
                }

                return (
                  <ServiceContainer
                    activeBin={this.state.order.bin}
                    activeServiceId={this.state.order.service.id}
                    dropOffDate={this.state.order.dropOffDate}
                    onChange={this.handleServiceChange}
                    onChangeActiveBin={this.handleChangeActiveBin}
                    onClickBack={() => {
                      history.push("date");
                    }}
                    onValidContinue={() => {
                      history.push("info");
                    }}
                    pickUpDate={this.state.order.pickUpDate}
                    handleSelectSuggestedDates={this.handleSelectSuggestedDates}
                    postalCode={this.state.customer.deliveryPostalCode}
                  />
                );
              }}
            />
            <Route
              path="*/info"
              render={({ history }) => {
                if (!this.state.order.service.id) {
                  return <Redirect to="service" />;
                }

                return (
                  <InfoContainer
                    customer={this.state.customer}
                    isBackEnd={this.props.isLoggedIn}
                    onChange={this.handleInfoChange}
                    onClickBack={() => {
                      history.push("service");
                    }}
                    onValidContinue={() => {
                      if (this.state.customer.stripeId) {
                        if (this.props.user.defaultPaymentMethod === PAYMENT_METHODS.creditCard) {
                          this.handleChangePaymentMethod(PAYMENT_METHODS.stripe);
                        } else {
                          this.handleChangePaymentMethod(PAYMENT_METHODS.invoice);
                        }
                      } else {
                        this.handleChangePaymentMethod(this.props.user.defaultPaymentMethod);
                      }

                      history.push("review");
                    }}
                    postalCode={this.state.customer.deliveryPostalCode}
                  />
                );
              }}
            />
            <Route
              path="*/review"
              render={({ history }) => {
                if (
                  !this.state.order.dropOffDate ||
                  (!this.state.dontChoosePickUpDateIsChecked && !this.state.order.pickUpDate) ||
                  !this.state.order.service.id ||
                  this.state.customer.firstName === "" ||
                  this.state.customer.lastName === "" ||
                  this.state.customer.phone === "" ||
                  this.state.customer.email === "" ||
                  this.state.customer.deliveryStreet1 === "" ||
                  this.state.customer.deliveryCity === "" ||
                  this.state.customer.deliveryPostalCode === "" ||
                  this.state.customer.deliveryProvince === "" ||
                  this.state.customer.billingStreet1 === "" ||
                  this.state.customer.billingCity === "" ||
                  this.state.customer.billingPostalCode === "" ||
                  this.state.customer.billingProvince === ""
                ) {
                  return <Redirect to="info" />;
                }

                return (
                  <PaymentContainer
                    bin={this.state.order.bin}
                    customer={this.state.customer}
                    dropOffDate={this.state.order.dropOffDate}
                    isBackEnd={this.props.isLoggedIn}
                    manualDiscount={this.state.order.manualDiscount}
                    onChangeManualDiscount={this.handleChangeManualDiscount}
                    onChangePaymentMethod={this.handleChangePaymentMethod}
                    onChangePoNumber={this.handleChangePoNumber}
                    onClickBack={() => {
                      history.push("info");
                    }}
                    onValidContinue={orderId => {
                      const newOrder = Object.assign({}, this.state.order);
                      newOrder.id = orderId;
                      this.setState({ order: newOrder });
                      history.push("confirmation");
                    }}
                    paymentMethod={this.state.order.paymentMethod}
                    poNumber={this.state.order.poNumber}
                    pickUpDate={this.state.order.pickUpDate}
                    service={this.state.order.service}
                    tax1={+this.props.user.tax1}
                    tax1Name={this.props.user.tax1Name}
                    tax2={+this.props.user.tax2}
                    tax2Name={this.props.user.tax2Name}
                    termsAndConditions={this.props.user.termsAndConditions}
                    // Coupon props
                    couponCode={this.state.order.couponCode}
                    onChangeCouponCode={this.handleChangeCouponCode}
                    onClickApplyCoupon={this.handleClickApplyCoupon}
                    couponValue={this.state.order.couponValue}
                  />
                );
              }}
            />
            <Route
              path="*/confirmation"
              render={({ history }) => {
                if (!this.state.order.id) {
                  return <Redirect to="review" />;
                }

                return (
                  <Confirmation
                    companyName={this.props.user.companyName}
                    companyEmailAddress={this.props.user.email}
                    companyPhone={this.props.user.phoneNumber}
                    companyUrl={this.props.user.url}
                    customerEmailAddress={this.state.customer.email}
                    customUserText={this.props.user.confirmationText}
                    onClickCreateAnotherOrder={e => {
                      e.preventDefault();

                      this.handleCreateAnotherOrder(history);
                    }}
                    paymentMethod={this.state.order.paymentMethod}
                    orderId={this.state.order.id}
                  />
                );
              }}
            />
          </Switch>
        </div>
        {!this.props.isLoggedIn && <BinBookerFooter />}
      </div>
    );
  }
}

export default withRouter(CreateOrder);
