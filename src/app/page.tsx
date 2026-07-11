import FlightStrips from "./components/atlas/FlightStrips";
import Footer from "./components/atlas/Footer";
import Hero from "./components/atlas/Hero";
import Logbook from "./components/atlas/Logbook";
import Manifest from "./components/atlas/Manifest";
import { MotionProvider } from "./components/atlas/Motion";
import Plates from "./components/atlas/Plates";
import TopBar from "./components/atlas/TopBar";
import Transmission from "./components/atlas/Transmission";

export default function Home() {
  return (
    <MotionProvider>
      <TopBar />
      <main>
        <Hero />
        <Logbook />
        <FlightStrips />
        <Plates />
        <Manifest />
        <Transmission />
      </main>
      <Footer />
    </MotionProvider>
  );
}
