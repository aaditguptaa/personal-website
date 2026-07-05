"use client";
import About from "./components/About";
import Background from "./components/Background";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Footer from "./components/Footer";
import GameEffects from "./components/GameEffects";
import Header from "./components/Header";
import HomeSection from "./components/Home";
import Projects from "./components/Projects";
import SkillsSection from "./components/SkillsSection";

export default function Home() {
  return (
    <>
      <Background />
      <GameEffects />
      <Header />

      <main>
        <HomeSection />
        <About />
        <Education />
        <Projects />
        <SkillsSection />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
