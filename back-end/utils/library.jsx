import moment from "moment";
import ReactGA from "react-ga";
import { CURRENCY } from "./constants.jsx";

// The string passed in is a valid dollar amount (no dollar sign, no commas)
export const isValidDollarAmount = function(str, allowNegatives) {
  const regex = allowNegatives ? /^-[0-9]{0,6}\.?[0-9]{0,2}$/ : /^[0-9]{0,6}\.?[0-9]{0,2}$/;

  return regex.test(str) && str.length > 0 && str !== ".";
};

// '2017-08-26'          => 'Wed. Aug. 25, '17'
// '2017-08-26 05:00:00' => 'Wed. Aug. 25, '17'
export const formatDate = function(str) {
  return moment(str).format("ddd. MMM. D, 'YY");
};

// Adds a zero before numbers less than 10 (used for dates)
export const pad = function(number) {
  return number > 9 ? number : `0${number}`;
};

// '1234.5'  => '$1,234.50'
// '-1234.5' => '-$1,234.50'
export const formatDollarAmount = function(n) {
  var c = 2;
  var d = ".";
  var t = ",";
  var s = n < 0 ? "-" : "";
  var i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c))));
  var j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    s +
    "$" +
    (j ? i.substr(0, j) + t : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : "")
  );
};

export const getParameterByName = function(name) {
  var url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const provinces = [
  { value: "AB", text: "Alberta" },
  { value: "BC", text: "British Columbia" },
  { value: "MB", text: "Manitoba" },
  { value: "NB", text: "New Brunswick" },
  { value: "NL", text: "Newfoundland and Labrador" },
  { value: "NS", text: "Nova Scotia" },
  { value: "ON", text: "Ontario" },
  { value: "PE", text: "Prince Edward Island" },
  { value: "QC", text: "Quebec" },
  { value: "SK", text: "Saskatchewan" },
  { value: "NT", text: "Northwest Territories" },
  { value: "NU", text: "Nunavut" },
  { value: "YT", text: "Yukon" }
];

export const states = [
  { value: "AL", text: "Alabama" },
  { value: "AK", text: "Alaska" },
  { value: "AZ", text: "Arizona" },
  { value: "AR", text: "Arkansas" },
  { value: "CA", text: "California" },
  { value: "CO", text: "Colorado" },
  { value: "CT", text: "Connecticut" },
  { value: "DE", text: "Delaware" },
  { value: "DC", text: "District of Columbia" },
  { value: "FL", text: "Florida" },
  { value: "GA", text: "Georgia" },
  { value: "HI", text: "Hawaii" },
  { value: "ID", text: "Idaho" },
  { value: "IL", text: "Illinois" },
  { value: "IN", text: "Indiana" },
  { value: "IA", text: "Iowa" },
  { value: "KS", text: "Kansa" },
  { value: "KY", text: "Kentucky" },
  { value: "LA", text: "Lousiana" },
  { value: "ME", text: "Maine" },
  { value: "MD", text: "Maryland" },
  { value: "MA", text: "Massachusetts" },
  { value: "MI", text: "Michigan" },
  { value: "MN", text: "Minnesota" },
  { value: "MS", text: "Mississippi" },
  { value: "MO", text: "Missouri" },
  { value: "MT", text: "Montana" },
  { value: "NE", text: "Nebraska" },
  { value: "NV", text: "Nevada" },
  { value: "NH", text: "New Hampshire" },
  { value: "NJ", text: "New Jersey" },
  { value: "NM", text: "New Mexico" },
  { value: "NY", text: "New York" },
  { value: "NC", text: "North Carolina" },
  { value: "ND", text: "North Dakota" },
  { value: "OH", text: "Ohio" },
  { value: "OK", text: "Oklahoma" },
  { value: "OR", text: "Oregon" },
  { value: "PA", text: "Pennsylvania" },
  { value: "RI", text: "Rhode Island" },
  { value: "SC", text: "South Carolina" },
  { value: "SD", text: "South Dakota" },
  { value: "TN", text: "Tennessee" },
  { value: "TX", text: "Texas" },
  { value: "UT", text: "Utah" },
  { value: "VT", text: "Vermont" },
  { value: "VA", text: "Virginia" },
  { value: "WA", text: "Washington" },
  { value: "WV", text: "West Virginia" },
  { value: "WI", text: "Wisconsin" },
  { value: "WY", text: "Wyoming" }
];

export const getCreditCardFieldErrors = function(state) {
  let tempErrors = [];
  if (state.nameOnCard.length === 0) {
    tempErrors.push("'Name on Card' cannot be blank");
  }
  if (state.creditCardNumber.length === 0) {
    tempErrors.push("'Credit Card Number' cannot be blank");
  }
  if (state.expiryMonth.length === 0) {
    tempErrors.push("Choose an 'Expiry Month'");
  }
  if (state.expiryYear.length === 0) {
    tempErrors.push("Choose an 'Expiry Year'");
  }
  if (state.cardSecurityCode.length === 0) {
    tempErrors.push("'Card Security Code' cannot be blank");
  }
  return tempErrors;
};

export const arraySortByKey = function(key) {
  return (a, b) => {
    const aKey = a[key].toUpperCase();
    const bKey = b[key].toUpperCase();

    if (aKey < bKey) return -1;
    if (aKey > bKey) return 1;
    return 0;
  };
};

export const formatPostalCode = function(postalCode, currency) {
  if (currency === CURRENCY.CAD && postalCode.indexOf(" ") === -1) {
    postalCode = postalCode.substr(0, 3) + " " + postalCode.substr(3);
  }
  return postalCode.toUpperCase();
};

export const isValidPostalCode = function(postalCode, currency) {
  let pattern;
  if (currency === CURRENCY.CAD) {
    pattern = /^[A-z]{1}[0-9]{1}[A-z]{1}(\s)?[0-9]{1}[A-z]{1}[0-9]{1}$/;
  } else {
    pattern = /^[0-9]{5}$/;
  }
  return postalCode.match(pattern);
};

export const capitalizeFirstLetter = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const scrollToTop = function() {
  if (document.querySelector(".backend-nav")) {
    document.querySelectorAll("main")[1].scroll({ top: 0, behavior: "smooth" }); // for back-end
  } else if (window) {
    window.scrollTo({ top: 0, behavior: "smooth" }); // for front-end
  }
};

export const scrollToTopOfSidepanel = function() {
  document.querySelector(".jk-sidepanel--expanded").scrollTo({ top: 0, behavior: "smooth" });
};

export const isValidEmail = function(email) {
  let pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(pattern);
};

export const initializeGoogleAnalytics = function(history) {
  const fireGoogleAnalytics = function() {
    if (window.location.hostname !== "sample.binbooker.test" && window.location.pathname !== "/") {
      ReactGA.initialize("UA-84309817-1");
      ReactGA.set({ page: window.location.pathname });
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  };
  fireGoogleAnalytics();
  history.listen(() => {
    fireGoogleAnalytics();
  });
};

// Generate a random hex string of specified height
export const getUuid = (size = 6) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");

export const isValidPoNumber = str => {
  const pattern = /^[A-z0-9-.,]*$/g;
  return !!str.match(pattern);
};

export function darkenHexColour(color, amount = -20) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, color => ("0" + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2))
  );
}

export function getReactDatesCustomDayStyles(primaryColour) {
  const darkerColour = darkenHexColour(primaryColour);

  const selectedStartAndEndStyles = {
    background: darkerColour,
    border: `1px solid ${darkerColour}`,
    color: "#fff"
    // hover: {
    //   ...
    // }
  };

  const selectedSpanStyles = {
    background: primaryColour,
    border: `1px solid ${primaryColour}`,
    color: "#fff"
  };

  const hoveredStyles = {
    background: primaryColour,
    border: `1px solid ${primaryColour}`,
    color: "#fff"
  };

  const blockedStyles = {
    cursor: "not-allowed",
    textDecoration: "line-through",
    color: "#c3c8ca"
  };

  return {
    selectedStartStyles: selectedStartAndEndStyles,
    selectedStyles: selectedSpanStyles,
    selectedSpanStyles: selectedSpanStyles,
    selectedEndStyles: selectedStartAndEndStyles,
    hoveredSpanStyles: hoveredStyles,
    afterHoveredStartStyles: hoveredStyles,
    // blockedMinNightsStyles: blockedStyles,
    blockedCalendarStyles: blockedStyles,
    blockedOutOfRangeStyles: blockedStyles
  };
}
