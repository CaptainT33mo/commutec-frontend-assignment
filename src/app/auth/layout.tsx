"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto max-w-xl">{children}</div>;
}
