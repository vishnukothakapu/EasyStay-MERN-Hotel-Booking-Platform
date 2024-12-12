import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import { Users, CalendarCheck } from "lucide-react";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const bookingDoc = response.data.find(({ _id }) => _id === id);
        if (bookingDoc) {
          setBooking(bookingDoc);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  function formatDate(date) {
    return format(new Date(date), "dd-MM-yyyy");
  }

  return (
    <div className="my-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl md:text-3xl font-semibold text-gray-900 text-center md:text-left">
        {booking.place.title}
      </h1>
      <AddressLink
        className="my-2 block text-center md:text-left"
        place={booking.place}
      >
        {booking.place.address}
      </AddressLink>

      <div className="bg-gray-200 p-6 my-6 rounded-md flex flex-col items-center justify-between gap-4">
        <div className="flex-1 text-center">
          <h2 className="text-xl font-semibold mb-4">
            Your booking information
          </h2>
          <BookingDates booking={booking} />
          <div className="text-lg flex flex-col items-center gap-2 mt-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-5 h-5" />
              {booking.guests} guests
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarCheck className="w-5 h-5" />
              Booked on: {formatDate(booking.bookingDate)}
            </div>
          </div>
        </div>

        <div className="bg-primary p-6 rounded-md text-white flex flex-col items-center justify-center w-full">
          <div className="text-center text-sm">Total Price</div>
          <div className="text-2xl font-semibold">&#x20B9; {booking.price}</div>
        </div>
      </div>

      <PlaceGallery place={booking.place} />
    </div>
  );
}
