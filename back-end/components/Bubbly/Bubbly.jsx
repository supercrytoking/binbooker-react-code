import React from "react";
import PropTypes from "prop-types";
import noResultsImage from "./no-results.svg";
import "./Bubbly.scss";

const KINDS = {
  NO_RESULTS: "no-results"
};

function BubblyIcon({ kind }) {
  if (kind === KINDS.NO_RESULTS) {
    return <img src={noResultsImage} alt="No results" />;
  }

  return null;
}

function Bubbly({ kind, title, description, actionTitle, onClick }) {
  return (
    <div className="bubbly">
      <BubblyIcon kind={kind} />
      <h4>{title}</h4>
      <p>{description}</p>
      {actionTitle && onClick && (
        <button onClick={onClick}>
          {actionTitle}
          <i className="glyphicon glyphicon-arrow-right" />
        </button>
      )}
    </div>
  );
}

Bubbly.propTypes = {
  kind: PropTypes.oneOf(KINDS.NO_RESULTS),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionTitle: PropTypes.string,
  onClick: PropTypes.func
};

Bubbly.defaultProps = {
  kind: KINDS.NO_RESULTS,
  actionTitle: null,
  onClick: () => {}
};

Bubbly.kinds = KINDS;

export default Bubbly;
