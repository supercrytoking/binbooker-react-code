import React from "react";
import { get, post, put, remove } from "Utils/services.jsx";

// TODO: mabye rename "PageAccess" to "StaffPageAccess"
// TODO: have to make "StaffDetails" controlled so saving works[]

export const StaffPageContext = React.createContext();

export default class StaffPageProvider extends React.Component {
  blankStaffObject = {
    created: null,
    id: null,
    isActive: true,
    name: "",
    email: "",
    pageAccess: {
      schedule: false,
      truckSchedule: false,
      orders: false,
      createOrder: false,
      customers: false,
      manageBins: false,
      manageCoupons: false,
      manageHolidays: false,
      manageItems: false,
      manageServices: false,
      manageSettings: false,
      manageStaff: false,
      manageZones: false
    }
  };

  STAFF_ENDPOINT = "/api/v2/staff";

  constructor() {
    super();
    this.state = {
      activeStaff: this.blankStaffObject,
      error: "",
      isDeleteModalOpen: false,
      isSaving: false,
      isDeleting: false,
      sidePanelOpen: false,
      staff: null,
      onChangeActiveStafferDetail: (detail, newValue) => {
        const activeStaff = Object.assign({}, this.state.activeStaff);

        switch (detail) {
          case "name":
            activeStaff.name = newValue;
            break;
          case "email":
            activeStaff.email = newValue;
            break;
        }

        this.setState({ activeStaff });
      },
      onToggleIsActive: isActive => {
        const activeStaff = Object.assign({}, this.state.activeStaff);
        activeStaff.isActive = isActive;
        this.setState({ activeStaff });
      },
      onClickNew: () => {
        this.setState({ activeStaff: this.blankStaffObject, sidePanelOpen: true });
      },
      onClickPageAccessCheckbox: (pageName, hasAccess) => {
        const activeStaff = Object.assign({}, this.state.activeStaff);
        activeStaff.pageAccess[pageName] = hasAccess;
        this.setState({ activeStaff });
      },
      onClickStaff: staff => {
        this.setState({ activeStaff: staff, sidePanelOpen: true });
      },
      onCloseDeleteModal: () => {
        this.setState({ isDeleteModalOpen: false });
      },
      onClickCreate: () => {
        this.handleCreateStaff(
          this.state.activeStaff.name,
          this.state.activeStaff.email,
          this.state.activeStaff.isActive,
          this.state.activeStaff.pageAccess
        );
      },
      onDeleteStaff: staffId => {
        this.handleDeleteStaff(staffId);
      },
      onOpenDeleteModal: () => {
        this.setState({ isDeleteModalOpen: true });
      },
      onClickSave: () => {
        this.handleSaveStaff(
          this.state.activeStaff.id,
          this.state.activeStaff.name,
          this.state.activeStaff.email,
          this.state.activeStaff.isActive,
          this.state.activeStaff.pageAccess
        );
      },
      handleCloseSidePanel: () => {
        this.setState({ activeStaff: this.blankStaffObject, sidePanelOpen: false });
      },
      onDismissError: () => {
        this.setState({ error: "" });
      }
    };
  }

  componentDidMount() {
    this.getStaff();
  }

  getStaff = async () => {
    let staffers = await get(this.STAFF_ENDPOINT);
    staffers = staffers.map(staffer => {
      staffer.isActive = staffer.isActive === "1";
      return staffer;
    });
    this.setState({ staff: staffers });
  };

  handleCreateStaff = async (name, email, isActive, pageAccess) => {
    this.setState({ isSaving: true });

    try {
      const json = await post(this.STAFF_ENDPOINT, {
        name,
        email,
        isActive,
        pageAccess
      });
      this.setState({
        activeStaff: {
          created: null,
          id: null,
          isActive,
          name,
          email,
          pageAccess
        }, //have to set this (or if we press 'create' twice in a row, it will show previous one's data)
        error: "",
        isSaving: false,
        sidePanelOpen: false,
        staff: json
      });
    } catch (errorMessage) {
      this.setState({
        error: errorMessage,
        isSaving: false
      });
    }
  };

  handleSaveStaff = async (staffId, name, email, isActive, pageAccess) => {
    this.setState({ isSaving: true });
    try {
      await put(this.STAFF_ENDPOINT, {
        id: this.state.activeStaff.id,
        name,
        email,
        isActive,
        pageAccess
      });
      let newActiveStaff = JSON.parse(JSON.stringify(this.state.activeStaff));
      newActiveStaff.name = name;
      newActiveStaff.email = email;
      newActiveStaff.isActive = isActive;

      let newStaff = this.state.staff.slice(0);
      let index = -1;
      for (let i = 0; i < this.state.staff.length; i++) {
        if (this.state.staff[i].id === this.state.activeStaff.id) {
          index = i;
          break;
        }
      }
      newStaff[index] = newActiveStaff;

      this.setState({
        isSaving: false,
        staff: newStaff,
        activeStaff: this.blankStaffObject,
        sidePanelOpen: false
      });
    } catch (errorMessage) {
      this.setState({
        error: errorMessage,
        isSaving: false
      });
    }
  };

  handleDeleteStaff = async staffId => {
    this.setState({ isDeleting: true });
    try {
      await remove(this.STAFF_ENDPOINT, { id: staffId });
      const staff = this.state.staff.filter(staffer => +staffer.id !== +staffId);
      this.setState({
        activeStaff: this.blankStaffObject,
        isDeleteModalOpen: false,
        isDeleting: false,
        sidePanelOpen: false,
        staff
      });
    } catch (errorMessage) {
      this.setState({
        error: errorMessage,
        isDeleting: false
      });
    }
  };

  render() {
    return <StaffPageContext.Provider value={this.state}>{this.props.children}</StaffPageContext.Provider>;
  }
}
