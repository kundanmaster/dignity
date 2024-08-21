// src/app/layout.js
// import { Inter } from "next/font/google";
import "./globals.css";
import "../lib/fontawesome";
import { Gelasio } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import { CartProvider } from "../hooks/cart/cartContext";
import { AuthProvider } from "../hooks/auth/authContext";
import { Toaster, toast } from "sonner";
config.autoAddCss = false;
const Barlow_condensed = Gelasio({ subsets: ["latin"] });
export const metadata = {
  title: "Dignity Medical Training",
  description: "Online Courses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={Barlow_condensed.className}>
        <Toaster />

        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
