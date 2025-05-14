import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const FlashSaleBanner = () => {
  const [countdown, setCountdown] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 8;
              minutes = 42;
              seconds = 15;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden relative shadow-lg">
        <div className="z-10 mb-4 md:mb-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start">
            <span className="material-icons text-2xl sm:text-3xl mr-2 animate-pulse">
              bolt
            </span>
            <h3 className="font-bold text-xl sm:text-2xl">Flash Sale!</h3>
          </div>
          <p className="text-sm mt-1">Berakhir dalam:</p>
        </div>
        <div className="flex z-10 mb-4 md:mb-0 justify-center">
          <div className="countdown-box">
            <div className="bg-white text-red-600 rounded-lg w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center mx-1 font-mono font-bold text-lg sm:text-xl shadow-lg">
              {String(countdown.hours).padStart(2, "0")}
            </div>
            <span className="text-xs mt-1 text-center">JAM</span>
          </div>
          <div className="text-white text-xl font-bold mx-1 self-center">:</div>
          <div className="countdown-box">
            <div className="bg-white text-red-600 rounded-lg w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center mx-1 font-mono font-bold text-lg sm:text-xl shadow-lg">
              {String(countdown.minutes).padStart(2, "0")}
            </div>
            <span className="text-xs mt-1 text-center">MENIT</span>
          </div>
          <div className="text-white text-xl font-bold mx-1 self-center">:</div>
          <div className="countdown-box">
            <div className="bg-white text-red-600 rounded-lg w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center mx-1 font-mono font-bold text-lg sm:text-xl shadow-lg animate-pulse-slow">
              {String(countdown.seconds).padStart(2, "0")}
            </div>
            <span className="text-xs mt-1 text-center">DETIK</span>
          </div>
        </div>
        <Link
          to="/products"
          className="bg-white text-red-600 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-md hover:bg-gray-100 hover:scale-105 transition-all z-10 text-sm sm:text-base"
        >
          <span className="flex items-center">
            Lihat Semua
            <span className="material-icons ml-1 text-sm sm:text-base">
              arrow_forward
            </span>
          </span>
        </Link>
        <div className="absolute -right-16 -top-16 bg-red-500/50 w-40 h-40 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute -left-12 -bottom-12 bg-pink-500/50 w-32 h-32 rounded-full blur-xl animate-spin-slow"></div>
        <div className="absolute right-1/4 top-1/2 bg-white/10 w-4 h-4 rounded-full animate-ping-slow"></div>
        <div className="absolute left-1/3 bottom-1/4 bg-white/10 w-3 h-3 rounded-full animate-ping-slow delay-1000"></div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
