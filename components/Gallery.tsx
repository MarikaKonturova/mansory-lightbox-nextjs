import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lightgallery.css";
import { LightGallery } from "lightgallery/lightgallery";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import LightGalleryComponent from "lightgallery/react";
import Image from "next/image";
import { useRef } from "react";
import Mansory from "react-masonry-css";
import { Painting } from "@/types";

type GalleryProps = {
  images: Painting[];
};
export function Gallery({ images }: GalleryProps) {
  const lightboxRef = useRef<LightGallery | null>(null);

  return (
    <>
      <Mansory breakpointCols={2} className="flex gap-3" columnClassName="">
        {images.map((img, index) => (
          <div className="relative" key={img.src + img.alt}>
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              className="my-4"
              width={img.width}
              height={img.height}
              placeholder="blur"
              blurDataURL={img.blurDataUrl}
            />
            <div
              className="absolute w-full h-full bg-transparent inset-0  hover:cursor-pointer hover:bg-stone-900 hover:bg-opacity-10"
              onClick={() => {
                lightboxRef.current?.openGallery(index);
              }}
            ></div>
          </div>
        ))}
      </Mansory>
      <LightGalleryComponent
        onInit={(ref) => {
          if (ref) {
            lightboxRef.current = ref.instance;
          }
        }}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        download={false}
        dynamic
        dynamicEl={images.map((img) => ({
          src: img.src,
          thumb: img.src,
        }))}
      />
    </>
  );
}
