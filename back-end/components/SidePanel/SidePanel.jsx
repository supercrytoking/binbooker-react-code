import React from "react";
import PropTypes from "prop-types";
import { Drawer } from "antd";

// You're supposed to import the entire antd styles, but that affects the entire app. So just import the style for this component and cross fingers.
// import "antd/dist/antd.css";
import "antd/lib/drawer/style/index.css";

import "./SidePanel.scss";

export default function SidePanel({ heading, children, onClose, open, width }) {
  // NOTE: sometimes I was passing in `open` as an object, and in that case whenever you type in an input in the SidePanel, it loses focus (so you have to give the input focus after each keypress)
  // I could cast it with !!

  let size;
  switch (width) {
    case "small":
      size = "33%";
      break;
    case "medium":
      size = "50%";
      break;
    case "large":
      size = "100%";
      break;
  }
  return (
    <Drawer
      className="jk-sidepanel"
      closable
      closeIcon={"×"}
      destroyOnClose
      onClose={onClose}
      placement="right"
      title={heading}
      visible={open}
      width={size}
    >
      {children}
    </Drawer>
  );
}

SidePanel.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  width: PropTypes.oneOf(["small", "medium", "large"])
};

SidePanel.defaultProps = {
  open: false,
  onClose: () => {},
  onOpen: () => {},
  width: "medium"
};
