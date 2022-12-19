import React from "react";
import PropTypes from "prop-types";
import ClickOutside from "Components/ClickOutside";
import FilterBar from "Components/FilterBar";
import Spinner from "Components/Spinner";
import "./Search.scss";

export default function Search({
  customers,
  isExpanded,
  isSearching,
  onChangeSearchString,
  onClickAwayFromSearch,
  onClickCustomer,
  onClickUnload,
  searchString,
  showUnload
}) {
  function renderUnloadCustomer() {
    if (showUnload) {
      return (
        <a className="create-order__unload-customer" onClick={onClickUnload}>
          Unload Customer
        </a>
      );
    }
    return null;
  }

  function renderSearchBox() {
    let html = "";

    if (isSearching) {
      html = (
        <div className="search__spinner-wrapper">
          <Spinner size="small" />
        </div>
      );
    } else if (isExpanded) {
      if (customers.length > 0) {
        html = customers.map(customer => {
          return (
            <tr
              key={customer.id}
              onClick={() => {
                onClickCustomer(customer);
              }}
            >
              <td>{customer.companyName}</td>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.phone}</td>
              <td>{customer.email}</td>
            </tr>
          );
        });
        html = (
          <table className="table">
            <tbody>{html}</tbody>
          </table>
        );
      } else {
        html = <p>No matching results found.</p>;
      }
    }

    if (isSearching || isExpanded) {
      return <div className="create-order__search-results">{html}</div>;
    }

    return null;
  }

  return (
    <div className="row">
      <ClickOutside onClickHandler={onClickAwayFromSearch}>
        <FilterBar
          placeholder="Search for existing customer by last name, phone number, or email"
          onChange={onChangeSearchString}
          value={searchString}
          type="search"
        />
        {renderSearchBox()}
        {renderUnloadCustomer()}
      </ClickOutside>
    </div>
  );
}

Search.propTypes = {
  customers: PropTypes.array,
  isExpanded: PropTypes.bool,
  isSearching: PropTypes.bool,
  onChangeSearchString: PropTypes.func.isRequired,
  onClickAwayFromSearch: PropTypes.func.isRequired,
  onClickCustomer: PropTypes.func.isRequired,
  onClickUnload: PropTypes.func.isRequired,
  searchString: PropTypes.string,
  showUnload: PropTypes.bool
};

Search.defaultProps = {
  customers: [],
  isExpanded: false,
  isSearching: false,
  searchString: "",
  showUnload: false
};
