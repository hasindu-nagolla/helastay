import React, { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";

const AddRoom = () => {
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free WiFi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  return (
    <form>
      <Title
        align="left"
        font="outfit"
        title="Add Rom"
        subTitle="Welcome back to your Hotel Booking Dashboard – here you can manage reservations, 
        monitor occupancy rates, track guest check-ins and check-outs, and explore insightful statistics 
        about your properties across Sri Lanka, all in one convenient place."
      />

      {/* upload area for images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 fles-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img className="max-h-13 cursor-pointer opacity-80 " src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
          </label>
        ))}
      </div>
    </form>
  );
};

export default AddRoom;
