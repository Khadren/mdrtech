import { Outlet, useLocation } from "react-router-dom";
import Hero from "./Hero";
import Header from "./Header";
import MobileHero from "./MobileHero";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="page">
      <Header />

      {isHome && (
        <div className="heroSection">
          <Hero />
        </div>
      )}

      <main className="content">
        {isHome && <MobileHero />}
        <Outlet />
      </main>
    </div>
  );
}