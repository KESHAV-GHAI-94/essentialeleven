"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Play, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface ProductGalleryProps {
  images: string[];
  videos?: string[];
}

export function ProductGallery({ images, videos = [] }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allMedia = [...(videos.map(v => ({ type: "video", url: v }))), ...(images.map(img => ({ type: "image", url: img })))];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4 w-full">
      {/* Main Display */}
      <div className="relative w-full aspect-square md:aspect-[4/5] bg-navy-50 rounded-2xl overflow-hidden group">
        <Swiper
          style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' } as any}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="w-full h-full"
        >
          {allMedia.map((media, index) => (
            <SwiperSlide key={index}>
              {media.type === "video" ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    src={media.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="relative w-full h-full cursor-zoom-in"
                  onClick={() => handleOpenLightbox(index)}
                >
                  <Image
                    src={media.url}
                    alt="Product preview"
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleOpenLightbox(0)}
        >
          <Maximize2 className="w-5 h-5 text-navy-900" />
        </Button>
      </div>

      {/* Thumbnails Sidebar */}
      <div className="w-full md:w-24 shrink-0">
        <Swiper
          onSwiper={setThumbsSwiper}
          direction="horizontal"
          breakpoints={{
            768: { direction: "vertical" }
          }}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="h-full w-full"
        >
          {allMedia.map((media, index) => (
            <SwiperSlide key={`thumb-${index}`} className="!w-20 !h-20 md:!w-24 md:!h-24 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent [&.swiper-slide-thumb-active]:border-saffron transition-all">
              {media.type === "video" ? (
                <div className="relative w-full h-full bg-navy-900 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white absolute z-10" />
                  <video src={media.url} className="w-full h-full object-cover opacity-50" />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image src={media.url} alt={`Thumbnail ${index}`} fill className="object-cover" />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-6 right-6 text-white hover:bg-white/20 z-50 rounded-full"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="w-8 h-8" />
          </Button>
          <div className="w-full max-w-5xl aspect-video md:aspect-[4/5] relative">
            <Swiper
              initialSlide={lightboxIndex}
              navigation={true}
              modules={[Navigation]}
              className="w-full h-full"
            >
              {allMedia.map((media, index) => (
                <SwiperSlide key={`lightbox-${index}`}>
                  {media.type === "video" ? (
                    <video src={media.url} controls autoPlay className="w-full h-full object-contain" />
                  ) : (
                    <div className="relative w-full h-full">
                       <Image src={media.url} alt={`Fullscreen ${index}`} fill className="object-contain" />
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}
