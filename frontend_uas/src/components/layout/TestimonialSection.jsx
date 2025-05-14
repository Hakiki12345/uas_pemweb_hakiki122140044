import { useState, useEffect } from "react";

const TestimonialSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  });

  const testimonials = [
    {
      id: 1,
      name: "Andi Sutanto",
      location: "Jakarta",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      text: "Kualitas produk sangat bagus dan sesuai dengan ekspektasi. Pengiriman juga cepat. Sangat puas berbelanja di sini!",
    },
    {
      id: 2,
      name: "Rini Wulandari",
      location: "Bandung",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.5,
      text: "Saya sudah berlangganan selama 1 tahun dan belum pernah kecewa. Layanan pelanggan responsif dan ramah.",
    },
    {
      id: 3,
      name: "Budi Pratama",
      location: "Surabaya",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 5,
      text: "Proses pembelian sangat mudah dan cepat. Produk yang datang sesuai dengan gambar. Akan belanja di sini lagi!",
    },
  ];

  return (
    <section className="container mx-auto mt-16 sm:mt-24 px-4">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold relative inline-block">
          Apa Kata Pelanggan Kami
          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-600/30 rounded-full"></span>
        </h2>
        <p className="text-gray-600 mt-3">
          Pengalaman berbelanja dari pelanggan setia kami
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div
          className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 overflow-hidden"
          style={{ minHeight: "360px" }}
        >
          <div className="absolute top-0 left-0 text-8xl text-gray-100 leading-none font-serif -mt-6">
            "
          </div>
          <div className="absolute bottom-0 right-0 text-8xl text-gray-100 leading-none font-serif rotate-180 -mb-12">
            "
          </div>

          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`transition-opacity duration-500 absolute inset-0 p-8 md:p-10 flex flex-col items-center ${
                activeTestimonial === index
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0"
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 sm:mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex text-yellow-400 mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-icons text-sm sm:text-base"
                  >
                    {i < Math.floor(testimonial.rating)
                      ? "star"
                      : i < testimonial.rating
                      ? "star_half"
                      : "star_border"}
                  </span>
                ))}
              </div>

              <p className="text-gray-700 text-base sm:text-lg mb-4 sm:mb-6 text-center italic relative z-10">
                "{testimonial.text}"
              </p>

              <div className="mt-4 text-center">
                <h4 className="font-semibold text-lg text-gray-800">
                  {testimonial.name}
                </h4>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeTestimonial === index
                    ? "bg-blue-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;