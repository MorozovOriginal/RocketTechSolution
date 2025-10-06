import { useState, useEffect } from 'react';

interface TypingAnimationProps {
  texts?: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function TypingAnimation({ 
  texts = ["RTS", "Rocket Tech Solution"],
  speed = 150,
  deleteSpeed = 75,
  pauseDuration = 10000,
  className = "" 
}: TypingAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const fullText = texts[currentIndex];

    if (isDeleting) {
      if (currentText.length > 0) {
        // Стираем по одному символу
        timeout = setTimeout(() => {
          setCurrentText(prev => prev.slice(0, -1));
        }, deleteSpeed);
      } else {
        // Полностью стерли, переходим к следующему тексту
        setIsDeleting(false);
        setCurrentIndex(prev => (prev + 1) % texts.length);
      }
    } else {
      if (currentText.length < fullText.length) {
        // Печатаем по одному символу
        timeout = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, speed);
      } else {
        // Напечатали полностью, ждем указанное время, потом стираем
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex, texts, speed, deleteSpeed, pauseDuration]);

  // Мигание курсора
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <span className={`font-mono font-bold ${className}`}>
      {currentText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-[#BBFF2C]`}>|</span>
    </span>
  );
}