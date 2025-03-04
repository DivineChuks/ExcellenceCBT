"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const PrivateAdminRoute = ({children}) => {
  const admin = useSelector((state) => state.admin.user);
  const router = useRouter();

  useEffect(() => {
    if (!admin) {
      router.push("/admin/auth");
    }
  }, [admin]);

  return <div>{children}</div>;
};

export default PrivateAdminRoute;
