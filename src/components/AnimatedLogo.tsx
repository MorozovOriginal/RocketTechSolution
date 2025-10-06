import { ChevronRight } from "lucide-react";

interface AnimatedLogoProps {
  onClick: () => void;
  className?: string;
}

export default function AnimatedLogo({ onClick, className = "" }: AnimatedLogoProps) {
  const handleClick = () => {
    // Add a small vibration effect on click if supported
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`animated-logo-container w-8 h-8 bg-[#BBFF2C] rounded-lg flex items-center justify-center hover:bg-[#a3e024] transition-all duration-300 cursor-pointer relative ${className}`}
      title="Return to Home"
      aria-label="Return to Home Page"
    >
      <ChevronRight className="animated-logo-rotate w-5 h-5 text-[#040725]" strokeWidth={2} />
    </button>
  );
}