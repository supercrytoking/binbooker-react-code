import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import smoothscroll from "smoothscroll-polyfill";
import UserProvider, { UserContext } from "../back-end/UserProvider.jsx";
import { initializeGoogleAnalytics } from "Utils/library.jsx";
import Spinner from "Components/Spinner";
import { darkenHexColour } from "Utils/library";
import "./front-end.scss";

smoothscroll.polyfill();

const CreateOrder = lazy(() =>
  import(/* webpackChunkName: "CreateOrder" */ "../back-end/pages/CreateOrder/CreateOrder.jsx")
);

// This is the provider of the front-end

const history = createBrowserHistory();
initializeGoogleAnalytics(history);

function FrontEndCreateOrderWrapper() {
  const user = React.useContext(UserContext);

  React.useEffect(() => {
    const primaryColour = user.colour; // a string like "#337ab7"
    const darkerColour = darkenHexColour(primaryColour);

    const $style = document.createElement("style");
    document.head.appendChild($style);

    $style.innerHTML = `
      a,
      .btn-link {
        color: ${primaryColour};
      }
      
      a:active,
      a:focus,
      a:hover,
      .btn-link:hover {
        color: ${darkerColour};
      }

      .btn-primary {
        background-color: ${primaryColour};
        border-color: ${darkerColour};
      }

      .btn-primary:active,
      .btn-primary:active:focus,
      .btn-primary:focus,
      .btn-primary:hover,
      .btn-primary[disabled]:hover {
        background-color: ${darkerColour};
        border-color: ${darkerColour};
      }

      .bs-wizard-step.active .bs-wizard-dot,
      .bs-wizard-step.complete .bs-wizard-dot {
        background-color: ${primaryColour} !important;
      }
      .bs-wizard-dot::after {
        background: ${darkerColour} !important;
      }
      .bs-wizard .progress-bar {
        background: ${primaryColour} !important;
      }

      .create-order-date-wrapper .DateInput .DateInput_input__focused {
        border-bottom: 2px solid ${primaryColour} !important;
      }
    `;

    document.getElementById("favicon").href = `/images/favicons/${user.faviconPath}`;
  }, [user.colour, user.faviconPath]);

  return <CreateOrder isLoggedIn={false} user={user} />;
}

ReactDOM.render(
  <UserProvider>
    <div className="fe__create-order-wrapper">
      <Router history={history}>
        <Suspense fallback={<Spinner />}>
          <FrontEndCreateOrderWrapper />
        </Suspense>
      </Router>
    </div>
  </UserProvider>,
  document.getElementById("app-container")
);
