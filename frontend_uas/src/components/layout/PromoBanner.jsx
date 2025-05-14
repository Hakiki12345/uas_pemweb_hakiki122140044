import { Link } from "react-router-dom";

const PromoBanner = () => {
  return (
    <section className="container mx-auto mt-16 sm:mt-24 px-4">
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 rounded-xl shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <div className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mb-3 backdrop-blur-sm animate-pulse">
              Penawaran Terbatas
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white">
              Diskon Spesial{" "}
              <span className="relative inline-block">
                30%
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-white rounded-full"></span>
              </span>
            </h2>
            <p className="text-base sm:text-xl mb-6 text-white/90 max-w-xl">
              Khusus untuk pengguna baru! Dapatkan diskon untuk pembelian
              pertama Anda.
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-orange-500 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-md group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center">
                Klaim Sekarang
                <span className="material-icons ml-2 transform group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
            </Link>
          </div>

          <div className="relative">
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl relative animate-float">
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-yellow-300 w-8 h-8 sm:w-12 sm:h-12 rounded-full opacity-70 animate-ping-slow"></div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-orange-600 w-6 h-6 sm:w-8 sm:h-8 rounded-full opacity-70 animate-float-reverse"></div>
              🎁
            </div>
            <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 text-2xl sm:text-4xl animate-float-slow">
              ✨
            </div>
          </div>
        </div>

        {/* Decorative dots/circles */}
        <div className="absolute bottom-0 left-0 right-0 h-24 flex justify-around items-end overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/30 rounded-full mb-2 animate-float-slow"
              style={{
                animationDelay: `${i * 120}ms`,
                height: `${Math.random() * 40 + 10}px`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;