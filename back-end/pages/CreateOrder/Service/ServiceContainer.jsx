import React from "react";
import PropTypes from "prop-types";
import momentPropTypes from "react-moment-proptypes";
import { UserContext } from "../../../UserProvider.jsx";
import { get } from "Utils/services.jsx";
import Service from "./Service.jsx";

export default function ServiceContainer({
  activeBin,
  activeServiceId,
  dropOffDate,
  postalCode,
  onChange,
  onChangeActiveBin,
  onClickBack,
  onValidContinue,
  pickUpDate,
  handleSelectSuggestedDates
}) {
  const user = React.useContext(UserContext);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [services, setServices] = React.useState(null);

  React.useEffect(() => {
    const fetchAndSetServices = async function() {
      setIsLoading(true);
      const dropOffDateString = dropOffDate.format("YYYY-MM-DD");
      const pickUpDateString = pickUpDate ? pickUpDate.format("YYYY-MM-DD") : "";

      const _services = await get(
        `/api/v2/services?dropOffDate=${dropOffDateString}&pickUpDate=${pickUpDateString}&postalCode=${postalCode}`
      );
      setServices(_services);
      setIsLoading(false);
    };

    fetchAndSetServices();
  }, [dropOffDate, pickUpDate, postalCode]);

  function handleValidContinue() {
    if (activeServiceId) {
      setError(null);
      onValidContinue();
    } else {
      setError("Please select a service.");
    }
  }

  return (
    <Service
      activeBin={activeBin}
      activeServiceId={activeServiceId}
      customUserText={user.serviceText}
      error={error}
      hasTax={+user.tax1 > 0 || +user.tax2 > 0}
      isLoading={isLoading}
      onChange={onChange}
      onChangeActiveBin={onChangeActiveBin}
      handleSelectSuggestedDates={handleSelectSuggestedDates}
      onValidContinue={handleValidContinue}
      onClickBack={onClickBack}
      services={services}
    />
  );
}

ServiceContainer.propTypes = {
  activeServiceId: PropTypes.number,
  dropOffDate: momentPropTypes.momentObj.isRequired,
  onChange: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  onValidContinue: PropTypes.func.isRequired,
  pickUpDate: momentPropTypes.momentObj,
  postalCode: PropTypes.string.isRequired
};

ServiceContainer.defaultProps = {
  activeServiceId: null,
  pickUpDate: null
};
