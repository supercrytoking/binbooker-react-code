import React from "react";
import classnames from "classnames";
import { Tabs, Tab } from "react-bootstrap";
import { useDebouncedCallback } from "use-debounce";
import { UserContext } from "../../UserProvider.jsx";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import FilterBar from "Components/FilterBar";
import SidePanel from "Components/SidePanel";
import Pagination from "Components/Pagination";
import Details from "./Details.jsx";
import BillingInfo from "./BillingInfo.jsx";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import Bubbly from "Components/Bubbly";
import { getParameterByName, scrollToTop } from "Utils/library.jsx";
import { get } from "Utils/services.jsx";
import Orders from "./Orders";
import "./Customers.scss";

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState(null);
  const [activeCustomer, setActiveCustomer] = React.useState(null);
  const [filterString, setFilterString] = React.useState(getFilterStringFromUrl);
  const [activeCustomersOrders, setActiveCustomersOrders] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(getCurrentPageFromUrl);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    document.title = "Customers";
  }, []);

  React.useEffect(() => {
    debouncedGetCustomers();
  }, [currentPage, filterString]);

  function updateUrl() {
    window.history.pushState(
      { page: `Customers Page ${currentPage}` },
      "",
      `customers?page=${currentPage}&filter=${filterString}`
    );
  }

  function getFilterStringFromUrl() {
    return getParameterByName("filter") || "";
  }

  function getCurrentPageFromUrl() {
    return parseInt(getParameterByName("page")) || 1;
  }

  const debouncedGetCustomers = useDebouncedCallback(() => {
    getCustomers(currentPage, filterString);
  }, 500);

  async function getCustomers(page = 1, filter = "") {
    setIsLoading(true);
    const json = await get(`/api/v2/customers?page=${page}&filter=${filter}`);
    setCurrentPage(page);
    setCustomers(json.customers);
    setTotalPages(json.totalPages);
    setIsLoading(false);
    scrollToTop();
    updateUrl();
  }

  async function getCustomersOrders(id) {
    const json = await get(`/api/v2/customers/${id}/orders`);
    setActiveCustomersOrders(json);
  }

  function clickedRow(customer) {
    getCustomersOrders(customer.id);
    setActiveCustomer(customer);
  }

  function handleCloseSidePanel() {
    setActiveCustomer(null);
  }

  function handleAfterSave() {
    // TODO: instead of hitting server again, this could just update 'customers'
    getCustomers(currentPage, filterString);
  }

  function renderName(customer) {
    return (
      <div>
        {customer.companyName.length > 0 && <div>{customer.companyName}</div>}
        {customer.lastName}, {customer.firstName}
      </div>
    );
  }

  function renderTableRows() {
    return customers.map(customer => {
      const rowClass = classnames({ active: activeCustomer === customer });

      return (
        <tr
          key={customer.id}
          onClick={() => {
            clickedRow(customer);
          }}
          className={rowClass}
        >
          <td>{renderName(customer)}</td>
          <td>
            <a
              href={`tel:${customer.phone}`}
              onClick={e => {
                e.stopPropagation();
              }}
            >
              {customer.phone}
            </a>
          </td>
          <td>
            <a
              href={`mailto:${customer.email}`}
              onClick={e => {
                e.stopPropagation();
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {customer.email}
            </a>
          </td>
          <td>
            <div>{`${customer.billingStreet1}, ${customer.billingCity}`}</div>
          </td>
        </tr>
      );
    });
  }

  function renderCustomerDetails(user) {
    if (!activeCustomer) {
      return null;
    }

    return (
      <Details
        id={+activeCustomer.id}
        companyName={activeCustomer.companyName}
        firstName={activeCustomer.firstName}
        lastName={activeCustomer.lastName}
        phone={activeCustomer.phone}
        email={activeCustomer.email}
        billingStreet1={activeCustomer.billingStreet1}
        billingCity={activeCustomer.billingCity}
        billingPostalCode={activeCustomer.billingPostalCode}
        billingProvince={activeCustomer.billingProvince}
        billingCountry={activeCustomer.billingCountry}
        notes={activeCustomer.notes}
        stripeId={activeCustomer.stripeId}
        currency={user.currency}
        afterSave={() => {
          handleAfterSave();
        }}
      />
    );
  }

  function renderBillingInfo(user) {
    if (!activeCustomer) {
      return null;
    }

    return (
      <BillingInfo
        apiKey={user.stripePublishableKey}
        id={activeCustomer.id}
        stripeId={activeCustomer.stripeId}
        afterSave={() => {
          handleAfterSave();
        }}
      />
    );
  }

  function renderPagination() {
    if (customers === null || isLoading) {
      return null;
    }

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={newPage => {
          setCurrentPage(newPage);
        }}
        onClickNext={() => {
          setCurrentPage(currentPage + 1);
        }}
        onClickPrev={() => {
          setCurrentPage(currentPage - 1);
        }}
      />
    );
  }

  function renderSidePanel(user) {
    if (customers === null) {
      return null;
    }

    return (
      <SidePanel open={activeCustomer !== null} onClose={handleCloseSidePanel} heading="Customer">
        <Tabs defaultActiveKey="details" id="customerTab">
          <Tab title="Details" eventKey="details">
            {renderCustomerDetails(user)}
          </Tab>
          <Tab title="Orders" eventKey="orders">
            <Orders customer={activeCustomer} orders={activeCustomersOrders} />
          </Tab>
          <Tab title="Billing Info" eventKey="billing">
            {renderBillingInfo(user)}
          </Tab>
        </Tabs>
      </SidePanel>
    );
  }

  function renderTable() {
    if (isLoading) {
      return <SpinnerCentred />;
    }

    if (!customers.length) {
      return filterString.length ? (
        <Bubbly title="No Matching Customers" description="No customers found that match your search criteria." />
      ) : (
        <Bubbly title="No Customers" description="A Customer will be created when you have your first order." />
      );
    }

    return (
      <table className="table table-striped customers__table">
        <thead>
          <tr>
            <th className="customers__name">Name</th>
            <th className="customers__phone">Phone</th>
            <th className="customers__email">Email</th>
            <th className="customers__address">Billing Address</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    );
  }

  return (
    <UserContext.Consumer>
      {user => (
        <LoggedInStaffContext.Consumer>
          {loggedInStaff => {
            if (!loggedInStaff.pageAccess.customers) {
              return null;
            }

            if (customers === null) {
              return <SpinnerCentred />;
            }

            return (
              <div className="customers-container">
                <FilterBar
                  placeholder="Filter Customers..."
                  onChange={e => {
                    setFilterString(e.target.value);
                  }}
                  value={filterString}
                />
                {renderTable()}
                {renderPagination()}
                {renderSidePanel(user)}
              </div>
            );
          }}
        </LoggedInStaffContext.Consumer>
      )}
    </UserContext.Consumer>
  );
}
