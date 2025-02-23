import { useNavigate } from "react-router-dom";

function NextPageButton() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Home Page</h2>
            <button onClick={() => navigate("message")}>
                Go to message Page
            </button>
        </div>
    );
}

export default NextPageButton;
