import React from "react";

const Animation = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div className="relative">
        <img
          src="/images/party1.gif"
          alt="Party GIF"
          className="w-64 h-64 object-contain"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl bg-gradient-to-t from-teal-400 to-blue-500 bg-clip-text text-transparent font-bold animate-bounce">
            Registered Successfully!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Animation;
