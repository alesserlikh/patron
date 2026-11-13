import { PatronProvider } from "./PatronProvider";
import { PatronHeader } from "./PatronHeader";
import { HeroSection } from "./HeroSection";
import { AgencySection } from "./AgencySection";
import { FactsSection } from "./FactsSection";
import { ServicesSection } from "./ServicesSection";
import { CasesSection } from "./CasesSection";
import { ProcessSection } from "./ProcessSection";
import { BriefSection } from "./BriefSection";
import { PatronFooter } from "./PatronFooter";
import { OverlayRoot } from "./OverlayRoot";
import "./tokens.css";
import "./patron.css";
import "./production.css";
import "./visitor.css";

export function PatronPage() {
  return (
    <PatronProvider>
      <link
        rel="preload"
        href="/fonts/GolosText-Variable.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/BBH-Bartle-Regular.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
      <div className="pt" id="patron-page">
        <span id="top" className="snapTop" aria-hidden="true" />
        <PatronHeader />
        <main>
          <HeroSection />
          <AgencySection />
          <FactsSection />
          <ServicesSection />
          <CasesSection />
          <ProcessSection />
          <BriefSection />
        </main>
        <PatronFooter />
      </div>
      <OverlayRoot />
    </PatronProvider>
  );
}
