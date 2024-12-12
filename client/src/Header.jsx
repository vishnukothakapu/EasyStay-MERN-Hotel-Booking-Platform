import { useContext} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Navigation2,MapPinHouse} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios"; // Import Axios

const Header = () => {
  const { user, ready } = useContext(UserContext);

  if (!ready) return <div>Loading...</div>;

 

  return (
    <div>
      <header className="flex justify-between items-center">
        <Link to={"/"} className="logo flex items-center gap-1.5">
          <MapPinHouse className="w-7 h-7 stroke-[#f5385D]" />
          <span className="font-semibold text-xl">EasyStay</span>
        </Link>
        
        <Link
          to={user ? "/account" : "/login"}
          className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
            {user?.profilePic ? (
              <img
                src={`http://localhost:3030${user.profilePic}`}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 relative top-1"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          {!!user && <div>{user.name}</div>}
        </Link>
      </header>
    </div>
  );
};

export default Header;
