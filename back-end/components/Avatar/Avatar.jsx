import React from "react";
import { string } from "prop-types";
import "./Avatar.scss";

export default function Avatar({ name }) {
  function getInitials() {
    const words = name.split(" ").filter(words => words);
    const initials = `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`;
    return initials.toUpperCase();
  }

  function getStyle() {
    const colours = [
      "#e6194b",
      "#3cb44b",
      "#ffe119",
      "#4363d8",
      "#f58231",
      "#911eb4",
      "#42d4f4",
      "#fabebe",
      "#469990",
      "#800000"
    ];
    const hash = Math.abs(getHashCode(name));
    return { backgroundColor: colours[hash % colours.length] };
  }

  function getHashCode(s) {
    return s.split("").reduce(function(a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  return (
    <div className="avatar" style={getStyle()}>
      {getInitials()}
    </div>
  );
}

Avatar.propTypes = {
  name: string.isRequired
};
