import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import { Users, CalendarCheck } from 'lucide-react';

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
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block" place={booking.place}>
        {booking.place.address}
      </AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-md flex items-center justify-between">
        <div>
          <h2 className="text-xl mb-4">Your booking information</h2>
          <BookingDates booking={booking} />
          <div className="text-lg flex items-center gap-1.5 mt-2">
            <Users className="w-5 h-5" />
            {booking.guests} guests |
            <CalendarCheck className="w-5 h-5" /> Booked on :{" "}
            {formatDate(booking.bookingDate)}
          </div>
        </div>
        <div className="bg-primary p-6 rounded-md text-white ">
          <div className="text-center">Total Price</div>
          <div className="text-3xl text-center font-semibold">&#x20B9; {booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}
