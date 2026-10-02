"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const phrases = ["Kenali gagasannya.", "Tentukan arah kita.", "Satu suara, satu langkah."];

export function TypewriterPhrase() {
  const reduceMotion = useReducedMotion();
  const [text, setText] = useState(reduceMotion ? phrases[0] : "");

  useEffect(() => {
    if (reduceMotion) return;

    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = phrases[phraseIndex];
      characterIndex += deleting ? -1 : 1;
      setText(phrase.slice(0, characterIndex));

      if (!deleting && characterIndex === phrase.length) {
        deleting = true;
        timeoutId = setTimeout(tick, 1450);
        return;
      }

      if (deleting && characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }

      timeoutId = setTimeout(tick, deleting ? 34 : 62);
    };

    timeoutId = setTimeout(tick, 260);
    return () => clearTimeout(timeoutId);
  }, [reduceMotion]);

  return (
    <p className="forest-typewriter">
      <span aria-hidden="true">{reduceMotion ? phrases[0] : text}<i className="typewriter-caret" /></span>
      <span className="sr-only">Kenali gagasannya, tentukan arah kita, satu suara satu langkah.</span>
    </p>
  );
}
