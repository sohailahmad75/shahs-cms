import { useEffect, useRef } from "react";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import CheckIcon from "../../../assets/styledIcons/CheckIcon";

const EmailVerifiedSuccess = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const colors = ["#EF2964", "#00C09D", "#2D87B0", "#48485E", "#EFFF1D"];
    const animations = ["slow", "medium", "fast"];

    const createConfetti = () => {
      const confetti = document.createElement("div");
      confetti.className = `absolute top-[-10px] rounded-full animate-confetti-${animations[Math.floor(Math.random() * animations.length)]}`;
      confetti.style.width =
        confetti.style.height = `${Math.floor(Math.random() * 3) + 7}px`;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;

      el.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    };

    const interval = setInterval(createConfetti, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center overflow-hidden">
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="z-10 flex flex-col items-center">
        <div className="relative mb-4 bg-green-500 p-8 rounded-full text-white">
          <CheckIcon size={50} />
        </div>
        <h2 className="text-green-600 font-bold text-3xl mb-2">
          Email Verified!
        </h2>
        <p className="text-gray-600 text-base">
          You can now log in to your account.
        </p>
        <Button
          onClick={() => {
            navigate("/login");
          }}
          className={"mt-4 w-full"}
        >
          Login
        </Button>
      </div>

      <style>{`
        @keyframes checkmark-draw {
          0% { height: 0; width: 0; opacity: 1; }
          20% { height: 0; width: 30px; opacity: 1; }
          40% { height: 60px; width: 30px; opacity: 1; }
          100% { height: 60px; width: 30px; opacity: 1; }
        }
        @keyframes confetti-slow {
          0% { transform: translate3d(0,0,0) rotateX(0) rotateY(0); }
          100% { transform: translate3d(25px, 105vh, 0) rotateX(360deg) rotateY(180deg); }
        }
        @keyframes confetti-medium {
          0% { transform: translate3d(0,0,0) rotateX(0) rotateY(0); }
          100% { transform: translate3d(100px, 105vh, 0) rotateX(100deg) rotateY(360deg); }
        }
        @keyframes confetti-fast {
          0% { transform: translate3d(0,0,0) rotateX(0) rotateY(0); }
          100% { transform: translate3d(-50px, 105vh, 0) rotateX(10deg) rotateY(250deg); }
        }
        .animate-confetti-slow {
          animation: confetti-slow 2.25s linear forwards;
        }
        .animate-confetti-medium {
          animation: confetti-medium 1.75s linear forwards;
        }
        .animate-confetti-fast {
          animation: confetti-fast 1.25s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default EmailVerifiedSuccess;
