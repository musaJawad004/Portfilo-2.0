"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

export function GuestbookForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [characters, setCharacters] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setFeedback("TRANSMITTING NOTE...");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) throw new Error(result.message || "Your note could not be sent.");

      setStatus("success");
      setFeedback("NOTE RECEIVED / AWAITING REVIEW");
      setCharacters(0);
      form.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message.toUpperCase() : "YOUR NOTE COULD NOT BE SENT.");
    }
  }

  return (
    <form className="guestbook-form" onSubmit={handleSubmit}>
      <label>
        <span>YOUR NAME</span>
        <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={60} placeholder="Your name" />
      </label>
      <label>
        <span>EMAIL / KEPT PRIVATE</span>
        <input name="email" type="email" autoComplete="email" maxLength={160} placeholder="you@example.com" />
      </label>
      <label className="guestbook-message">
        <span>LEAVE A NOTE</span>
        <textarea
          name="message"
          required
          minLength={8}
          maxLength={280}
          rows={6}
          placeholder="Say hello, share a thought, or leave feedback on the work."
          onChange={(event) => setCharacters(event.currentTarget.value.length)}
        />
        <small>{String(characters).padStart(3, "0")} / 280</small>
      </label>
      <label className="guestbook-honeypot" aria-hidden="true">
        <span>WEBSITE</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "[ SENDING... ]" : "[ SIGN GUESTBOOK ]"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className={`guestbook-feedback guestbook-feedback-${status}`} aria-live="polite">{feedback}</p>
    </form>
  );
}
