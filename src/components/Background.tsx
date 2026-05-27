"use client";

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      {/* deep radial base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #0d1024 0%, #070810 45%, #040509 100%)",
        }}
      />
      {/* aurora blobs */}
      <div
        className="absolute -top-40 left-1/4 h-[42rem] w-[42rem] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.30), transparent 65%)",
          animation: "aurora 14s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[36rem] w-[36rem] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.22), transparent 65%)",
          animation: "aurora 18s ease-in-out infinite 2s",
        }}
      />
      <div
        className="absolute bottom-[-12rem] left-1/3 h-[38rem] w-[38rem] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.16), transparent 65%)",
          animation: "aurora 20s ease-in-out infinite 4s",
        }}
      />
      {/* grid */}
      <div className="absolute inset-0 grid-bg opacity-[0.5] [mask-image:radial-gradient(100%_80%_at_50%_0%,black,transparent)]" />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 120% at 50% 30%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
