const FeatureSection = () => {
  const features = [
    {
      id: 1,
      icon: "local_shipping",
      title: "Pengiriman Cepat",
      description:
        "Barang pesanan Anda akan sampai dengan cepat dan aman ke alamat tujuan dalam waktu 1-3 hari kerja.",
      color: "blue",
      animation: "bounce",
    },
    {
      id: 2,
      icon: "payments",
      title: "Harga Terbaik",
      description:
        "Kami menawarkan harga kompetitif untuk semua produk berkualitas tinggi dengan jaminan harga termurah.",
      color: "green",
      animation: "pulse",
    },
    {
      id: 3,
      icon: "swap_horiz",
      title: "Garansi Pengembalian",
      description:
        "Tidak puas? Kembalikan produk dalam 30 hari dan dapatkan pengembalian dana penuh tanpa pertanyaan.",
      color: "purple",
      animation: "spin-slow",
    },
  ];

  return (
    <section className="container mx-auto mt-16 sm:mt-24 px-4">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold relative inline-block">
          Mengapa Memilih Kami?
          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-600/30 rounded-full"></span>
        </h2>
        <p className="text-gray-600 mt-3">
          Kami memberikan pengalaman berbelanja terbaik untuk Anda
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center transform transition-all hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden"
          >
            <div
              className={`absolute right-0 top-0 w-32 h-32 bg-${feature.color}-100/50 rounded-bl-full -mr-10 -mt-10 group-hover:rotate-12 transition-transform duration-700`}
            ></div>
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 bg-${feature.color}-100 rounded-2xl flex items-center justify-center text-${feature.color}-600 text-4xl mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 relative rotate-3 shadow-lg`}
            >
              <span
                className={`material-icons text-3xl sm:text-4xl group-hover:animate-${feature.animation}`}
              >
                {feature.icon}
              </span>
            </div>
            <h3
              className={`text-xl font-semibold mb-3 text-gray-800 group-hover:text-${feature.color}-600 transition-colors`}
            >
              {feature.title}
            </h3>
            <p className="text-gray-600 relative z-10">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
