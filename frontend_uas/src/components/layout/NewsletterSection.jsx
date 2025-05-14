const NewsletterSection = () => {
    return (
      <section className="container mx-auto mt-16 sm:mt-24 px-4">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-blue-100 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-indigo-100 rounded-full -ml-8 sm:-ml-10 -mb-8 sm:-mb-10"></div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full text-white mb-4 sm:mb-6 shadow-lg">
              <span className="material-icons text-xl sm:text-2xl">mail</span>
            </div>
  
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-800">
              Dapatkan Promo Eksklusif
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-8">
              Daftar newsletter kami untuk mendapatkan informasi terbaru dan
              penawaran eksklusif
            </p>
  
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto bg-white p-1.5 sm:p-2 rounded-full shadow-md">
              <input
                type="email"
                placeholder="Alamat email Anda"
                className="flex-grow px-3 sm:px-4 py-2 sm:py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              />
              <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-md transform hover:scale-105 text-sm sm:text-base">
                <span className="flex items-center justify-center">
                  Berlangganan
                  <span className="material-icons ml-2 text-sm sm:text-base">
                    arrow_forward
                  </span>
                </span>
              </button>
            </div>
  
            <div className="flex items-center justify-center mt-6 text-gray-500 text-sm">
              <span className="material-icons text-blue-600 mr-2 text-sm">
                shield
              </span>
              <p>
                Kami tidak akan pernah membagikan email Anda kepada pihak lain.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default NewsletterSection;
