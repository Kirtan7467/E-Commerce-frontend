import { useEffect, useState } from 'react';
import axios from 'axios';

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
      const res = await axios.get("http://192.168.0.101:8000/banner");
      console.log("Banner data:", res.data.banners);
      

      // Show all banners (since your API has no active field)
      setActiveBanners(res.data.banners);
    };
    fetchBanners();
  }, []);

  if (activeBanners.length === 0) return null;

  return (
    <div style={{ marginTop: "85px" }}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        style={{ height: "60vh", minHeight: "550px" }}
      >
        {activeBanners.map((b, i) => (
          <SwiperSlide key={i}>
            <div
              style={{
                height: "100%",
                backgroundImage: `url(http://192.168.0.101:8000/uploads/${b.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
