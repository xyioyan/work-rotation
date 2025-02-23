import { useState } from "react";
import { Buttons } from "./ButtonForPractice";
// PascalCasing
function ListGroup2() {
  // jsx : Javascript xml

  // const name = "sathi";
  
  let [count, setCount] = useState(0);

    return (
        <div>
            <div>{count}</div>
            <Buttons option={"secondary"} onClick={()=> setCount(count+1)}>clickMe</Buttons>
        </div>
    )

  
  // if (name) return <h1>Hello {name} </h1>;
  // return <h1>Hello World</h1>;
  
}
export default ListGroup2;

