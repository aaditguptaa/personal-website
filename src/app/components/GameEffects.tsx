"use client";

import { useEffect, useRef, useState } from "react";

interface Toast {
  id: number;
  icon: string;
  title: string;
}

// Fire an achievement toast from anywhere:  window.dispatchEvent(new CustomEvent('achievement', { detail: { icon, title } }))
export default function GameEffects() {
  const [progress, setProgress] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const firedRef = useRef<Set<string>>(new Set());

  const pushToast = (icon: string, title: string, key?: string) => {
    if (key) {
      if (firedRef.current.has(key)) return;
      firedRef.current.add(key);
    }
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, icon, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  // Scroll XP progress bar
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Achievement toasts when sections come into view
  useEffect(() => {
    const labels: Record<string, string> = {
      about: "Profile Decrypted",
      education: "Quest Log Opened",
      projects: "Missions Unlocked",
      skills: "Skill Tree Revealed",
      contact: "Comms Channel Online",
    };
    const icons: Record<string, string> = {
      about: "🧬",
      education: "📜",
      projects: "🎯",
      skills: "🌳",
      contact: "📡",
    };

    const sections = Array.from(document.querySelectorAll("section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id") || "";
          if (entry.isIntersecting && labels[id]) {
            pushToast(icons[id], labels[id], `sec-${id}`);
          }
        });
      },
      { threshold: 0.4 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Listen for externally dispatched achievements
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      pushToast(
        detail.icon || "🏆",
        detail.title || "Achievement Unlocked",
        detail.key,
      );
    };
    window.addEventListener("achievement", handler);
    return () => window.removeEventListener("achievement", handler);
  }, []);

  // Konami code easter egg
  useEffect(() => {
    const code = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === code[pos] ? pos + 1 : key === code[0] ? 1 : 0;
      if (pos === code.length) {
        pos = 0;
        document.body.classList.add("konami-active");
        setTimeout(() => document.body.classList.remove("konami-active"), 1200);
        pushToast("🕹️", "CHEAT CODE: 30 Extra Lives!");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="scroll-xp" style={{ width: `${progress}%` }} />
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <div className="ico">{t.icon}</div>
            <div>
              <div className="k">★ ACHIEVEMENT UNLOCKED</div>
              <div className="v">{t.title}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
