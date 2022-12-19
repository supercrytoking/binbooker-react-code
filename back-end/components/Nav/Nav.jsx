import React from "react";
import { Link } from "react-router-dom";
import { bool, string } from "prop-types";
import classnames from "classnames";
import { UserContext } from "../../UserProvider.jsx";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import "./Nav.scss";

class Nav extends React.Component {
  static propTypes = {
    canAccessCreateOrder: bool,
    canAccessCustomers: bool,
    canAccessManageBins: bool,
    canAccessManageCoupons: bool,
    canAccessManageHolidays: bool,
    canAccessManageItems: bool,
    canAccessManageServices: bool,
    canAccessManageSettings: bool,
    canAccessManageStaff: bool,
    canAccessManageZones: bool,
    canAccessOrders: bool,
    canAccessSchedule: bool,
    canAccessTruckSchedule: bool,
    logoPath: string
  };

  static defaultProps = {
    canAccessCreateOrder: false,
    canAccessCustomers: false,
    canAccessManageBins: false,
    canAccessManageCoupons: false,
    canAccessManageHolidays: false,
    canAccessManageItems: false,
    canAccessManageServices: false,
    canAccessManageSettings: false,
    canAccessManageStaff: false,
    canAccessManageZones: false,
    canAccessOrders: false,
    canAccessSchedule: false,
    canAccessTruckSchedule: false,
    logoPath: ""
  };

  constructor(props) {
    super(props);

    let links = this.getLinks(props);
    let subLinks = this.getSubLinks(props);

    if (subLinks.length) {
      links.push({
        to: null,
        name: "Manage",
        subLinks: subLinks
      });
    }

    this.state = {
      links,
      isExpanded: false,
      isSubLinksCollapsed: !this.areOnSublink()
    };
  }

  areOnSublink() {
    switch (window.location.pathname) {
      case "/back/bins":
      case "/back/coupons":
      case "/back/holidays":
      case "/back/items":
      case "/back/services":
      case "/back/settings":
      case "/back/staff":
      case "/back/zones":
        return true;
      default:
        return false;
    }
  }

  getLinks = props => {
    let links = [];
    links = this.maybeAddLink(links, props.canAccessSchedule, "/back/schedule", "Schedule");
    links = this.maybeAddLink(links, props.canAccessOrders, "/back/orders", "Orders");
    links = this.maybeAddLink(links, props.canAccessCreateOrder, "/back/create-order/code", "Create new Order");
    links = this.maybeAddLink(links, props.canAccessCustomers, "/back/customers", "Customers");
    links = this.maybeAddLink(links, props.canAccessTruckSchedule, "/back/truck-schedule", "Truck's Schedule");
    return links;
  };

  getSubLinks(props) {
    let subLinks = [];
    subLinks = this.maybeAddLink(subLinks, props.canAccessManageBins, "/back/bins", "Bins");
    subLinks = this.maybeAddLink(subLinks, props.canAccessManageCoupons, "/back/coupons", "Coupons");
    subLinks = this.maybeAddLink(subLinks, props.canAccessManageHolidays, "/back/holidays", "Holidays");
    subLinks = this.maybeAddLink(subLinks, props.canAccessManageItems, "/back/items", "Items");
    subLinks = this.maybeAddLink(subLinks, props.canAccessManageServices, "/back/services", "Services");
    subLinks = this.maybeAddLink(subLinks, props.canAccessManageSettings, "/back/settings", "Settings");
    subLinks = this.maybeAddLink(subLinks, props.canAccessManageStaff, "/back/staff", "Staff");
    subLinks = this.maybeAddLink(subLinks, props.canAccessManageZones, "/back/zones", "Zones");
    return subLinks;
  }

  maybeAddLink(links, canAccessPage, url, linkTitle) {
    if (canAccessPage) {
      links.push({ to: url, name: linkTitle });
    }

    return links;
  }

  handleClickLink = () => {
    this.setState({ isExpanded: false });
  };

  handleClickSubLink = () => {
    this.setState({ isExpanded: false });
  };

  toggleSubLinks = () => {
    this.setState({ isSubLinksCollapsed: !this.state.isSubLinksCollapsed });
  };

  renderDropdownIcon() {
    return (
      <i
        className={classnames("glyphicon", "glyphicon-triangle-right", {
          "arrow-rotate": !this.state.isSubLinksCollapsed
        })}
      />
    );
  }

  getLinkIsActive = linkTo => {
    switch (window.location.pathname) {
      case "/back/create-order/code":
      case "/back/create-order/date":
      case "/back/create-order/service":
      case "/back/create-order/info":
      case "/back/create-order/review":
      case "/back/create-order/confirmation":
        if (linkTo === "/back/create-order/code") {
          return true;
        }
        break;
    }

    return linkTo === window.location.pathname;
  };

  renderSubLinks = links => {
    const subLinksMarkup = links.map(link => (
      <Link
        className={classnames(
          "link",
          "sublink",
          {
            "link--active": this.getLinkIsActive(link.to)
          },
          {
            "link--hidden": this.state.isSubLinksCollapsed
          }
        )}
        key={link.name}
        onClick={this.handleClickSubLink}
        to={link.to}
      >
        {link.name}
      </Link>
    ));

    return <div>{subLinksMarkup}</div>;
  };

  renderLinks() {
    return this.state.links.map(link => {
      if (link.to) {
        return (
          <Link
            className={classnames("link", {
              "link--active": this.getLinkIsActive(link.to)
            })}
            key={link.name}
            onClick={this.handleClickLink}
            to={link.to}
          >
            {link.name}
          </Link>
        );
      }

      //the parent of a sub-link (which doesnt go anywhere) and its links
      return (
        <React.Fragment key={link.name}>
          <div className="link" onClick={this.toggleSubLinks}>
            {link.name}
            {this.renderDropdownIcon()}
          </div>
          {this.renderSubLinks(link.subLinks)}
        </React.Fragment>
      );
    });
  }

  renderLogo() {
    return (
      <div className="logo">
        <img alt="Logo" height="32" src={`/images/logos/${this.props.logoPath}`} />
      </div>
    );
  }

  toggleExpandCollapse = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render() {
    const cn = classnames("backend-nav", { "backend-nav--expanded": this.state.isExpanded });
    return (
      <nav className={cn}>
        {this.renderLogo()}
        <div className="links">
          {this.renderLinks()}
          <a className="link" href="/back/logout">
            Logout
          </a>
        </div>
        <div className="expand-collapse" onClick={this.toggleExpandCollapse}>
          <i className="glyphicon glyphicon-menu-hamburger" />
          <i className="glyphicon glyphicon-remove" />
        </div>
      </nav>
    );
  }
}

export default class NavWithContext extends React.Component {
  render() {
    return (
      <UserContext.Consumer>
        {user => {
          //...
          return (
            <LoggedInStaffContext.Consumer>
              {loggedInStaff => {
                const {
                  createOrder,
                  customers,
                  manageBins,
                  manageCoupons,
                  manageHolidays,
                  manageItems,
                  manageServices,
                  manageSettings,
                  manageStaff,
                  manageZones,
                  orders,
                  schedule,
                  truckSchedule
                } = loggedInStaff.pageAccess;
                return (
                  <Nav
                    canAccessCreateOrder={createOrder}
                    canAccessCustomers={customers}
                    canAccessManageBins={manageBins}
                    canAccessManageCoupons={manageCoupons}
                    canAccessManageHolidays={manageHolidays}
                    canAccessManageItems={manageItems}
                    canAccessManageServices={manageServices}
                    canAccessManageSettings={manageSettings}
                    canAccessManageStaff={manageStaff}
                    canAccessManageZones={manageZones}
                    canAccessOrders={orders}
                    canAccessSchedule={schedule}
                    canAccessTruckSchedule={truckSchedule}
                    logoPath={user.logoPath}
                  />
                );
              }}
            </LoggedInStaffContext.Consumer>
          );
        }}
      </UserContext.Consumer>
    );
  }
}
