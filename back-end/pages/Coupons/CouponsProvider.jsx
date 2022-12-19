import React from "react";
import Coupons from "./Coupons.jsx";
import Spinner from "Components/Spinner";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import { get, put, remove, post } from "Utils/services.jsx";
import "./Coupons.scss";

const API_ENDPOINT = "/api/v2/coupons";
const API_SERVICES_ENDPOINT = "/api/v2/services";

export default function CouponsProvider() {
  const [coupons, setCoupons] = React.useState(null);
  const [error, setError] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    getCouponsAndServices();
  }, []);

  function handleClearError() {
    setError("");
  }

  async function getCouponsAndServices() {
    const coupons = await get(API_ENDPOINT);
    setCoupons(coupons);

    const services = await get(API_SERVICES_ENDPOINT);
    setServices(services);
  }

  async function updateOrCreateCoupon(activeCoupon, isCreate) {
    if (activeCoupon.code === "") {
      setError("You must enter a coupon code.");
      return false;
    }

    if (activeCoupon.value <= 0) {
      setError("You must enter a coupon value.");
      return false;
    }

    setIsPending(true);
    try {
      isCreate ? await post(API_ENDPOINT, activeCoupon) : await put(`${API_ENDPOINT}/${activeCoupon.id}`, activeCoupon);
      const coupons = await get(API_ENDPOINT);
      setCoupons(coupons);
      setIsPending(false);
      return true;
    } catch (errorMessage) {
      setError(errorMessage);
    }

    setIsPending(false);
    return false;
  }

  async function handleUpdateCoupon(activeCoupon) {
    return updateOrCreateCoupon(activeCoupon, false);
  }

  async function handleCreateCoupon(activeCoupon) {
    return updateOrCreateCoupon(activeCoupon, true);
  }

  async function handleDeleteCoupon(activeCoupon) {
    setIsPending(true);
    await remove(`${API_ENDPOINT}/${activeCoupon.id}`);
    const _coupons = coupons.filter(coupon => coupon.id !== activeCoupon.id);
    setIsPending(false);
    setCoupons(_coupons);
  }

  const loggedInStaff = React.useContext(LoggedInStaffContext);

  if (!loggedInStaff) {
    return <Spinner />;
  }

  if (!loggedInStaff.pageAccess.manageCoupons) {
    return null;
  }

  return (
    <Coupons
      clearError={handleClearError}
      coupons={coupons}
      createCoupon={handleCreateCoupon}
      deleteCoupon={handleDeleteCoupon}
      error={error}
      isPending={isPending}
      services={services}
      updateCoupon={handleUpdateCoupon}
    />
  );
}

CouponsProvider.propTypes = {};

CouponsProvider.defaultProps = {};
