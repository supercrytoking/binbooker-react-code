import React from "react";
import "./BinBookerFooter.scss";

export default function BinBookerFooter() {
  const d = new Date();

  return (
    <footer className="binbooker-footer">
      Powered by{" "}
      <a href="http://www.binbooker.com" target="_blank" rel="noreferrer noopener">
        BinBooker.com
      </a>{" "}
      &copy; {d.getFullYear()}
    </footer>
  );
}
