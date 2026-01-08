import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BannerItem {
  _id: string;
  title: string;
  image: string;
  isActive?: boolean;
}

const Banner = () => {
  const [activeBanners, setActiveBanners] = useState<BannerItem[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("https://e-commerce-backend-1-m0eh.onrender.com/banner");

        console.log("BANNER API RESPONSE:", res.data.banners);

        setActiveBanners(
          res.data.banners.filter(
            (b: BannerItem) => b.isActive !== false
          )
        );
      } catch (error) {
        console.error("Failed to load banners", error);
      }
    };

    fetchBanners();
  }, []);

  if (activeBanners.length === 0) {
    console.warn("No banners to display");
    return null;
  }

  const getImageUrl = (image: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `https://e-commerce-backend-1-m0eh.onrender.com${image}`;
  };

  return (
    <div style={{ marginTop: "56px" }}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        style={{ height: "60vh", minHeight: "550px" }}
      >
        {activeBanners.map((b) => (
          <SwiperSlide key={b._id}>
            <div
              style={{
                height: "100%",
                backgroundImage: `url(${getImageUrl(b.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
