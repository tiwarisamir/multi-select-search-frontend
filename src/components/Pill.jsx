import React from "react";

const Pill = ({ image, text, onClick }) => {
  return (
    <span
      onClick={onClick}
      className="h-[2rem] flex items-center gap-1 bg-black text-white py-5 px-3 border-0 rounded-2xl cursor-pointer"
    >
      <img src={image} alt={text} className="h-[1.5rem]" />
      <span>{text} &times;</span>
    </span>
  );
};

export default Pill;
