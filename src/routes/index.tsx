import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import khalidAsset from "@/assets/khalid.png.asset.json";
import logoAsset from "@/assets/mb-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bootcamp Blogging PRO — Media Buying Academy" },
      { name: "description", content: "Construire un blog monétisable avec l'Ad Arbitrage — méthode pratique, 45 jours." },
    ],
  }),
  component: Prelander,
});

const OFFICIAL_URL = "https://mediabuyingacademy.com";

type Lang = "fr" | "ar";

const COPY = {
  fr: {
    dir: "ltr",
    badge: ". FORMATION BLOGGING PRO ·\\n.. 45 JOURS ..",
    title: (
      <>
        Construire un blog <span className="text-[#5BC0FF]">monétisable</span> avec l'<span className="text-[#2EA3FF]">Ad Arbitrage</span>
      </>
    ),
    subtitle:
      "Apprenez à créer un blog, acheter du trafic, analyser les chiffres et optimiser la monétisation avec une méthode pratique orientée business.",
    mini:
      "L'Ad Arbitrage consiste à acheter du trafic vers un blog, puis à optimiser revenus publicitaires, RPM, CTR et coûts pour viser une marge positive.",
    chips: ["Blog de A à Z", "Séances 100% pratiques", "Media Buying appliqué"],
    priceLabel: "Offre limitée :",
    priceNow: "290$",
    priceOld: "700$",
    priceFiller: "au lieu de",
    cta: "Découvrir le programme officiel",
    ctaSub: "Redirection vers la page officielle de Media Buying Academy.",
    switchTo: "AR",
  },
  ar: {
    dir: "rtl",
    badge: "دورة التدوين الاحترافي · 45 يومًا",
    title: (
      <>
        ابنِ مدوّنة <span className="text-[#5BC0FF]">قابلة للربح</span> عبر <span className="text-[#2EA3FF]">المراجحة الإعلانية</span>
      </>
    ),
    subtitle:
      "تعلّم كيف تُنشئ مدوّنة، تشتري الزيارات، تُحلّل الأرقام وتُحسّن التحقيق من الأرباح وفق منهجية عملية موجَّهة نحو الأعمال.",
    mini:
      "تقوم المراجحة الإعلانية على شراء زيارات نحو المدوّنة ثم تحسين الإيرادات الإعلانية ومعدّل الألف ظهور والنقر والتكاليف لاستهداف هامش ربح إيجابي.",
    chips: ["مدوّنة من الألف إلى الياء", "حصص عملية 100%", "شراء الإعلانات تطبيقياً"],
    priceLabel: "عرض محدود:",
    priceNow: "290$",
    priceOld: "700$",
    priceFiller: "بدلاً من",
    cta: "اكتشف البرنامج الرسمي",
    ctaSub: "إعادة توجيه إلى الصفحة الرسمية لـ Media Buying Academy.",
    switchTo: "FR",
  },
} as const;

function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = 56;
    const rows = 26;
    let t = 0;
    let raf = 0;

    const render = () => {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);

      // soft radial glow
      const grad = ctx.createRadialGradient(w * 0.7, h * 0.5, 0, w * 0.5, h * 0.6, Math.max(w, h));
      grad.addColorStop(0, "rgba(46,163,255,0.10)");
      grad.addColorStop(1, "rgba(7,20,38,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const horizon = h * 0.62;
      const spanX = w * 1.4;
      const depth = h * 0.55;

      for (let r = 0; r < rows; r++) {
        const vRaw = r / (rows - 1); // 0 front -> 1 back
        // perspective: more dense to the back
        const v = Math.pow(vRaw, 1.4);
        const z = v; // 0..1
        const y0 = horizon - depth * (1 - z) * 0.05 + depth * z;
        const scaleX = 1 - z * 0.55;
        const rowWidth = spanX * scaleX;
        const leftX = cx - rowWidth / 2;
        for (let c = 0; c < cols; c++) {
          const u = c / (cols - 1);
          const x = leftX + u * rowWidth;
          // wave height
          const phase = t + u * Math.PI * 2.2 + v * 1.6;
          const wave = Math.sin(phase) * (1 - z) * 28 + Math.sin(phase * 1.7 + v * 3) * 10;
          const y = y0 + wave * (0.6 + (1 - z));

          const size = (1 - z) * 2.2 + 0.4;
          const alpha = (1 - z) * 0.85 + 0.05;

          // blue lerp
          const bx = 46 + (91 - 46) * (1 - z);
          const by = 163 + (192 - 163) * (1 - z);
          const bz = 255;

          // halo
          ctx.beginPath();
          ctx.fillStyle = `rgba(${bx|0},${by|0},${bz},${alpha * 0.18})`;
          ctx.arc(x, y, size * 3.2, 0, Math.PI * 2);
          ctx.fill();

          // core
          ctx.beginPath();
          ctx.fillStyle = `rgba(${bx|0},${by|0},${bz},${alpha})`;
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function Prelander() {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    const nav = (navigator.language || "fr").toLowerCase();
    setLang(nav.startsWith("ar") ? "ar" : "fr");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = COPY[lang].dir;
  }, [lang]);

  const c = COPY[lang];
  const isAr = lang === "ar";

  return (
    <div
      dir={c.dir}
      className="relative h-[100svh] w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 75% 40%, #0b1d36 0%, #08111F 45%, #071426 100%)",
      }}
    >
      {/* Particle wave background */}
      <div className="absolute inset-0">
        <ParticleWave />
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      {/* Portrait — desktop right */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[52%] lg:block">
        <div className="relative h-full w-full">
          <img
            src={khalidAsset.url}
            alt="Abderrahim Khalid"
            className="portrait-fade absolute bottom-0 right-0 h-[96%] w-auto object-contain object-bottom"
            style={{
              filter: "drop-shadow(0 30px 60px rgba(46,163,255,0.18))",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_55%,rgba(46,163,255,0.18),transparent_60%)]" />
        </div>
      </div>

      {/* Portrait — mobile background */}
      <div className="pointer-events-none absolute inset-0 block lg:hidden">
        <img
          src={khalidAsset.url}
          alt=""
          className="portrait-fade absolute -right-10 top-6 h-[58%] w-auto object-contain opacity-90"
          style={{ filter: "drop-shadow(0 20px 40px rgba(46,163,255,0.18))" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#071426] via-[#071426]/85 to-transparent" />
      </div>

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6">
        <img src={logoAsset.url} alt="Media Buying Academy" className="h-8 w-auto sm:h-10" />
        <button
          onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
          className="group relative rounded-full border border-[#2EA3FF55] bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-white backdrop-blur-md transition hover:border-[#5BC0FF] hover:bg-[#2EA3FF]/15 sm:text-sm"
        >
          <span className="opacity-60">{lang.toUpperCase()}</span>
          <span className="mx-1.5 opacity-40">/</span>
          <span>{c.switchTo}</span>
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 pt-20 pb-6 sm:px-8 lg:pt-0">
        <div className="lg:max-w-[58%]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2EA3FF55] bg-[#2EA3FF]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5BC0FF] backdrop-blur-md sm:text-xs">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#5BC0FF] shadow-[0_0_10px_#5BC0FF]" />
            {c.badge}
          </div>

          {/* Title */}
          <h1
            className={`glow-text mt-4 font-black leading-[1.05] tracking-tight text-white ${
              isAr
                ? "text-[1.85rem] sm:text-5xl lg:text-[3.7rem]"
                : "text-[1.75rem] sm:text-5xl lg:text-[3.5rem]"
            }`}
          >
            {c.title}
          </h1>

          {/* Subtitle */}
          <p className={`mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-[#AAB7C8] sm:mt-4 sm:text-base ${isAr ? "lg:text-lg" : ""}`}>
            {c.subtitle}
          </p>

          {/* Mini explanation */}
          <p className="mt-2 hidden max-w-2xl border-l-2 border-[#2EA3FF55] pl-3 text-sm leading-relaxed text-[#AAB7C8]/85 sm:block">
            {c.mini}
          </p>

          {/* Chips */}
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
            {c.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#2EA3FF55] bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md sm:text-sm"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* CTA + price */}
          <div className="mt-5 sm:mt-7">
            <a
              href={OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn group cta-pulse relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#2EA3FF] via-[#3DB2FF] to-[#5BC0FF] px-6 py-4 text-base font-bold text-white sm:w-auto sm:px-9 sm:py-5 sm:text-lg"
              style={{ boxShadow: "0 10px 40px -10px rgba(46,163,255,0.6)" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {c.cta}
                <svg
                  className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
              <span className="cta-sheen" />
            </a>

            <div className="mt-3 flex flex-wrap items-baseline gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5BC0FF]">{c.priceLabel}</span>
              <span className="text-2xl font-black text-white sm:text-3xl">{c.priceNow}</span>
              <span className="text-xs text-[#AAB7C8]">{c.priceFiller}</span>
              <span className="text-base text-[#AAB7C8] line-through">{c.priceOld}</span>
            </div>

            <p className="mt-2 text-[11px] text-[#AAB7C8]/70 sm:text-xs">{c.ctaSub}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
