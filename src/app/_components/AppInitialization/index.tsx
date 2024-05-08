import { useStore } from "@/store/zustand";
import { api } from "@/trpc/react";
import { useEffect, type ReactNode, useState } from "react";
import PageLoader from "../Loaders/PageLoader";

export default function AppInitialization({
  children,
}: {
  children: ReactNode;
}) {
  const { setUserDetails, token } = useStore();
  const [loading, setLoading] = useState<boolean>(true);
  const userProfile = api.user.profile.useQuery(undefined, {
    enabled: !!token,
  });

  useEffect(() => {
    if (token && userProfile?.data?.id) {
      setUserDetails(userProfile?.data);
      setLoading(false);
    }
  }, [userProfile?.data, token, setUserDetails]);

  if (token && (loading || userProfile.isLoading)) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
