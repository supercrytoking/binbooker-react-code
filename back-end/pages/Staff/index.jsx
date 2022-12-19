import React from "react";
import classnames from "classnames";
import StaffPageProvider, { StaffPageContext } from "./StaffPageProvider.jsx";
import SidePanel from "Components/SidePanel";
import Avatar from "Components/Avatar";
import StaffDetails from "./StaffDetails/StaffDetails.jsx";
import PageAccess from "./PageAccess/PageAccess.jsx";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import { Tabs, Tab } from "react-bootstrap";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import "./StaffPage.scss";

export class StaffPage extends React.Component {
  componentDidMount() {
    document.title = "Staff";
  }

  renderTableRows() {
    if (this.props.staff === null) {
      return (
        <React.Fragment>
          <tr></tr>
          <tr>
            <td colSpan={2}>
              <SpinnerCentred />
            </td>
          </tr>
        </React.Fragment>
      );
    }

    return this.props.staff.map(staff => {
      const rowClass = classnames({ inactive: !staff.isActive });
      return (
        <tr
          key={staff.id}
          onClick={() => {
            this.props.onClickStaff(staff);
          }}
          className={rowClass}
        >
          <td>
            <Avatar name={staff.name} />
          </td>
          <td>
            {staff.name} <span className="staff__email">({staff.email})</span>
          </td>
        </tr>
      );
    });
  }

  renderAddButton = () => {
    if (this.props.staff === null) {
      return null;
    }

    return (
      <div className="staff-container__add-button">
        <button className="btn btn-default" onClick={this.props.onClickNew}>
          Create new Staff Member
        </button>
      </div>
    );
  };

  render() {
    return (
      <div className="staff-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="staff__avatar" />
              <th className="staff__name">Staff Member</th>
            </tr>
          </thead>
          <tbody>{this.renderTableRows()}</tbody>
        </table>

        {this.renderAddButton()}
        <SidePanel
          heading="Edit Staff Member"
          onClose={() => {
            this.props.handleCloseSidePanel();
          }}
          open={this.props.sidePanelOpen}
          width="small"
        >
          <Tabs defaultActiveKey="details" id="staffTab">
            <Tab title="Details" eventKey="details">
              <StaffDetails />
            </Tab>
            <Tab title="Page Access" eventKey="access">
              <PageAccess />
            </Tab>
          </Tabs>
        </SidePanel>
      </div>
    );
  }
}

export default class StaffPageWithContext extends React.Component {
  render() {
    return (
      <LoggedInStaffContext.Consumer>
        {loggedInStaff => {
          if (!loggedInStaff.pageAccess.manageStaff) {
            return null;
          }

          return (
            <StaffPageProvider>
              <StaffPageContext.Consumer>
                {({ handleCloseSidePanel, onClickNew, onClickStaff, sidePanelOpen, staff }) => (
                  <StaffPage
                    handleCloseSidePanel={handleCloseSidePanel}
                    onClickNew={onClickNew}
                    onClickStaff={onClickStaff}
                    sidePanelOpen={sidePanelOpen}
                    staff={staff}
                  />
                )}
              </StaffPageContext.Consumer>
            </StaffPageProvider>
          );
        }}
      </LoggedInStaffContext.Consumer>
    );
  }
}
