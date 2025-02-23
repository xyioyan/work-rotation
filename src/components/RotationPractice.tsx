import { useEffect, useState } from "react";
import "./WorkRotation.css";



function WorkRotat() {
    // let rotation = 2;
    // the interval time
    const [counts, setCount] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevCount) => (prevCount >= 8 ? 0 : prevCount + 1));
        }, 2000);
        return () => clearInterval(interval)
    }, []);

    let date = new Date();
    const arr = ['abi', 'abi', 'arul', 'arul', 'suresh', 'suresh', 'latha', 'latha'];
    let count = 0;
    return (
        <>
            <h1>h Page</h1>
            <ul className="list-group" >
                {arr.map((item) => (

                    <li
                        // key={item}
                        className={
                            count == counts ? "list-group-item hi active" : 'list-group-item'
                        }
                        onClick={() => {

                        }
                        }
                        key={count += 1}
                    >
                        {item} {count == counts && <span>change</span>}
                    </li>



                ))}
            </ul>
        </>
    );
}

export default WorkRotat;

