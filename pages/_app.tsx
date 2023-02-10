import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Bellota_Text } from "@next/font/google";

const bellota = Bellota_Text({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--bellota-font",
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${bellota.variable} font-sans h-full`}>
      <Component {...pageProps} />
    </div>
  );
}
