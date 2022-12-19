import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import smoothscroll from "smoothscroll-polyfill";
import Nav from "Components/Nav";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import UserProvider, { UserContext } from "./UserProvider.jsx";
import LoggedInProvider from "./LoggedInProvider.jsx";
import LoggedInStaffProvider from "./LoggedInStaffProvider.jsx";
import BinBookerTermsOfUseAgreement from "./pages/BinBookerTermsOfUseAgreement";
import { initializeGoogleAnalytics } from "Utils/library.jsx";
import { get } from "Utils/services.jsx";
import "./index.scss";
import "./common.scss";

smoothscroll.polyfill();

//Lazy load the components
const LoginPage = lazy(() => import(/* webpackChunkName: "LoginPage" */ "./pages/Login"));
const ForgotPasswordPage = lazy(() =>
  import(/* webpackChunkName: "ForgotPasswordPage" */ "./pages/ForgotPassword/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() =>
  import(/* webpackChunkName: "ResetPasswordPage" */ "./pages/ForgotPassword/ResetPasswordPage")
);

const SchedulePage = lazy(() => import(/* webpackChunkName: "SchedulePage" */ "./pages/Schedule"));
const ServicesPage = lazy(() => import(/* webpackChunkName: "ServicesPage" */ "./pages/Services"));
const CustomersPage = lazy(() => import(/* webpackChunkName: "CustomersPage" */ "./pages/Customers"));
const CreateOrderPage = lazy(() => import(/* webpackChunkName: "CreateOrderPage" */ "./pages/CreateOrder"));
const OrdersPage = lazy(() => import(/* webpackChunkName: "OrdersPage" */ "./pages/Orders"));
const BinsPage = lazy(() => import(/* webpackChunkName: "BinsPage" */ "./pages/Bins/BinsContainer.jsx"));
const CouponsPage = lazy(() => import(/* webpackChunkName: "CouponsPage" */ "./pages/Coupons/CouponsProvider.jsx"));
const HolidaysPage = lazy(() => import(/* webpackChunkName: "HolidaysPage" */ "./pages/Holidays"));
const ItemsPage = lazy(() => import(/* webpackChunkName: "ItemsPage" */ "./pages/Items"));
const TruckSchedulePage = lazy(() => import(/* webpackChunkName: "TruckSchedulePage" */ "./pages/TruckSchedule"));
const StaffPage = lazy(() => import(/* webpackChunkName: "StaffPage" */ "./pages/Staff"));
const SettingsPage = lazy(() => import(/* webpackChunkName: "SettingsPage" */ "./pages/Settings"));
const ZonesPage = lazy(() => import(/* webpackChunkName: "ZonesPage" */ "./pages/Zones"));

const history = createBrowserHistory();
initializeGoogleAnalytics(history);

function BackEndPages() {
  return (
    <BinBookerTermsOfUseAgreement>
      <LoggedInStaffProvider>
        <LoggedInProvider>
          <div className="app-wrapper">
            <Nav />
            <main>
              <Suspense fallback={<SpinnerCentred />}>
                <Route path="/back/schedule" render={() => <SchedulePage />} />
                <Route path="/back/services" render={() => <ServicesPage />} />
                <Route path="/back/customers" render={() => <CustomersPage />} />
                <Route path="/back/create-order" render={() => <CreateOrderPage />} />
                <Route path="/back/orders" render={() => <OrdersPage />} />
                <Route path="/back/bins" render={() => <BinsPage />} />
                <Route path="/back/coupons" render={() => <CouponsPage />} />
                <Route path="/back/items" render={() => <ItemsPage />} />
                <Route path="/back/truck-schedule" render={() => <TruckSchedulePage />} />
                <Route path="/back/staff" render={() => <StaffPage />} />
                <Route path="/back/settings" render={() => <SettingsPage />} />
                <Route path="/back/holidays" render={() => <HolidaysPage />} />
                <Route path="/back/zones" render={() => <ZonesPage />} />
              </Suspense>
            </main>
          </div>
        </LoggedInProvider>
      </LoggedInStaffProvider>
    </BinBookerTermsOfUseAgreement>
  );
}

function BackEndApp() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(null);
  const user = React.useContext(UserContext);

  React.useEffect(() => {
    async function checkIfLoggedIn() {
      const result = await get("/api/v1/is-logged-in.php");
      setIsLoggedIn(result.isLoggedIn);
    }

    checkIfLoggedIn();
    document.getElementById("favicon").href = `/images/favicons/${user.faviconPath}`;
  }, []);

  // not sure if they are logged in yet
  if (isLoggedIn === null) {
    return <SpinnerCentred />;
  }

  if (isLoggedIn && window.location.pathname === "/back/login") {
    return <Redirect to="/back/schedule" />;
  }

  if (!isLoggedIn) {
    switch (window.location.pathname) {
      case "/back/login":
      case "/back/forgot-password":
      case "/back/reset-password":
        break;
      default:
        return <Redirect to="/back/login" />;
    }
  }

  return (
    <Switch>
      <Route
        exact
        path="/back/login"
        render={() => (
          <Suspense fallback={<SpinnerCentred />}>
            <LoginPage />
          </Suspense>
        )}
      />
      <Route
        exact
        path="/back/forgot-password"
        render={() => (
          <Suspense fallback={<SpinnerCentred />}>
            <ForgotPasswordPage />
          </Suspense>
        )}
      />
      <Route
        exact
        path="/back/reset-password"
        render={() => (
          <Suspense fallback={<SpinnerCentred />}>
            <ResetPasswordPage />
          </Suspense>
        )}
      />

      <Route render={() => <BackEndPages />} />
    </Switch>
  );
}

ReactDOM.render(
  <React.Fragment>
    <Router history={history}>
      <UserProvider>
        <BackEndApp />
      </UserProvider>
    </Router>
  </React.Fragment>,
  document.getElementById("app-container")
);
