import { Nunito } from "next/font/google";
import "./globals.css";
import Providers from "@/redux/providers"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const nunito = Nunito({
  subsets: ['latin'],
});


export const metadata = {
  title: "Excellence CBT",
  description: "Your go-to CBT Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
