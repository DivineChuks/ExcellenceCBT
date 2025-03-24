import { Nunito } from "next/font/google";
import "./globals.css";
import Providers from "@/redux/providers"

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
        className={`${nunito.className} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
