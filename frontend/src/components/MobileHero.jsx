import { Link } from "react-router-dom";

export default function MobileHero() {
  return (
    <div className="mobileHero">
      <img className="mobileHeroAvatar" src="/avatar-256.webp" alt="Mathew Ross" />

      <div className="mobileHeroInfo">
        <h1 className="mobileHeroName">Mathew Ross</h1>
        <p className="mobileHeroRole">Systems & Cloud Administrator</p>

<div className="ctaRow mobileHeroCtaRow">
  <Link to="/about" className="btn btnGhost btnSm">
    About Me
  </Link>
  <Link to="/contact" className="btn btnGhost btnSm">
    Contact
  </Link>
</div>
      </div>
    </div>
  );
}