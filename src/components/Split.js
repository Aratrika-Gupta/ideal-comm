"use client";
import React from "react";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "./ui/text-reveal-card.js";

export function Choice() {
    const handle_emails = () => {
        window.location.href = "http://localhost:3002/emails" // Redirect to the backend route
      };
      const send_emails = () => {
        window.location.href = "http://localhost:3002/send" // Redirect to the backend route
      };
  return (
    (<div
      className="flex flex-col items-center justify-center bg-[#0E0E10] h-[50rem] rounded-2xl w-full gap-20">
      <TextRevealCard text="Send an Email" revealText=" Or check your emails">
        <TextRevealCardTitle>
          Sometimes, you just need to do it.
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          Can you see what I did? Yes, both are powered by AI.
        </TextRevealCardDescription>
      </TextRevealCard>
      <div className="flex items-center justify- center gap-10">
      <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm" onClick={handle_emails}>
          Check Recent Emails
        </button>
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm" onClick={send_emails}>
          Send an Email
        </button>
        </div>
    </div>)
  );
}