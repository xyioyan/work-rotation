import { Routes, Route } from "react-router-dom";
import NextPageButton from "./NextPageButton";  // Updated path
import Apps from "../App";
import WorkRotation from "./WorkRotation";
import WorkRotat from "./RotationPractice";
import Message from "../Message";



function App() {
    const now = new Date();
    
    return (
        
        
        <div>
            
            
            <WorkRotation/>
        </div>

    );
}

export default App;
