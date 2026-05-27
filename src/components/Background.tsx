export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      {/* deep radial base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #0a1022 0%, #05060c 55%, #030308 100%)",
        }}
      />

      {/* drifting aurora blobs */}
      <div className="absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(34,225,255,0.20),transparent_60%)] blur-2xl animate-drift" />
      <div
        className="absolute -right-52 top-1/4 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.22),transparent_60%)] blur-2xl animate-drift"
        style={{ animationDelay: "-8s" }}
      />
      <div
        className="absolute bottom-[-18rem] left-1/3 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(43,245,168,0.16),transparent_60%)] blur-2xl animate-drift"
        style={{ animationDelay: "-16s" }}
      />

      {/* grid */}
      <div className="grid-overlay absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_75%)]" />

      {/* moving scanline */}
      <div className="absolute inset-x-0 top-0 h-px animate-scan bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />

      {/* vignette + grain */}
      <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_50%_50%,transparent_60%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
