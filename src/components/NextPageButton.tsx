import { useNavigate } from "react-router-dom";

function NextPageButton() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Home Page</h2>
            <button onClick={() => navigate("/apps")}>
                Go to app Page
            </button>
        </div>
    );
}

export default NextPageButton;
