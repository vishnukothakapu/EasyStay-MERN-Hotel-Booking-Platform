import { useLocation,Link } from "react-router-dom";
import { CircleUserRound,CircleCheck,MapPin} from "lucide-react";
export default function AccountNav() {
    const { pathname } = useLocation();
    let subpage = pathname.split("/")?.[2];
    if (subpage === undefined) { 
        subpage = "profile";
    }
        function linkClasses(type = null) {
            let classes = "inline-flex gap-2 py-2 px-6 items-center ";
            if (type === subpage) {
                classes += " bg-primary text-white rounded-full";
            } else {
                classes += "bg-gray-200 rounded-full";
            }
            return classes;
        }
        return (
            <nav className="flex w-full mt-8 gap-4 justify-center py-1">
                <Link className={linkClasses("profile")} to={"/account"}>
                    <CircleUserRound className="w-5 h-5" />
                    My profile
                </Link>
                <Link className={linkClasses("bookings")} to={"/account/bookings"}>
                    <CircleCheck className="w-5 h-5" />
                    My bookings
                </Link>
                <Link className={linkClasses("places")} to={"/account/places"}>
                    <MapPin className="w-5 h-5" />
                    My accomodations
                </Link>
            </nav>
        );
    }