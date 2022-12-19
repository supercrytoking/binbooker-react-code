import React from "react";
import PropTypes from "prop-types";
import "./CompanyHeader.scss";

export default function CompanyHeader({ email, logoPath, phoneNumber, url }) {
  return (
    <header className="create-order__company-header">
      <div className="company-header-logo">
        <a href={url}>
          <img alt="Logo" src={logoPath} />
        </a>
      </div>
      <address>
        <label>Phone:</label> <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
        <br />
        <label>Email:</label> <a href={`mailto:${email}`}>{email}</a>
      </address>
    </header>
  );
}

CompanyHeader.propTypes = {
  email: PropTypes.string.isRequired,
  logoPath: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

CompanyHeader.defaultProps = {};
