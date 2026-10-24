// Decorative fixed glow layer. Pure CSS gradients: no images, JS or
// will-change, and it never intercepts pointer events.
const BackgroundGlow = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
  >
    <div className="absolute top-[-260px] left-[-160px] w-[760px] h-[760px] rounded-full bg-[radial-gradient(circle,var(--glow-violet),transparent_65%)]" />
    <div className="absolute top-[-120px] right-[-200px] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,var(--glow-cyan),transparent_65%)]" />
    <div className="absolute top-[520px] left-[38%] w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,var(--glow-pink),transparent_65%)]" />
  </div>
);

export default BackgroundGlow;
