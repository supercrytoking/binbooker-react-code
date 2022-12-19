import React from "react";
import QuickBooksButton from "Components/QuickBooks/Button";

export default function ConnectButton({ connectToQuickBooks }) {
  return (
    <React.Fragment>
      <p>
        Clicking the button below will open QuickBooks Online in a new window where you will login and be prompted to
        give BinBooker access to your QuickBooks Online account.
      </p>
      <p>
        <QuickBooksButton onClick={connectToQuickBooks} />
      </p>
    </React.Fragment>
  );
}
