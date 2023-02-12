import lqip from "lqip-modern";
import fetch from "node-fetch";
const imgUrl =
  "https://images.unsplash.com/photo-1632127258100-f8ae7c6c58c1?crop=entropy&cs=tinysrgb&fm=jpg&ixid=Mnw0MDkyMDB8MHwxfHNlYXJjaHw2fHxjbGFzc2ljJTIwcGFpbnRpbmdzfGVufDB8fHx8MTY3NjE4MzEyMw&ixlib=rb-4.0.3&q=80";

const getDataUrl = async (imgUrl: string) => {
  const imgData = await fetch(imgUrl);
  const arrayBufferData = await imgData.arrayBuffer();
  const lqipData = await lqip(Buffer.from(arrayBufferData));
  return lqipData.metadata.dataURIBase64;
};
getDataUrl(imgUrl).then(console.log);
