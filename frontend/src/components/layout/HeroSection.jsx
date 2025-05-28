import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-xl h-[60vh] sm:h-[70vh] md:h-[80vh] min-h-[500px] flex items-center mt-16 md:mt-20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90">
        <div
          className="absolute inset-0 opacity-10 animate-slow-pulse"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          }}
        ></div>

        <div className="absolute w-40 h-40 bg-white/10 rounded-full top-[20%] left-[10%] blur-sm animate-float"></div>
        <div className="absolute w-60 h-60 bg-white/5 rounded-full bottom-[10%] right-[5%] blur-sm animate-float-slow"></div>
        <div className="absolute w-20 h-20 bg-white/10 rounded-full top-[40%] right-[20%] blur-sm animate-float-reverse"></div>
      </div>

      <div className="relative z-10 px-6 text-center text-white w-full max-w-6xl mx-auto">
        <div className="animate-fadeSlideUp">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Selamat Datang di{" "}
            <span className="text-yellow-300 relative">
              TokoBaju
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-300/70 rounded-full transform -rotate-1"></span>
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed text-white/90">
            Temukan berbagai koleksi pakaian terbaik dengan kualitas premium
            dan harga terjangkau untuk gaya hidup Anda
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 hover:shadow-xl shadow-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Mulai Belanja</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
            </Link>
            <Link
              to="/products"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all transform hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10">Koleksi Terbaru</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 text-white/80">
            <div className="flex items-center text-sm sm:text-base">
              <span className="material-icons text-lg sm:text-xl mr-2">
                verified
              </span>
              <span>100% Original</span>
            </div>
            <div className="flex items-center text-sm sm:text-base">
              <span className="material-icons text-lg sm:text-xl mr-2">
                local_shipping
              </span>
              <span>Gratis Ongkir</span>
            </div>
            <div className="flex items-center text-sm sm:text-base">
              <span className="material-icons text-lg sm:text-xl mr-2">
                verified_user
              </span>
              <span>Garansi 30 Hari</span>
            </div>
            <div className="flex items-center text-sm sm:text-base">
              <span className="material-icons text-lg sm:text-xl mr-2">
                support_agent
              </span>
              <span>Dukungan 24/7</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 left-0 right-0 h-32">
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white z-10"></div>
        <div className="absolute bottom-0 w-full">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-20"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.15,214.86,121.2Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
