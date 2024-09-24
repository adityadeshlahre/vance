import React from "react";

const Landing: React.FC = () => {
  return (
    <>
      <div className="text-8xl">Click to Go to Postman Doc</div>
      <button
        onClick={() => {
          window.location.href =
            "https://documenter.getpostman.com/view/28045958/2sAXqv51Kp";
        }}
        className="text-5xl bg-slate-600 border-2 border-neutral-950"
      >
        Redirect
      </button>
    </>
  );
};

export default Landing;
