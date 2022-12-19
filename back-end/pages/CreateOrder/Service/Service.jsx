import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import moment from "moment";
import { Alert, Glyphicon, OverlayTrigger, Popover } from "react-bootstrap";
import Spinner from "Components/Spinner";
import Select from "Components/Select";
import CustomUserText from "../components/CustomUserText/CustomUserText.jsx";
import CreateOrderActionBar from "../components/ActionBar/create-order-action-bar.jsx";
import { formatDollarAmount, scrollToTop } from "Utils/library.jsx";
import "./Service.scss";

export default function Service({
  activeBin,
  activeServiceId,
  customUserText,
  error,
  hasTax,
  isLoading,
  onChange,
  onChangeActiveBin,
  handleSelectSuggestedDates,
  onClickBack,
  onValidContinue,
  services
}) {
  React.useEffect(() => {
    document.title = `Rent a dumpster | Service`;
    scrollToTop();
  }, []);

  React.useEffect(scrollToTop, [error]);

  function renderErrors() {
    return error && <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: error }} />;
  }

  function renderPriceBreakdownOverlay(rentalPrice, extraDaysPrice) {
    if (extraDaysPrice == 0) return null;

    const plusApplicableTaxes = hasTax ? (
      <div className="service__pricing-popover__taxes">(plus applicable taxes)</div>
    ) : null;

    const pricingPopover = (
      <Popover id="pricing-popover">
        <div className="service__pricing-popover">
          <div>
            <span>Rental:</span>
            <span>{formatDollarAmount(rentalPrice)}</span>
          </div>
          <div>
            <span className="service__pricing-popover__name">Extra days:</span>
            <span>{formatDollarAmount(extraDaysPrice)}</span>
          </div>
          {plusApplicableTaxes}
        </div>
      </Popover>
    );

    return (
      <OverlayTrigger delayShow={500} placement="right" overlay={pricingPopover}>
        <Glyphicon glyph="question-sign" />
      </OverlayTrigger>
    );
  }

  function renderSuggestedDates(noDatesAvailable, startDate, endDate, onSeleteDates) {
    if (noDatesAvailable) {
      return (
        <Alert bsStyle="warning">
          This service is not available for the chosen date range and there is no availability within two weeks. Choose
          another service or go back to the previous step and try another date range.
        </Alert>
      );
    }

    if (startDate) {
      const formattedStartDate = moment(startDate).format("dddd MMMM D");
      const formattedEndDate = moment(endDate).format("dddd MMMM D");

      return (
        <Alert bsStyle="warning">
          This service is not available for the chosen date range. The closest available date range is from{" "}
          {formattedStartDate} until {formattedEndDate}.{" "}
          <a href="javascript:void(0);" onClick={onSeleteDates}>
            Click here to choose these dates and this service
          </a>{" "}
          or go back to the previous step and try another date range.
        </Alert>
      );
    }

    return null;
  }

  function renderChooseAnAvailableBin(bins) {
    if (!bins) {
      return null;
    }

    const options = [
      { value: "", text: "Random" },
      ...bins.map(bin => {
        const key = Object.keys(bin)[0];
        return { value: key, text: bin[key] };
      })
    ];

    return (
      <div className="service--bin-selector">
        <Select
          name="binId"
          label="Use which dumpster?"
          value={activeBin ? activeBin.id : ""}
          options={options}
          onChange={e => {
            onChangeActiveBin({
              id: e.target.value,
              foreignId: e.target.options[e.target.options.selectedIndex].innerHTML
            });
          }}
          disabled={false}
        />
      </div>
    );
  }

  function renderServices() {
    if (services.length === 0) {
      return (
        <p className="no-services-message">
          While you are in our serviceable area, there are no services activated in your area. This is possibly a
          configuration error on our part; please contact us and we may be able to resolve this issue.
        </p>
      );
    }

    return services.map(service => {
      service.extraDaysPrice = +service.extraDaysPrice;
      service.id = +service.id;
      service.rentalPrice = +service.rentalPrice;

      const isActive = activeServiceId !== null && activeServiceId === service.id;
      const isDisabled = service.noDatesAvailable || service.suggestedStartDate !== null;

      const serviceClass = classnames(
        "service",
        { "service--active": isActive },
        { "service--enabled": !isDisabled },
        { "service--disabled": isDisabled }
      );

      const onClick = isDisabled ? null : () => onChange(service);
      const onSeleteDates = () => {
        handleSelectSuggestedDates(
          {
            startDate: moment(service.suggestedStartDate),
            endDate: moment(service.suggestedEndDate)
          },
          service
        );
      };

      const isBackEnd = window.location.pathname.indexOf("back") > -1;

      return (
        <div className={serviceClass} onClick={onClick} key={service.id}>
          <div className="content">
            {service.imagePath.length > 0 && (
              <img className="first-service-image" src={`/images/services/${service.imagePath}`} />
            )}

            <input
              type="radio"
              name="serviceId"
              value={service.id}
              checked={isActive}
              disabled={isDisabled}
              onChange={() => {}}
            />
            <h4>
              {service.title}
              <small>{formatDollarAmount(parseFloat(service.rentalPrice) + parseFloat(service.extraDaysPrice))}</small>
              {renderPriceBreakdownOverlay(service.rentalPrice, service.extraDaysPrice)}
            </h4>
            {isActive && isBackEnd && renderChooseAnAvailableBin(service.availableBins)}
            <p dangerouslySetInnerHTML={{ __html: service.description }} />
            {service.imagePath.length > 0 && (
              <img className="second-service-image" src={`/images/services/${service.imagePath}`} />
            )}
          </div>
          {renderSuggestedDates(
            service.noDatesAvailable,
            service.suggestedStartDate,
            service.suggestedEndDate,
            onSeleteDates
          )}
        </div>
      );
    });
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <React.Fragment>
      <div className="row">
        <label className="control-label create-order__step-label">Choose your service:</label>
      </div>

      <CustomUserText text={customUserText} />
      {renderErrors()}

      <div className="row">
        <div className="col-md-12">{renderServices()}</div>
      </div>
      <CreateOrderActionBar disabled={false} onClickContinue={onValidContinue} onClickBack={onClickBack} />
    </React.Fragment>
  );
}

Service.propTypes = {
  activeBin: PropTypes.shape({ id: PropTypes.string, foreignId: PropTypes.string }),
  activeServiceId: PropTypes.number,
  customUserText: PropTypes.string,
  error: PropTypes.string,
  hasTax: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onChangeActiveBin: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  onValidContinue: PropTypes.func.isRequired,
  services: PropTypes.array
};

Service.defaultProps = {
  activeBin: null,
  activeServiceId: null,
  customUserText: "",
  error: null,
  isLoading: false,
  services: []
};
