import React from "react";
import classnames from "classnames";
import moment from "moment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../../UserProvider.jsx";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import Pagination from "Components/Pagination";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import SearchBar from "./SearchBar";
import OrdersSidePanel from "./SidePanel";
import NoOrdersBubblyWithRouter from "./NoOrdersBubblyWithRouter";
import NoMatchingOrdersBubbly from "./NoMatchingOrdersBubbly";
import { getParameterByName, scrollToTop } from "Utils/library.jsx";
import { NO_PICKUP_DATE } from "Utils/constants.jsx";
import { get } from "Utils/services.jsx";
import OrdersProvider, { OrdersContext } from "./OrdersContext";
import ActiveOrderProvider, { ActiveOrderContext } from "./ActiveOrderContext";
import "./Orders.scss";

function OrdersPage() {
  const [filterString, setFilterString] = React.useState(getFilterStringFromUrl);
  const [showUnpaidOnly, setShowUnpaidOnly] = React.useState(getShowUnpaidOnlyFromUrl);
  const [isLoading, setIsLoading] = React.useState(true);
  const { orders, setOrders } = React.useContext(OrdersContext);
  const { activeOrder, setActiveOrder } = React.useContext(ActiveOrderContext);
  const [currentPage, setCurrentPage] = React.useState(getCurrentPageFromUrl);
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    document.title = "Orders";
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterString, showUnpaidOnly]);

  React.useEffect(() => {
    fetchOrders();
    updateUrl();
  }, [currentPage, filterString, showUnpaidOnly]);

  React.useEffect(() => {
    scrollToTop();
  }, [orders]);

  function updateUrl() {
    window.history.pushState(
      { page: `Orders Page ${currentPage}` },
      "",
      `orders?page=${currentPage}&filter=${filterString}&unpaid=${+showUnpaidOnly}`
    );
  }

  function getFilterStringFromUrl() {
    return getParameterByName("filter") || "";
  }

  function getShowUnpaidOnlyFromUrl() {
    return getParameterByName("unpaid") === "1";
  }

  function getCurrentPageFromUrl() {
    return parseInt(getParameterByName("page")) || 1;
  }

  async function fetchOrders() {
    setIsLoading(true);
    const json = await get(`/api/v2/orders?page=${currentPage}&filter=${filterString}&unpaid=${+showUnpaidOnly}`);
    setOrders(json.orders);
    setTotalPages(json.totalPages);
    setIsLoading(false);
  }

  async function clickedRow(order) {
    const json = await get(`/api/v1/order.php?id=${order.id}`);

    const newActiveOrder = { ...order };
    newActiveOrder.id = +order.id;
    newActiveOrder.attachments = json.attachments;
    newActiveOrder.createdBy = json.createdBy;
    newActiveOrder.createdOn = json.createdOn;
    newActiveOrder.deliveryAddress = json.deliveryAddress;
    newActiveOrder.items = json.items;
    newActiveOrder.notes = json.notes;

    setActiveOrder(newActiveOrder);
  }

  function renderCustomerName(order) {
    const name = [];
    if (order.companyName.length > 0) {
      name.push(<div key={1}>{order.companyName}</div>);
    }
    name.push(
      <div key={2}>
        <Link to={`customers?filter=${order.customerId}`}>
          {order.lastName}, {order.firstName}
        </Link>
      </div>
    );
    return name;
  }

  function renderContactInfo(order) {
    return (
      <div>
        <a
          href={`tel:${order.phone}`}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {order.phone}
        </a>
        <br />
        <a
          href={`mailto:${order.email}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {order.email}
        </a>
      </div>
    );
  }

  function renderUnpaidIcon(isFullyPaid) {
    if (isFullyPaid === "1") {
      return null;
    }

    const tooltip = <Tooltip id="tooltip-not-fully-paid">Not fully paid</Tooltip>;

    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <span className="glyphicon glyphicon-usd" aria-hidden="true" data-qa-id="not-fully-paid" />
      </OverlayTrigger>
    );
  }

  function renderTableRows() {
    return orders.map(order => {
      const rowClass = classnames({ active: activeOrder && activeOrder.id === order.id });

      // this is for imported data, when there's no user
      if (order.firstName == null) {
        order.firstName = "";
        order.lastName = "";
        order.companyName = "";
        order.email = "";
        order.phone = "";
      }

      const pickUpDateToShow =
        order.pickUp.indexOf(NO_PICKUP_DATE) > -1 ? "TBD" : moment(order.pickUp).format("ddd. MMM. D, 'YY");

      return (
        <tr
          key={order.id}
          onClick={() => {
            clickedRow(order);
          }}
          className={rowClass}
        >
          <td className="order__id">{order.id}</td>
          <td>{renderUnpaidIcon(order.isFullyPaid)}</td>
          <td>
            {renderCustomerName(order)}
            {renderContactInfo(order)}
          </td>
          <td>{`${order.title} (${order.foreignId})`}</td>
          <td>
            {moment(order.dropOff).format("ddd. MMM. D, 'YY")}
            &nbsp;&rarr;&nbsp;
            {pickUpDateToShow}
          </td>
        </tr>
      );
    });
  }

  function renderTable() {
    if (isLoading) {
      return <SpinnerCentred />;
    }

    if (!orders.length) {
      if (filterString === "" && !showUnpaidOnly) {
        return <NoOrdersBubblyWithRouter />;
      }

      return <NoMatchingOrdersBubbly />;
    }

    return (
      <table className="table table-striped orders__table">
        <thead>
          <tr>
            <th className="order__id">ID</th>
            <th className="order__fully-paid" />
            <th className="order__customer">Customer</th>
            <th className="order__service">Service</th>
            <th className="order__date">Drop-Off &rarr; Pick-Up</th>
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
            if (!loggedInStaff.pageAccess.orders) {
              return null;
            }

            return (
              <>
                {orders && (
                  <SearchBar
                    defaultFilterString={filterString}
                    defaultShowUnpaidOnly={showUnpaidOnly}
                    onChangeFilterString={setFilterString}
                    onChangeShowUnpaidOnly={setShowUnpaidOnly}
                  />
                )}
                {renderTable()}
                {orders && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={chosenPage => {
                      setCurrentPage(chosenPage);
                    }}
                    onClickNext={() => {
                      setCurrentPage(currentPage + 1);
                    }}
                    onClickPrev={() => {
                      setCurrentPage(currentPage - 1);
                    }}
                  />
                )}
                <OrdersSidePanel user={user} />
              </>
            );
          }}
        </LoggedInStaffContext.Consumer>
      )}
    </UserContext.Consumer>
  );
}

export default function OrdersWithContext() {
  return (
    <OrdersProvider>
      <ActiveOrderProvider>
        <OrdersPage />
      </ActiveOrderProvider>
    </OrdersProvider>
  );
}
