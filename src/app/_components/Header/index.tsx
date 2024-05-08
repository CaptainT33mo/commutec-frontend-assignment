"use client";

import { useStore } from "@/store/zustand";
import { AppRoutes } from "@/utils/appRoutes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PiCaretLeft,
  PiCaretRight,
  PiMagnifyingGlassLight,
  PiShoppingCartSimpleLight,
} from "react-icons/pi";

const LINKS = [
  {
    name: "Categories",
    link: "#",
  },
  {
    name: "Sale",
    link: "#",
  },
  {
    name: "Clearance",
    link: "#",
  },
  {
    name: "New stock",
    link: "#",
  },
  {
    name: "Trending",
    link: "#",
  },
];

export default function Header() {
  const router = useRouter();
  const { removeToken, userDetails } = useStore();
  const logout = () => {
    removeToken();
    router.push(AppRoutes.LOGIN);
  };
  return (
    <header className="sticky top-0 z-50 flex w-full flex-col gap-2 bg-white">
      <div className="flex items-center justify-end gap-4 px-8 py-2">
        <p className="text-xs text-gray-900">Help</p>
        <p className="text-xs text-gray-900">Orders & Returns</p>
        <p className="text-xs text-gray-900">Hi, {userDetails?.name}</p>
        <p className="cursor-pointer text-xs text-gray-900" onClick={logout}>
          Logout
        </p>
      </div>
      <div className="flex items-center justify-between px-8">
        <h1 className="text-3xl font-bold text-black">ECOMMERCE</h1>
        <div className="flex items-center gap-8">
          {LINKS.map((item) => (
            <Link
              href="#"
              key={item.name}
              className="text-base font-semibold text-black"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-8">
          <PiMagnifyingGlassLight size={24} className="cursor-pointer" />
          <PiShoppingCartSimpleLight size={24} className="cursor-pointer" />
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-gray-100 py-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <PiCaretLeft />
          </div>
          <p className="text-sm font-medium text-black">
            Get 10% off on business sign up
          </p>
          <div>
            <PiCaretRight />
          </div>
        </div>
      </div>
    </header>
  );
}
