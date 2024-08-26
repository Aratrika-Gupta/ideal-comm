// src/components/AuthorizeNylas.js
import React from "react";
import "../App.css";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect.js";


function AuthorizeNylas() {
  const handleAuthorize = () => {
    window.location.href = "http://localhost:3000/nylas/auth" // Redirect to the backend route
  };
  const words = [
    {
      text: "Discover the",
    },
    {
      text: "Power of",
    },
    {
      text: "Gemini",
    },
    {
      text: "x",
    },
    {
      text: "Nylas.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 text-xs sm:text-base  ">
        The road to transformation starts from here
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm" onClick={handleAuthorize}>
          Authorize Nylas
        </button>
        </div>
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))] text-7xl text-bold">
          <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span className="">Integrating AI with Your Email Systems</span>
          </div>
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span className="">Integrating AI with Your Email Systems</span>
          </div>
        </div>
        <footer className="text-gray-800 pd-10">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <span className="font-semibold">Aratrika Gupta</span>. All rights reserved.
        </p>
      </div>
    </footer>
        </div>
  );
}

export default AuthorizeNylas;
