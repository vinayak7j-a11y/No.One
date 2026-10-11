const LAWS = ["Rest", "Attention", "Return", "Non-Ranking", "Relation"];

/**
 * A slow, endless line of the five laws. Decorative only (the laws are
 * written out in full further down), so it is hidden from assistive tech.
 * Under reduced motion the global rule freezes it in place.
 */
export default function LawsMarquee() {
  const track = (
    <div className="marquee-track" aria-hidden="true">
      {LAWS.map((law) => (
        <span key={law} className="marquee-item">
          {law}
          <span className="marquee-dot" />
        </span>
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className="marquee select-none py-10 md:py-16">
      {track}
      {track}
    </div>
  );
}
