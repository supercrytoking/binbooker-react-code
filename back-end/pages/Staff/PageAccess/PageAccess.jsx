import React from "react";
import { Alert } from "react-bootstrap";
import { StaffPageContext } from "../StaffPageProvider.jsx";
import PendingButton from "Components/PendingButton";
import "./page-access.scss";

export class PageAccess extends React.Component {
  isCreating = () => !this.props.activeStaff.id;

  renderError = () => {
    if (!this.props.error) {
      return null;
    }

    return (
      <Alert bsStyle="danger" onDismiss={this.props.onDismissError}>
        {this.props.error}
      </Alert>
    );
  };

  render() {
    const saveText = this.isCreating() ? "Create" : "Save";
    const savingText = this.isCreating() ? "Creating..." : "Saving...";
    const handleClickPrimaryButton = this.isCreating() ? this.props.onClickCreate : this.props.onClickSave;

    return (
      <div className="page-access">
        <p>Select which pages this user will have access to view.</p>
        <ul>
          <li>
            <input
              checked={this.props.activeStaff.pageAccess.schedule}
              onChange={e => {
                this.props.onClickPageAccessCheckbox("schedule", e.target.checked);
              }}
              type="checkbox"
              name="schedule"
            />{" "}
            Schedule
          </li>
          <li>
            <input
              checked={this.props.activeStaff.pageAccess.truckSchedule}
              onChange={e => {
                this.props.onClickPageAccessCheckbox("truckSchedule", e.target.checked);
              }}
              type="checkbox"
              name="truckSchedule"
            />{" "}
            Truck's Schedule
          </li>
          <li>
            <input
              checked={this.props.activeStaff.pageAccess.orders}
              onChange={e => {
                this.props.onClickPageAccessCheckbox("orders", e.target.checked);
              }}
              type="checkbox"
              name="orders"
            />{" "}
            Orders
          </li>
          <li>
            <input
              checked={this.props.activeStaff.pageAccess.createOrder}
              onChange={e => {
                this.props.onClickPageAccessCheckbox("createOrder", e.target.checked);
              }}
              type="checkbox"
              name="createOrder"
            />{" "}
            Create new Order
          </li>
          <li>
            <input
              checked={this.props.activeStaff.pageAccess.customers}
              onChange={e => {
                this.props.onClickPageAccessCheckbox("customers", e.target.checked);
              }}
              type="checkbox"
              name="customers"
            />{" "}
            Customers
          </li>
          <li>
            <input
              type="checkbox"
              name="manage"
              checked={
                this.props.activeStaff.pageAccess.manageBins &&
                this.props.activeStaff.pageAccess.manageCoupons &&
                this.props.activeStaff.pageAccess.manageHolidays &&
                this.props.activeStaff.pageAccess.manageItems &&
                this.props.activeStaff.pageAccess.manageServices &&
                this.props.activeStaff.pageAccess.manageSettings &&
                this.props.activeStaff.pageAccess.manageStaff &&
                this.props.activeStaff.pageAccess.manageZones
              }
              ref={input => {
                if (input !== null) {
                  const allAreTheSame =
                    (this.props.activeStaff.pageAccess.manageBins &&
                      this.props.activeStaff.pageAccess.manageCoupons &&
                      this.props.activeStaff.pageAccess.manageHolidays &&
                      this.props.activeStaff.pageAccess.manageItems &&
                      this.props.activeStaff.pageAccess.manageServices &&
                      this.props.activeStaff.pageAccess.manageSettings &&
                      this.props.activeStaff.pageAccess.manageStaff) ||
                    (!this.props.activeStaff.pageAccess.manageBins &&
                      !this.props.activeStaff.pageAccess.manageCoupons &&
                      !this.props.activeStaff.pageAccess.manageHolidays &&
                      !this.props.activeStaff.pageAccess.manageItems &&
                      !this.props.activeStaff.pageAccess.manageServices &&
                      !this.props.activeStaff.pageAccess.manageSettings &&
                      !this.props.activeStaff.pageAccess.manageStaff &&
                      !this.props.activeStaff.pageAccess.manageZones);

                  input.indeterminate = !allAreTheSame;
                }
              }}
              onChange={e => {
                this.props.onClickPageAccessCheckbox("manageBins", e.target.checked);
                this.props.onClickPageAccessCheckbox("manageCoupons", e.target.checked);
                this.props.onClickPageAccessCheckbox("manageHolidays", e.target.checked);
                this.props.onClickPageAccessCheckbox("manageItems", e.target.checked);
                this.props.onClickPageAccessCheckbox("manageServices", e.target.checked);
                this.props.onClickPageAccessCheckbox("manageSettings", e.target.checked);
                this.props.onClickPageAccessCheckbox("manageStaff", e.target.checked);
                this.props.onClickPageAccessCheckbox("manageZones", e.target.checked);
              }}
            />{" "}
            Manage
          </li>
          <li>
            <ul className="manage-subgroup">
              <li>
                <input
                  checked={this.props.activeStaff.pageAccess.manageBins}
                  onChange={e => {
                    this.props.onClickPageAccessCheckbox("manageBins", e.target.checked);
                  }}
                  type="checkbox"
                  name="manageBins"
                />{" "}
                Bins
              </li>
              <li>
                <input
                  checked={this.props.activeStaff.pageAccess.manageCoupons}
                  onChange={e => {
                    this.props.onClickPageAccessCheckbox("manageCoupons", e.target.checked);
                  }}
                  type="checkbox"
                  name="manageCoupons"
                />{" "}
                Coupons
              </li>
              <li>
                <input
                  checked={this.props.activeStaff.pageAccess.manageHolidays}
                  onChange={e => {
                    this.props.onClickPageAccessCheckbox("manageHolidays", e.target.checked);
                  }}
                  type="checkbox"
                  name="manageHolidays"
                />{" "}
                Holidays
              </li>
              <li>
                <input
                  checked={this.props.activeStaff.pageAccess.manageItems}
                  onChange={e => {
                    this.props.onClickPageAccessCheckbox("manageItems", e.target.checked);
                  }}
                  type="checkbox"
                  name="manageItems"
                />{" "}
                Items
              </li>
              <li>
                <input
                  checked={this.props.activeStaff.pageAccess.manageServices}
                  onChange={e => {
                    this.props.onClickPageAccessCheckbox("manageServices", e.target.checked);
                  }}
                  type="checkbox"
                  name="manageServices"
                />{" "}
                Services
              </li>
              <li>
                <input
                  checked={this.props.activeStaff.pageAccess.manageSettings}
                  onChange={e => {
                    this.props.onClickPageAccessCheckbox("manageSettings", e.target.checked);
                  }}
                  type="checkbox"
                  name="manageSettings"
                />{" "}
                Settings
              </li>
              <li>
                <input
                  checked={this.props.activeStaff.pageAccess.manageStaff}
                  onChange={e => {
                    this.props.onClickPageAccessCheckbox("manageStaff", e.target.checked);
                  }}
                  type="checkbox"
                  name="manageStaff"
                />{" "}
                Staff
              </li>
              <li>
                <input
                  checked={this.props.activeStaff.pageAccess.manageZones}
                  onChange={e => {
                    this.props.onClickPageAccessCheckbox("manageZones", e.target.checked);
                  }}
                  type="checkbox"
                  name="manageZones"
                />{" "}
                Zones
              </li>
            </ul>
          </li>
        </ul>
        <PendingButton
          disabled={this.props.isSaving}
          pending={this.props.isSaving}
          onClick={handleClickPrimaryButton}
          text={saveText}
          pendingText={savingText}
        />
        {this.renderError()}
      </div>
    );
  }
}

export default class PageAccessWithContext extends React.Component {
  render() {
    return (
      <StaffPageContext.Consumer>
        {({ activeStaff, error, isSaving, onClickCreate, onClickPageAccessCheckbox, onClickSave, onDismissError }) => (
          <PageAccess
            activeStaff={activeStaff}
            error={error}
            isSaving={isSaving}
            onClickCreate={onClickCreate}
            onClickPageAccessCheckbox={onClickPageAccessCheckbox}
            onClickSave={onClickSave}
            onDismissError={onDismissError}
          />
        )}
      </StaffPageContext.Consumer>
    );
  }
}
