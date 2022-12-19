import React from "react";
import { Alert } from "react-bootstrap";
import { StaffPageContext } from "../StaffPageProvider.jsx";
import { LoggedInStaffContext } from "../../../LoggedInStaffProvider.jsx";
import Input from "Components/Input";
import PendingButton from "Components/PendingButton";
import Errors from "Components/Errors";
import DeleteModal from "Components/DeleteModal";
import "./staff.scss";

export class StaffDetails extends React.Component {
  isCreating = () => !this.props.activeStaff.id;

  isLookingAtSelf = () => {
    if (!this.props.loggedInStaff) {
      return true;
    }

    return this.props.activeStaff.id === this.props.loggedInStaff.id;
  };

  renderDeleteButton = () => {
    if (this.isCreating()) {
      return null;
    }

    return (
      <PendingButton
        bsStyle="default"
        disabled={this.isLookingAtSelf()}
        onClick={this.props.onOpenDeleteModal}
        text="Delete"
        pendingText="Deleting..."
      />
    );
  };

  renderError = () => {
    if (!this.props.error) {
      return null;
    }

    return <Errors errors={[this.props.error]} onDismiss={this.props.onDismissError} />;
  };

  renderDeleteModal() {
    return (
      <DeleteModal
        subjectName="Staff"
        isVisible={this.props.isDeleteModalOpen}
        isPending={this.props.isDeleting}
        onClose={this.props.onCloseDeleteModal}
        onDelete={() => this.props.onDeleteStaff(this.props.activeStaff.id)}
      />
    );
  }

  renderCreateMessage = () => {
    if (!this.isCreating()) {
      return null;
    }

    return (
      <div className="creating-staff-message">
        <Alert bsStyle="info">New staff member will be emailed instructions on setting their password.</Alert>
      </div>
    );
  };

  render() {
    const saveText = this.isCreating() ? "Create" : "Save";
    const savingText = this.isCreating() ? "Creating..." : "Saving...";
    const handleClickPrimaryButton = this.isCreating() ? this.props.onClickCreate : this.props.onClickSave;

    return (
      <div className="staff-details">
        {this.renderError()}

        <Input
          label="Name"
          disabled={this.props.isSaving}
          name="name"
          value={this.props.activeStaff.name}
          onChange={e => {
            this.props.onChangeActiveStafferDetail("name", e.target.value);
          }}
        />
        <Input
          label="Email"
          disabled={this.props.isSaving}
          name="email"
          value={this.props.activeStaff.email}
          onChange={e => {
            this.props.onChangeActiveStafferDetail("email", e.target.value);
          }}
        />

        <div className="form-check">
          <label htmlFor="active" className="form-check-label">
            Active?
          </label>
          <input
            className="form-check-input"
            disabled={this.props.isSaving || this.isLookingAtSelf()}
            type="checkbox"
            name="active"
            checked={this.props.activeStaff.isActive}
            onChange={() => {
              this.props.onToggleIsActive(!this.props.activeStaff.isActive);
            }}
          />
        </div>
        <PendingButton
          disabled={this.props.isSaving}
          pending={this.props.isSaving}
          onClick={handleClickPrimaryButton}
          text={saveText}
          pendingText={savingText}
        />
        {this.renderDeleteButton()}
        {this.renderCreateMessage()}
        {this.renderDeleteModal()}
      </div>
    );
  }
}

export default class StaffDetailsWithContext extends React.Component {
  render() {
    return (
      <LoggedInStaffContext.Consumer>
        {loggedInStaff => (
          <StaffPageContext.Consumer>
            {({
              activeStaff,
              error,
              isDeleting,
              isDeleteModalOpen,
              isSaving,
              onChangeActiveStafferDetail,
              onClickCreate,
              onClickSave,
              onCloseDeleteModal,
              onDeleteStaff,
              onDismissError,
              onOpenDeleteModal,
              onToggleIsActive
            }) => (
              <StaffDetails
                activeStaff={activeStaff}
                error={error}
                isDeleting={isDeleting}
                isDeleteModalOpen={isDeleteModalOpen}
                isSaving={isSaving}
                loggedInStaff={loggedInStaff}
                onChangeActiveStafferDetail={onChangeActiveStafferDetail}
                onClickCreate={onClickCreate}
                onClickSave={onClickSave}
                onCloseDeleteModal={onCloseDeleteModal}
                onDeleteStaff={onDeleteStaff}
                onDismissError={onDismissError}
                onOpenDeleteModal={onOpenDeleteModal}
                onToggleIsActive={onToggleIsActive}
              />
            )}
          </StaffPageContext.Consumer>
        )}
      </LoggedInStaffContext.Consumer>
    );
  }
}
