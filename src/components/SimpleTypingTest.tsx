import { useState, useEffect, useCallback } from 'react';

export default function SimpleTypingTest() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const words = ["RTS", "Rocket Tech Solution"];
  const currentWord = words[currentIndex];

  const type = useCallback(() => {
    if (!isDeleting && text.length < currentWord.length) {
      // Typing
      setText(currentWord.slice(0, text.length + 1));
    } else if (isDeleting && text.length > 0) {
      // Deleting
      setText(text.slice(0, -1));
    } else if (!isDeleting && text.length === currentWord.length) {
      // Finished typing, wait then start deleting
      setTimeout(() => setIsDeleting(true), 3000);
      return;
    } else if (isDeleting && text.length === 0) {
      // Finished deleting, move to next word
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % words.length);
      return;
    }
  }, [text, isDeleting, currentWord, words]);

  useEffect(() => {
    const timeout = setTimeout(type, isDeleting ? 100 : 200);
    return () => clearTimeout(timeout);
  }, [type, isDeleting]);

  return (
    <span className="font-mono text-xl font-bold text-current">
      {text}
      <span className="animate-pulse text-[#BBFF2C]">|</span>
    </span>
  );
}