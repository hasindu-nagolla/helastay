import React, { useState } from "react";
import Title from "../components/Title";
import { userBookingsDummyData } from "../assets/assets";

const MyBookings = () => {
  const [bookings, setBookings] = useState(userBookingsDummyData);

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks."
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Date & Timing</div>
          <div className="w-1/3">Payment</div>
        </div>

        {bookings.map((booking) => (
          <div
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-3000 py-6 first:border-t"
            key={booking._id}
          >
            {/* Hotel  details */}
            <div>
                <img className="min-md:w-44 rounded shadow object-cover" src={booking.room.images[0]} alt="hotel-img" />
            </div>
            {/* date & timing */}
            <div></div>
            {/* payment status */}
            <div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
