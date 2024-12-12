import AccountNav from "../AccountNav";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PlaceImg from "../PlaceImg";
import jsPDF from "jspdf";
import {differenceInCalendarDays,format } from "date-fns";
import BookingDates from "../BookingDates";
import { Users,Receipt,FileDown } from 'lucide-react';
export default function BookingsPage() {
  const [bookings, setBookings] = useState();

  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);
  function formatDate(date) {
    return format(new Date(date), "dd-MM-yyyy");
  }
   const generatePDF = (booking)=>{
     const doc = new jsPDF();
     const img = new Image();
     img.src = `${window.location.origin}/thankyou.png`;
     img.onload = () => {
       doc.setFontSize(24);
       doc.setFont("helvetica", "bold");
       doc.text("Booking Confirmation", 105, 33, null, null, "center");
         doc.setFont("times", "normal");
         doc.setFontSize(18);
         doc.text("EasyStay", 20, 15);
       // Adding image
       doc.addImage(img, "PNG", 150, 30, 40, 40);
       // Booking details
       doc.setFontSize(12);
       doc.setFont("helvetica", "normal");
       doc.text(`Booking ID: ${booking._id}`, 120, 12);
       doc.setTextColor(100);
       doc.text(`(Booked on ${formatDate(booking.bookingDate)})`, 140, 18);
       doc.setTextColor(0, 0, 0);
       doc.text(`Place: ${booking.place.title}`, 20, 50);
       doc.text(`Address: ${booking.place.address}`, 20, 60);
       doc.text(`Check-in: ${formatDate(booking.checkIn)}`, 20, 70);
       doc.text(`Check-out: ${formatDate(booking.checkOut)}`, 20, 80);
        doc.text(
          `Guests: ${booking.guests}, Nights: ${differenceInCalendarDays(
            new Date(booking.checkOut),
            new Date(booking.checkIn)
          )}`,
          20,
          90
        );
       doc.text(`Name: ${booking.name}`, 20, 100);
       doc.text(`Mobile: ${booking.mobile}`, 20, 110);
       doc.text(`Price: Rs.${booking.price}`, 20, 120);

       doc.save(`booking-${booking._id}.pdf`);
     };
   }
  
  return (
    <div>
      <AccountNav />
      {bookings?.length == 0 && (
        <div className="my-4 text-center">No bookings found</div>
      )}
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking, index) => (
            <Link
              key={index}
              to={`/account/bookings/${booking._id}`}
              className="flex gap-4 bg-gray-200 rounded-md overflow-hidden mt-6"
            >
              <div className="w-48 relative overflow-hidden">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3 pr-3 grow">
                <h2 className="text-xl">{booking.place.title}</h2>
                <BookingDates booking={booking} />
                <div className="text-lg flex items-center gap-1.5 mt-2">
                  <Users className="w-5 h-5" />
                  {booking.guests} guests |
                  <Receipt className="w-5 h-5" /> Total price: &#x20B9;{" "}
                  {booking.price}
                </div>
                <button
                  className="mt-2 flex items-center gap-1.5 bg-primary text-white px-2 py-1 rounded-md"
                  onClick={() => generatePDF(booking)}
                >
                  <FileDown className="w-4 h-4" />
                  <span className="text-sm">Download PDF</span>
                </button>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
