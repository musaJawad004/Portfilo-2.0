export default function NotFound() {
  return (
    <main className="nf404-root">
      <div className="nf404-frame">
        <header className="nf404-meta">
          <span>ERROR / 404</span>
          <span>MUHAMMAD MUSA / PORTFOLIO</span>
        </header>

        <section className="nf404-display" aria-labelledby="nf404-title">
          <p id="nf404-title" className="nf404-code" data-text="404" aria-label="404">
            404
          </p>
          <p className="nf404-signal">SIGNAL LOST</p>
        </section>

        <footer className="nf404-footer">
          <p>THE PAGE YOU REQUESTED IS OFFLINE.</p>
          <a href="/">[ RETURN HOME ]</a>
        </footer>
      </div>
    </main>
  )
}
