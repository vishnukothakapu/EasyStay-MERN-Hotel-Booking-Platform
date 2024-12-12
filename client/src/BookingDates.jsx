import { differenceInCalendarDays, format } from "date-fns";
import { CalendarDays, Moon } from "lucide-react";
export default function BookingDates({booking}) {

      function formatDate(date) {
        return format(new Date(date), "dd-MM-yyyy");
      }
  return (
    <div className=" mt-2 flex items-center gap-1">
      <CalendarDays className="w-5 h-5" />
      {formatDate(booking.checkIn)} &rarr; <CalendarDays className="w-5 h-5" />
      {formatDate(booking.checkOut)} (
      <div className="flex items-center gap-1 border-black">
        <Moon className="w-5 h-5" />
        {differenceInCalendarDays(
          new Date(booking.checkOut),
          new Date(booking.checkIn)
        )}{" "}
        nights
      </div>
      )
    </div>
  );
}
