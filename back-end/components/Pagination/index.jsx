import React from "react";
import { func, number } from "prop-types";
import { Button, DropdownButton, MenuItem } from "react-bootstrap";
import "./Pagination.scss";

function getMenuItems({ currentPage, onChange, totalPages }) {
  const menuItems = [];

  for (let i = 1; i <= totalPages; i++) {
    menuItems.push(
      <MenuItem
        disabled={currentPage === i}
        key={`menuitem-${i}`}
        onSelect={() => {
          onChange(i);
        }}
      >
        Page {i} of {totalPages}
      </MenuItem>
    );
  }

  return menuItems;
}

const Pagination = props => {
  if (props.totalPages <= 1) {
    return null;
  }

  const prevIsDisabled = props.currentPage === 1;
  const nextIsDisabled = props.currentPage === props.totalPages;

  return (
    <div className="jk-pagination">
      <Button bsStyle="link" disabled={prevIsDisabled} onClick={props.onClickPrev}>
        &laquo; Prev
      </Button>
      <DropdownButton dropup id="pagination" title={`Page ${props.currentPage} of ${props.totalPages}`}>
        {getMenuItems(props)}
      </DropdownButton>
      <Button bsStyle="link" disabled={nextIsDisabled} onClick={props.onClickNext}>
        Next &raquo;
      </Button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: number.isRequired,
  totalPages: number.isRequired,
  onChange: func,
  onClickPrev: func,
  onClickNext: func
};

Pagination.defaultProps = {
  onChange: () => {},
  onClickPrev: () => {},
  onClickNext: () => {}
};

export default Pagination;
