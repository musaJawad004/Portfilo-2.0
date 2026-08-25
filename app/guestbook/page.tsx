import type { Metadata } from "next";

import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { SmoothMotion } from "../SmoothMotion";
import { listApprovedGuestbookEntries } from "../../lib/guestbook";
import { GuestbookForm } from "./GuestbookForm";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Leave a note for Muhammad Musa about the work, an idea, or a future collaboration.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function noteDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" })
    .format(new Date(value))
    .toUpperCase();
}

export default async function GuestbookPage() {
  const approvedNotes = await listApprovedGuestbookEntries();
  const approvedCount = approvedNotes.length + 1;

  return (
    <>
      <SmoothMotion />
      <SiteHeader />
      <main className="guestbook-page">
        <header className="guestbook-hero">
          <div className="guestbook-hero-meta">
            <span>010 / GUESTBOOK</span>
            <span>OPEN CHANNEL / MODERATED</span>
          </div>
          <h1>Guestbook.</h1>
          <p>Leave a signal behind. A thought, a hello, or something the work made you want to say.</p>
        </header>

        <section className="guestbook-board" aria-label="Guestbook">
          <div className="guestbook-wall">
            <header>
              <span>01 / NOTES</span>
              <span>{String(approvedCount).padStart(2, "0")} APPROVED</span>
            </header>
            <article className="guestbook-note">
              <span className="guestbook-note-index">001</span>
              <div>
                <p>Welcome to the guestbook. Leave a note about the work, share an idea, or simply say hello.</p>
                <footer>
                  <strong>MUHAMMAD MUSA</strong>
                  <span>SITE OWNER / AUG 2026</span>
                </footer>
              </div>
            </article>
            {approvedNotes.map((note, index) => (
              <article className="guestbook-note" key={note.id}>
                <span className="guestbook-note-index">{String(index + 2).padStart(3, "0")}</span>
                <div>
                  <p>{note.message}</p>
                  <footer>
                    <strong>{note.name.toUpperCase()}</strong>
                    <span>GUEST / {noteDate(note.approvedAt)}</span>
                  </footer>
                </div>
              </article>
            ))}
            <div className="guestbook-empty-slot" aria-hidden="true">
              <span>{String(approvedCount + 1).padStart(3, "0")}</span>
              <p>YOUR SIGNAL COULD LIVE HERE</p>
            </div>
          </div>

          <aside className="guestbook-sign">
            <header>
              <span>02 / SIGN</span>
              <span>REVIEWED BEFORE PUBLISHING</span>
            </header>
            <div className="guestbook-sign-copy">
              <p>LEAVE A SIGNAL</p>
              <h2>Add your name to the wall.</h2>
              <p>Notes are reviewed before they appear publicly. Your email is optional and will never be displayed.</p>
            </div>
            <GuestbookForm />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
