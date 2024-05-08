import { AppRoutes } from "@/utils/appRoutes";
import { redirect } from "next/navigation";

export default async function Home() {
  return redirect(AppRoutes.DASHBOARD);
}
