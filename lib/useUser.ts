import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  profile: User
}

export default function useUser() {
  const { data, error } = useSWR<ProfileResponse>(
    typeof window === "undefined" ? null : "/api/users/me"
  );
  const router = useRouter();
  useEffect(() => {
    if (error) {
      router.replace("/create-account");
    }
  }, [error, router]);
  return { user: data?.profile, isLoading: !data && !error };
}
