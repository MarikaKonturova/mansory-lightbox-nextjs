import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Tab } from "@headlessui/react";
import Mansory from "react-masonry-css";
import classNames from "classnames";
import bgImg from "@/public/painter-photo.jpg";
import LightGalleryComponent from "lightgallery/react";
import { LightGallery } from "lightgallery/lightgallery";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { createApi } from "unsplash-js";
import lqip from "lqip-modern";
import { GetStaticProps } from "next";

import * as nodeFetch from "node-fetch";

type Painting = {
  src: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  blurDataUrl: string;
};
const tabs = [
  {
    key: "all",
    display: "All",
  },
  {
    key: "classic",
    display: "Classic",
  },
  {
    key: "modern",
    display: "Modern",
  },
];

type HomeProps = {
  classic: Painting[];
  modern: Painting[];
};
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY!,
    fetch: nodeFetch as unknown as typeof fetch,
  });

  const classic = await getImages(unsplash, "classic paintings");
  const modern = await getImages(unsplash, "modern paintings");

  return {
    props: {
      classic,
      modern,
    },
  };
};

export default function Home({ classic, modern }: HomeProps) {
  return (
    /* set overflow-auto because we have bg picture */
    <div className="h-full  text-white overflow-auto">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        key={bgImg.src}
        src={bgImg}
        alt="background-image"
        className="h-full object-cover fixed left-0 top-0 z-0 "
        placeholder="blur"
      />
      <div className=" fixed left-0 top-0 w-full h-full bg-gradient-to-t from-[#040404] z-10"></div>

      <header className="fixed flex justify-between  items-center h-[90px] w-full z-30 px-6 ">
        <div className="invisible">hamburger menu</div>

        <Link
          href={"#"}
          className="rounded-3xl bg-white text-stone-700 px-3 py-2 hover:bg-opacity-90"
        >
          Get in touch
        </Link>
      </header>

      <main className=" relative z-20">
        <div className=" pt-[90px] flex flex-col items-center h-full w-10/12 m-auto">
          <p className="uppercase text-lg font-medium mb-3">
            T.Konturova&rsquo;s Portfolio
          </p>
          <Tab.Group>
            <Tab.List className="flex items-center gap-12 hover:text-base">
              {tabs.map((tab) => (
                <Tab key={tab.key} className="p-2">
                  {({ selected }) => (
                    <span
                      className={classNames(
                        "uppercase text-lg",
                        selected ? "text-white" : "text-stone-600"
                      )}
                    >
                      {tab.display}
                    </span>
                  )}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className=" h-full  max-w-[900px] w-full p-2 my-6 sm:p-4">
              <Tab.Panel>
                <Gallery images={[...classic, ...modern]} />
              </Tab.Panel>
              <Tab.Panel>
                <Gallery images={classic} />
              </Tab.Panel>
              <Tab.Panel>
                <Gallery images={modern} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </main>
      <footer className="relative z-20 h-[60px] flex justify-center items-center text-lg uppercase font-medium">
        <p>T.Konturova&rsquo;s Portfolio</p>
      </footer>
    </div>
  );
}

type GalleryProps = {
  images: Painting[];
};

function Gallery({ images }: GalleryProps) {
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
              className=" my-4 "
              // placeholder="blur"
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

async function getImages(
  cli: ReturnType<typeof createApi>,
  query: string
): Promise<Painting[]> {
  const mappedPaintings: Painting[] = [];

  const paintings = await cli.search.getPhotos({
    query,
  });
  if ((paintings.type = "success")) {
    const paintingArr = paintings.response!.results.map((painting, idx) => ({
      src: painting.urls.full,
      thumb: painting.urls.thumb,
      width: painting.width,
      height: painting.height,
      alt: painting.alt_description ?? `classic-img-${idx}`,
    }));
    const paintingsArrWithDataUrl: Painting[] = [];

    for (const painting of paintingArr) {
      const blurDataUrl = await getDataUrl(painting.src);
      paintingsArrWithDataUrl.push({ ...painting, blurDataUrl });
    }
    mappedPaintings.push(...paintingsArrWithDataUrl);
  } else {
    console.error("Could not get paintings");
  }
  return mappedPaintings;
}

const getDataUrl = async (imgUrl: string) => {
  const imgData = await fetch(imgUrl);

  const arrayBufferData = await imgData.arrayBuffer();
  const lqipData = await lqip(Buffer.from(arrayBufferData));

  return lqipData.metadata.dataURIBase64;
};
