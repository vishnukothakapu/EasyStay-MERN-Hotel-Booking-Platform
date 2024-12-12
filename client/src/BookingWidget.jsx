import { useState, useEffect, useContext } from "react";
import { Users, User, Phone } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import jsPDF from "jspdf";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);
  const today = new Date().toISOString().split("T")[0];
  let numberOfNights = 0;

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    if (!user) {
      toast.error("You must be logged in to book a place.");
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }
    if (!mobile) {
      toast.error("Please enter your mobile number.");
      return;
    }
    if (mobile.length < 10) {
      toast.error("Please enter a valid mobile number.");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post("/bookings", {
        place: place._id,
        checkIn,
        checkOut,
        guests: numberOfGuests,
        name,
        mobile,
        price: numberOfNights * place.price,
      });
      const bookingId = response.data._id;
      toast.success("Booking successful.");
      setLoading(false);
      generatePDF({
        bookingId,
        placeTitle: place.title,
        placeAddress: place.address,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        mobile,
        bookedOn: new Date().toLocaleDateString(),
        price: numberOfNights * place.price,
      });
      setRedirect(`/account/bookings/${bookingId}`);
    } catch (err) {
      console.error("Booking error:", err.response || err.message);
      toast.error("Booking failed. Please try again.");
      setLoading(false);
    }
  }

  function generatePDF(details) {
    const doc = new jsPDF();
    const img = new Image();
    img.src = `${window.location.origin}/thankyou.png`;
    img.onload = () => {
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Booking Confirmation", 105, 40, null, null, "center");
      doc.setFont("times", "normal");
      doc.setFontSize(18);
      doc.text("EasyStay",20,15)
      // Adding image
      doc.addImage(img, "PNG", 150, 30, 40, 40);
      // Booking details
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Booking ID: ${details.bookingId}`, 120, 12);
      doc.setTextColor(100);
      doc.text(`(Booked on ${details.bookedOn})`, 140, 18);
      doc.setTextColor(0, 0, 0);
      doc.text(`Place: ${details.placeTitle}`, 20, 60);
      doc.text(`Address: ${details.placeAddress}`, 20, 70);
      doc.text(`Check-in: ${details.checkIn}`, 20, 80);
      doc.text(`Check-out: ${details.checkOut}`, 20, 90);
      doc.text(
        `Guests: ${details.numberOfGuests}, ${differenceInCalendarDays(
          new Date(details.checkOut),
          new Date(details.checkIn)
        )} nights`,
        20,
        100
      );
      doc.text(`Name: ${details.name}`, 20, 110);
      doc.text(`Mobile: ${details.mobile}`, 20, 120);
      doc.text(`Price paid: Rs.${details.price}`, 20, 130);

      doc.save(`booking-${details.bookingId}.pdf`);
    };
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <div className="bg-white p-4 rounded-md">
        <span className="text-center text-xl font-semibold">
          Price: ₹ {place.price} per night
        </span>
        {!user ? (
          <div className="mt-4">
            <p className="text-red-500 font-semibold">
              You must be logged in to book this place.
            </p>
            <button
              className="primary mt-4"
              onClick={() => {
                toast.error("Please log in to continue.");
                setRedirect("/login");
              }}
            >
              Log in to book
            </button>
          </div>
        ) : (
          <div className="border rounded-md mt-4">
            <div className="flex items-center gap-1 justify-center">
              <div className="px-3 py-4 text-center">
                <label>Check in: </label>
                <input
                  type="date"
                  className="font-semibold text-center"
                    value={checkIn}
                    min={today}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                  required
                />
              </div>
              <div className="px-3 py-4 border-l text-center">
                <label>Check out: </label>
                <input
                  type="date"
                  className="font-semibold text-center"
                  value={checkOut}
                  min={checkIn || ""}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                  required
                />
              </div>
            </div>
            <div className="py-4 px-4 border-t">
              <label>Number of guests</label>
              <h5 className="text-sm text-gray-500">
                Max Guests: {place.maxGuests}
              </h5>
              <div className="flex relative items-center">
                <Users className="absolute left-2 w-5 h-5 stroke-gray-500" />
                <input
                  type="number"
                  value={numberOfGuests}
                  onChange={(ev) => {
                    const value = ev.target.value;
                    if (value > place.maxGuests) {
                      toast.error(`Max ${place.maxGuests} guests allowed.`);
                      return;
                    }
                    else if (value < 0) {
                      toast.error("Invalid number of guest");
                      return;
                    } else {
                      setNumberOfGuests(value);
                    }
                  }}
                  className="pl-8 w-full"
                  required
                />
              </div>
            </div>
            {numberOfNights > 0 && (
              <div className="py-3 px-4 border-t">
                <label>Name:</label>
                <div className="flex relative items-center">
                  <User className="absolute left-2 w-5 h-5 stroke-gray-500" />
                  <input
                    type="text"
                    className="cursor-not-allowed bg-gray-200 w-full pl-8"
                    value={user.name}
                    disabled={true}
                  />
                </div>
                <label>Mobile number:</label>
                <div className="flex relative items-center">
                  <Phone className="absolute stroke-gray-500 w-5 h-5 left-2" />
                  <input
                    type="tel"
                    value={mobile}
                    maxLength={10}
                    className="w-full pl-8"
                    placeholder="+91 1234567890"
                    onChange={(ev) => setMobile(ev.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {user && (
          <button
            className="mt-4 primary"
            onClick={bookThisPlace}
            disabled={loading || !checkIn || !checkOut || !mobile}
          >
            {loading ? "Processing..." : "Book this place"} <br />
            {numberOfNights > 0 && (
              <span>
                ₹ {numberOfNights * place.price} - {numberOfNights} nights
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
