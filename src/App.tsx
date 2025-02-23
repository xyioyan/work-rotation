import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Alert from "./components/Alert";
import { Buttons } from "./components/ButtonForPractice";
import ListGroup2 from "./components/ClickCalculation";
import ListGroup from "./components/ListGroup";
import Message from "./Message";
import NextPageButton from "./components/NextPageButton2";

function Apps() {
  let items = ["Theni", "Kambam", "Madurai", "Coimbatore", "Pollachi"];
  let selectedItem = (item: string) => console.log(item);
  let [opened, setStatus] = useState(false);
  let clicked = () => setStatus(true);
  let close = () => setStatus(false);

  return (
    <div>
      <ListGroup2 />
      
      <ListGroup items={items} heading="Cities" onSelected={selectedItem} />

      {opened && <Alert onClose={close}>Hello <span>World</span></Alert>}

      <Buttons onClick={clicked}>My Alert Button</Buttons>

      {/* Nested Routes */}
      <Routes>
        <Route path="/" element={<NextPageButton />} />
        <Route path="message" element={<Message />} />
      </Routes>
    </div>
  );
}

export default Apps;
