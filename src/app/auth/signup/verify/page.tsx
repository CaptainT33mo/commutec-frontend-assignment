"use client";

import OTPVerification from "@/app/_components/pages/Signup/OTPVerification";
import { useStore } from "@/store/zustand";
import { AppRoutes } from "@/utils/appRoutes";
import { redirect } from "next/navigation";

export default function Verify() {
  const { userDetails } = useStore();

  if (!userDetails?.email || !userDetails?.id) {
    redirect(AppRoutes.SIGNUP);
  }
  return (
    <div>
      <OTPVerification email={userDetails?.email} userId={userDetails.id} />
    </div>
  );
}
