import React from "react";
import moment from "moment";
import { array, bool, func, string } from "prop-types";
import { Tabs, Tab } from "react-bootstrap";
import SidePanel from "Components/SidePanel";
import Errors from "Components/Errors";
import PendingButton from "Components/PendingButton";
import DeleteModal from "Components/DeleteModal";
import CouponsDetails from "./CouponsDetails.jsx";
import CouponsServices from "./CouponsServices.jsx";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import Bubbly from "Components/Bubbly";
import { scrollToTopOfSidepanel } from "Utils/library.jsx";
import "./Coupons.scss";

export default function Coupons({
  coupons,
  clearError,
  createCoupon,
  deleteCoupon,
  error,
  isPending,
  services,
  updateCoupon
}) {
  const [activeCoupon, setActiveCoupon] = React.useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  const [isValidFromPickerOpen, setIsValidFromPickerOpen] = React.useState(false);
  const [isValidUntilPickerOpen, setIsValidUntilPickerOpen] = React.useState(false);
  const [showDeleteCouponModal, setShowDeleteCouponModal] = React.useState(false);

  React.useEffect(() => {
    document.title = "Coupons";
  }, []);

  React.useEffect(() => {
    if (isSidePanelOpen && error) {
      scrollToTopOfSidepanel();
    }
  }, [error, isSidePanelOpen]);

  function openSidePanel(index) {
    const selectedCoupon = coupons[index];
    const serviceIds = coupons[index].services.map(service => service.id);

    setActiveCoupon({
      id: selectedCoupon.id,
      code: selectedCoupon.code,
      description: selectedCoupon.description,
      validFrom: selectedCoupon.validFrom,
      validUntil: selectedCoupon.validUntil,
      value: selectedCoupon.value,
      isPercent: selectedCoupon.isPercent === "1",
      serviceIds: serviceIds
    });
    setIsSidePanelOpen(true);
  }

  function handleCloseSidePanel() {
    setIsSidePanelOpen(false);
    setActiveCoupon(null);
  }

  function closeDeleteCouponModal() {
    setShowDeleteCouponModal(false);
  }

  function handleChangeDate(index, date) {
    const _activeCoupon = Object.assign({}, activeCoupon);
    _activeCoupon[index] = date.format("YYYY-MM-DD");
    setActiveCoupon(_activeCoupon);
  }

  function handleClickCreate() {
    setActiveCoupon({
      id: null,
      code: "",
      description: "",
      validFrom: moment(new Date().getTime()).format("YYYY-MM-DD"),
      validUntil: moment(new Date().getTime() + 604800000).format("YYYY-MM-DD"),
      serviceIds: [],
      value: 0,
      isPercent: false
    });

    setIsSidePanelOpen(true);
  }

  async function handleClickSave() {
    let success;
    if (activeCoupon.id) {
      success = await updateCoupon(activeCoupon);
    } else {
      success = await createCoupon(activeCoupon);
    }
    if (success) {
      handleCloseSidePanel();
    } // it is closing it even though it failed...? i see an error in there
  }

  async function handleClickDelete() {
    await deleteCoupon(activeCoupon);
    setShowDeleteCouponModal(false);
    setTimeout(handleCloseSidePanel, 100);
  }

  function renderActionButtons() {
    if (activeCoupon && !activeCoupon.id) {
      return (
        <div className="coupons-action-buttons">
          <PendingButton
            pending={isPending}
            onClick={handleClickSave}
            bsStyle="primary"
            text="Create"
            pendingText="Creating..."
          />
        </div>
      );
    }

    return (
      <div className="coupons-action-buttons">
        <PendingButton
          pending={isPending}
          onClick={handleClickSave}
          bsStyle="primary"
          text="Save"
          pendingText="Saving..."
        />
        <PendingButton
          pending={isPending}
          onClick={() => {
            setShowDeleteCouponModal(true);
          }}
          bsStyle="default"
          text="Delete"
          pendingText="Deleting..."
        />
      </div>
    );
  }

  function renderSidePanel() {
    return (
      <SidePanel
        open={isSidePanelOpen}
        onClose={handleCloseSidePanel}
        heading={activeCoupon && activeCoupon.id ? "Edit Coupon" : "Create Coupon"}
        width="small"
      >
        <div className="coupons-sidepanel">
          {error && <Errors errors={[error]} onDismiss={clearError} />}

          <Tabs defaultActiveKey="details" id="couponsTab">
            <Tab title="Details" eventKey="details">
              {activeCoupon && (
                <CouponsDetails
                  activeCoupon={activeCoupon}
                  isValidFromPickerOpen={isValidFromPickerOpen}
                  isValidUntilPickerOpen={isValidUntilPickerOpen}
                  handleChangeDate={handleChangeDate}
                  setActiveCoupon={setActiveCoupon}
                  setIsValidFromPickerOpen={setIsValidFromPickerOpen}
                  setIsValidUntilPickerOpen={setIsValidUntilPickerOpen}
                />
              )}
              {renderActionButtons()}
            </Tab>
            <Tab title="Services" eventKey="services">
              {activeCoupon && (
                <CouponsServices services={services} activeCoupon={activeCoupon} setActiveCoupon={setActiveCoupon} />
              )}
              {renderActionButtons()}
            </Tab>
          </Tabs>
        </div>
      </SidePanel>
    );
  }

  function renderTable() {
    if (!coupons) {
      return <SpinnerCentred />;
    }

    if (!coupons.length) {
      return (
        <Bubbly
          title="No Coupons"
          description="Click the button below to create your first Coupon."
          actionTitle="Create new Coupon"
          onClick={handleClickCreate}
        />
      );
    }

    return (
      <div className="coupons-page">
        <table className="table table-striped coupons__table">
          <thead>
            <tr>
              <th className="coupons__code">Coupon Code</th>
              <th className="coupons__start">Valid From</th>
              <th className="coupons__end">Valid Until</th>
              <th className="coupons__services">Services</th>
              <th className="coupons__value">Value</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, index) => {
              return (
                <tr
                  key={coupon.id}
                  onClick={() => {
                    openSidePanel(index);
                  }}
                >
                  <td>{coupon.code}</td>
                  <td>{moment(coupon.validFrom).format("dddd, MMMM D, YYYY")}</td>
                  <td>{moment(coupon.validUntil).format("dddd, MMMM D, YYYY")}</td>
                  <td>
                    <ul className="coupon-services">
                      {coupon.services.map(service => (
                        <li key={`service${service.id}`}>{service.title}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{coupon.isPercent === "1" ? `${parseInt(coupon.value)}%` : `$${coupon.value}`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>
          {coupons !== null && <PendingButton bsStyle="default" text="Create new Coupon" onClick={handleClickCreate} />}
        </div>
      </div>
    );
  }

  function renderDeleteModal() {
    return (
      <DeleteModal
        subjectName="Coupoon"
        isVisible={showDeleteCouponModal}
        isPending={isPending}
        onClose={closeDeleteCouponModal}
        onDelete={handleClickDelete}
      />
    );
  }

  return (
    <React.Fragment>
      {renderTable()}
      {renderSidePanel()}
      {renderDeleteModal()}
    </React.Fragment>
  );
}

Coupons.propTypes = {
  coupons: array,
  clearError: func.isRequired,
  createCoupon: func.isRequired,
  deleteCoupon: func.isRequired,
  error: string,
  isPending: bool.isRequired,
  services: array,
  updateCoupon: func.isRequired
};

Coupons.defaultProps = {
  coupons: [],
  error: "",
  services: []
};
