import { Painting } from "@/types";
import lqip from "lqip-modern";
import { createApi } from "unsplash-js";

export async function getImages(
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

export const getDataUrl = async (imgUrl: string) => {
  const imgData = await fetch(imgUrl);

  const arrayBufferData = await imgData.arrayBuffer();
  const lqipData = await lqip(Buffer.from(arrayBufferData));

  return lqipData.metadata.dataURIBase64;
};
