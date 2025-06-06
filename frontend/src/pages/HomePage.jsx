import { useState, useEffect } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import HeroSection from "../components/layout/HeroSection";
import FlashSaleBanner from "../components/layout/FlashSaleBanner";
import CategoryGrid from "../components/layout/CategoryGrid";
import ProductSection from "../components/layout/ProductSection";
import PromoBanner from "../components/layout/PromoBanner";
import FeatureSection from "../components/layout/FeatureSection";
import TestimonialSection from "../components/layout/TestimonialSection";
import NewsletterSection from "../components/layout/NewsletterSection";
import CTASection from "../components/layout/CTASection";
import FooterWave from "../components/ui/FooterWave";
import { productService } from "../services";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);

  const [allProducts, setAllProducts] = useState(null);
  const [allProductsLoading, setAllProductsLoading] = useState(true);
  const [allProductsError, setAllProductsError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setFeaturedLoading(true);
        const data = await productService.getAllProducts({ limit: 4 });
        setFeaturedProducts(data);
      } catch (err) {
        setFeaturedError(err.message || "Failed to fetch featured products");
      } finally {
        setFeaturedLoading(false);
      }
    };
    const fetchAllProducts = async () => {
      try {
        setAllProductsLoading(true);
        const data = await productService.getAllProducts({ per_page: 100 });
        setAllProducts(data);
      } catch (err) {
        setAllProductsError(err.message || "Failed to fetch products");
      } finally {
        setAllProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
    fetchAllProducts();
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  useDocumentTitle("Beranda - TokoBaju");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const popularProducts = allProducts
    ? [...allProducts].sort((a, b) => b.rating.rate - a.rating.rate).slice(2, 6)
    : null;

  const enhanceFeaturedProduct = (product, idx) => ({
    ...product,
    discountPercentage: idx === 0 ? 15 : idx === 2 ? 20 : 0,
    isNew: idx === 1 || idx === 3,
  });

  return (
    <div
      className={`transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <HeroSection />
      <FlashSaleBanner />
      <CategoryGrid />
      {popularProducts && (
        <ProductSection
          title="Paling Populer"
          subtitle="Produk dengan rating tertinggi dari pelanggan kami"
          products={popularProducts}
          loading={allProductsLoading}
          error={allProductsError}
        />
      )}
      <ProductSection
        title="Produk Unggulan"
        subtitle="Koleksi pilihan dari tim kami untuk Anda"
        products={featuredProducts}
        loading={featuredLoading}
        error={featuredError}
        enhanceProduct={enhanceFeaturedProduct}
      />
      <PromoBanner />
      <FeatureSection />
      <TestimonialSection />
      <NewsletterSection />
      <CTASection />
      <FooterWave />
    </div>
  );
};

export default HomePage;
