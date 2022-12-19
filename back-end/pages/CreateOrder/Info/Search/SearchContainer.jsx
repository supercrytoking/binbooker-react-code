import React from "react";
import PropTypes from "prop-types";
import { get } from "Utils/services.jsx";
import Search from "./Search.jsx";

let customerSearchTimer;

export default function SearchContainer({ onClickCustomer, onClickUnload, showUnload }) {
  const [customers, setCustomers] = React.useState([]);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchString, setSearchString] = React.useState("");

  async function search(str) {
    setIsSearching(true);
    setCustomers([]);
    setIsExpanded(true);

    const response = await get("/api/v2/customers?term=" + str);
    setIsSearching(false);
    setCustomers(response.customers);
  }

  function handleClickAwayFromSearch() {
    setIsExpanded(false);
  }

  function handleChangeSearchString(e) {
    const searchTerm = e.target.value;
    setSearchString(searchTerm);
    clearTimeout(customerSearchTimer);
    customerSearchTimer = setTimeout(() => {
      if (searchTerm.length > 0) {
        search(searchTerm);
      } else {
        setIsSearching(false);
        setCustomers([]);
      }
    }, 300);
  }

  function handleClickCustomer(customer) {
    onClickCustomer(customer);
    setIsExpanded(false);
  }

  return (
    <Search
      customers={customers}
      isExpanded={isExpanded}
      isSearching={isSearching}
      onChangeSearchString={handleChangeSearchString}
      onClickAwayFromSearch={handleClickAwayFromSearch}
      onClickCustomer={handleClickCustomer}
      onClickUnload={onClickUnload}
      searchString={searchString}
      showUnload={showUnload}
    />
  );
}

SearchContainer.propTypes = {
  onClickCustomer: PropTypes.func.isRequired,
  onClickUnload: PropTypes.func.isRequired,
  showUnload: PropTypes.bool
};

SearchContainer.defaultProps = {
  showUnload: false
};
