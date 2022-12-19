import React, { Component } from "react";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import { get, post, remove, put } from "Utils/services.jsx";
import HolidaysPage from "./HolidaysPage.jsx";

const API_ENDPOINT = "/api/v2/holidays";

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      holidays: null,
      isPending: false
    };
  }

  async componentDidMount() {
    const holidays = await get(API_ENDPOINT);
    this.setState({ holidays });
  }

  handleCreateHoliday = async ({ name, date }) => {
    const newHoliday = await post(API_ENDPOINT, {
      name,
      date
    });

    const newHolidays = this.state.holidays.slice(0);
    newHolidays.push(newHoliday);
    this.setState({ holidays: newHolidays });
  };

  handleDeleteHoliday = async id => {
    await remove(`${API_ENDPOINT}/${id}`);

    let newHolidays = this.state.holidays.filter(holiday => {
      return holiday.id != id;
    });

    this.setState({ holidays: newHolidays });
  };

  handleUpdateHoliday = async ({ id, name, date }) => {
    const updatedHoliday = await put(`${API_ENDPOINT}/${id}`, {
      name,
      date
    });

    let newHolidays = this.state.holidays.map(holiday => {
      if (holiday.id == updatedHoliday.id) {
        holiday.name = updatedHoliday.name;
        holiday.date = updatedHoliday.date;
      }
      return holiday;
    });

    this.setState({ holidays: newHolidays });
  };

  render() {
    return (
      <LoggedInStaffContext.Consumer>
        {loggedInStaff => {
          if (!loggedInStaff.pageAccess.manageHolidays) {
            return null;
          }

          return (
            <HolidaysPage
              holidays={this.state.holidays}
              createHoliday={this.handleCreateHoliday}
              deleteHoliday={this.handleDeleteHoliday}
              updateHoliday={this.handleUpdateHoliday}
            />
          );
        }}
      </LoggedInStaffContext.Consumer>
    );
  }
}

export default Index;
