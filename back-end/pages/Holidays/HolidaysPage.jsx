import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import SidePanel from "Components/SidePanel";
import Input from "Components/Input";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import PendingButton from "Components/PendingButton";
import SingleDatePickerRow from "Components/SingleDatePickerRow";
import DeleteModal from "Components/DeleteModal";
import Bubbly from "Components/Bubbly";
import "./HolidaysPage.scss";

const emptyHoliday = { id: null, name: "", date: moment().format("YYYY-MM-DD") };

class HolidaysPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeHoliday: emptyHoliday,
      isDatePickerOpen: false,
      isModalOpen: false,
      isPending: false,
      isSidePanelOpen: false
    };

    document.title = "Holidays";
  }

  handleClickedHoliday = holiday => {
    this.setState({
      isSidePanelOpen: true,
      activeHoliday: {
        id: holiday.id,
        name: holiday.name,
        date: holiday.date
      }
    });
  };

  handleCloseSidePanel = () => {
    this.setState({ isSidePanelOpen: false });
  };

  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  handleClickDelete = async () => {
    this.setState({ isPending: true });
    await this.props.deleteHoliday(this.state.activeHoliday.id);
    this.handleCloseModal();
    setTimeout(this.handleCloseSidePanel, 200);
    this.setState({
      activeHoliday: emptyHoliday,
      isPending: false
    });
  };

  handleClickSave = async () => {
    this.setState({ isPending: true });

    if (this.state.activeHoliday.id) {
      await this.props.updateHoliday(this.state.activeHoliday);
    } else {
      await this.props.createHoliday(this.state.activeHoliday);
    }

    this.setState({ isPending: false });
    this.handleCloseSidePanel();
  };

  handleChangeName = e => {
    const activeHoliday = Object.assign({}, this.state.activeHoliday);
    activeHoliday.name = e.target.value;
    this.setState({ activeHoliday });
  };

  handleChangeDate = value => {
    const activeHoliday = Object.assign({}, this.state.activeHoliday);
    activeHoliday.date = value.format("YYYY-MM-DD");
    this.setState({ activeHoliday });
  };

  handleClickCreate = () => {
    this.setState({
      isSidePanelOpen: true,
      activeHoliday: emptyHoliday
    });
  };

  renderDeleteModal() {
    return (
      <DeleteModal
        subjectName="Holiday"
        isVisible={this.state.isModalOpen}
        onClose={this.handleCloseModal}
        onDelete={this.handleClickDelete}
        pending={this.state.isPending}
      />
    );
  }

  renderSidePanel() {
    return (
      <SidePanel
        open={this.state.isSidePanelOpen}
        onClose={this.handleCloseSidePanel}
        heading={this.state.activeHoliday.id === null ? "Create Holiday" : "Edit Holiday"}
        width="small"
      >
        <Input
          label="Name"
          name="holiday-name"
          value={this.state.activeHoliday.name}
          onChange={this.handleChangeName}
        />

        <SingleDatePickerRow
          date={this.state.activeHoliday.date}
          hasFocus={this.state.isDatePickerOpen}
          isDayBlocked={() => false}
          label="Date"
          onDateChange={date => this.handleChangeDate(date)}
          onFocusChange={({ focused }) => this.setState({ isDatePickerOpen: focused })}
        />

        <div className="buttonsContainer">
          <div className="first">{this.renderSaveButton()}</div>
          <div className="second">{this.renderDeleteButton()}</div>
        </div>
      </SidePanel>
    );
  }

  renderDeleteButton() {
    if (!this.state.activeHoliday.id) {
      return null;
    }

    return (
      <PendingButton
        bsStyle="default"
        disabled={this.state.isPending}
        pending={this.state.isPending}
        onClick={this.handleOpenModal}
        text="Delete"
        pendingText="Deleting..."
      />
    );
  }

  renderSaveButton() {
    const text = this.state.activeHoliday.id === null ? "Create" : "Save";
    const pendingText = this.state.activeHoliday.id === null ? "Creating..." : "Saving...";

    return (
      <PendingButton
        disabled={this.state.activeHoliday.name && this.state.activeHoliday.date ? false : true}
        pending={this.state.isPending}
        onClick={this.handleClickSave}
        text={text}
        pendingText={pendingText}
      />
    );
  }

  renderHolidays() {
    if (this.props.holidays === null) {
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

    return this.props.holidays.map(holiday => (
      <tr
        key={holiday.id}
        onClick={() => {
          this.handleClickedHoliday(holiday);
        }}
      >
        <td>{holiday.name}</td>
        <td>{moment(holiday.date).format("dddd, MMMM D, YYYY")}</td>
      </tr>
    ));
  }

  renderCreateButton() {
    return (
      <div className="btn__create">
        <button className="btn btn-default" onClick={this.handleClickCreate}>
          Create new Holiday
        </button>
      </div>
    );
  }

  renderTable() {
    if (!this.props.holidays) {
      return <SpinnerCentred />;
    }

    if (!this.props.holidays.length) {
      return (
        <Bubbly
          title="No Holidays"
          description="Click the button below to create your first Holiday."
          actionTitle="Create new Holiday"
          onClick={() => {
            this.handleClickCreate();
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <table className="table table-striped holidays__table">
          <thead>
            <tr>
              <th className="holidays__code">Name</th>
              <th className="holidays__start">Date</th>
            </tr>
          </thead>
          <tbody>{this.renderHolidays()}</tbody>
        </table>
        {this.renderCreateButton()}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="holidays-page">
        {this.renderTable()}
        {this.renderSidePanel()}
        {this.renderDeleteModal()}
      </div>
    );
  }
}

HolidaysPage.propTypes = {
  createHoliday: PropTypes.func,
  holidays: PropTypes.array,
  deleteHoliday: PropTypes.func,
  updateHoliday: PropTypes.func
};

HolidaysPage.defaultProps = {
  createHoliday: () => {},
  holidays: [],
  deleteHoliday: () => {},
  updateHoliday: () => {}
};

export default HolidaysPage;
