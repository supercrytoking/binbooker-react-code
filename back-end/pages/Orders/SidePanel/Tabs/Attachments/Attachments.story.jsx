import React from "react";
import { storiesOf } from "@storybook/react";
import Attachments from "./Attachments.jsx";

storiesOf("App Pages/Orders/Attachments", module)
  .add("With no images", () => <Attachments attachments={[]} />)
  .add("With images", () => (
    <Attachments
      attachments={[
        {
          notes: "square cat image",
          thumbnailPath: "https://i.kym-cdn.com/photos/images/original/001/250/216/305.jpg",
          path: "https://i.kym-cdn.com/photos/images/original/001/250/216/305.jpg"
        },
        {
          notes: "tall cat image",
          thumbnailPath: "https://cdn2.thecatapi.com/images/MTY0Nzg3Mw.jpg",
          path: "https://cdn2.thecatapi.com/images/MTY0Nzg3Mw.jpg"
        },
        {
          notes: "wide cat image",
          thumbnailPath: "https://cdn2.thecatapi.com/images/7ds.jpg",
          path: "https://cdn2.thecatapi.com/images/7ds.jpg"
        }
      ]}
    />
  ));
