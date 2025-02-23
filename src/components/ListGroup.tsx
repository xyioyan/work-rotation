import { useState } from "react";
interface Props {
  items: String[];
  heading: String;
  onSelected: (item: String) => void;
}

function ListGroup({ items, heading, onSelected }: Props) {
  let [selectedIndex, setSelectedIndex] = useState(-1);
  // items = [];
  // if (items.length == 0) return <p>no item found</p>;
  return (
    <>
      <h1>{heading}</h1>
      <ul className="list-group">
        {items.length === 0 && <p>No items found</p>}
        {items.map((item, index) => (
          <li
            // key={item}
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            onClick={() => {
              setSelectedIndex(index);
              onSelected(item);
            }}
            key = {item}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
export default ListGroup;
