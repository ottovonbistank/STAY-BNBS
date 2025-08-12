import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SelectRole() {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const chooseRole = (role) => {
    setRole(role);
    navigate(role === "seller" ? "/seller" : "/buyer");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Are you a Buyer or Seller?</h2>
      <button onClick={() => chooseRole("seller")} className="bg-green-500 text-white px-4 py-2 rounded">
        Seller
      </button>
      <button onClick={() => chooseRole("buyer")} className="bg-blue-500 text-white px-4 py-2 rounded">
        Buyer
      </button>
    </div>
  );
}
