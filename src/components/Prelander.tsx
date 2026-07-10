import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { injectTracking } from "@/lib/tracking";

const DEFAULT_URL = "https://tr.rindep.com/5J5I/2J2D1/";
const TRACKED_PARAMS = ["source", "campaign_id", "adset_id", "ad_id", "placement", "site_source", "fbclid"];

function appendTrackingParams(baseUrl: string): string {
  if (typeof window === "undefined") return baseUrl;
  try {
    const search = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const hashQueryIdx = hash.indexOf("?");
    if (hashQueryIdx !== -1) {
      const hashParams = new URLSearchParams(hash.slice(hashQueryIdx + 1));
      hashParams.forEach((v, k) => {
        if (!search.has(k)) search.set(k, v);
      });
    }
    const url = new URL(baseUrl);
    TRACKED_PARAMS.forEach((k) => {
      const v = search.get(k);
      if (v) url.searchParams.set(k, v);
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
}

type Lang = "fr" | "ar";

const COPY = {
  fr: {
    dir: "ltr",
    badge: "Formation Blogging PRO · 45 jours",
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
        const vRaw = r / (rows - 1);
        const v = Math.pow(vRaw, 1.4);
        const z = v;
        const y0 = horizon - depth * (1 - z) * 0.05 + depth * z;
        const scaleX = 1 - z * 0.55;
        const rowWidth = spanX * scaleX;
        const leftX = cx - rowWidth / 2;
        for (let c = 0; c < cols; c++) {
          const u = c / (cols - 1);
          const x = leftX + u * rowWidth;
          const phase = t + u * Math.PI * 2.2 + v * 1.6;
          const wave = Math.sin(phase) * (1 - z) * 28 + Math.sin(phase * 1.7 + v * 3) * 10;
          const y = y0 + wave * (0.6 + (1 - z));

          const size = (1 - z) * 2.2 + 0.4;
          const alpha = (1 - z) * 0.85 + 0.05;

          const bx = 46 + (91 - 46) * (1 - z);
          const by = 163 + (192 - 163) * (1 - z);
          const bz = 255;

          ctx.beginPath();
          ctx.fillStyle = `rgba(${bx | 0},${by | 0},${bz},${alpha * 0.18})`;
          ctx.arc(x, y, size * 3.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = `rgba(${bx | 0},${by | 0},${bz},${alpha})`;
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

export default function Prelander() {
  const [lang, setLang] = useState<Lang>("fr");
  const [ctaUrl, setCtaUrl] = useState<string>(DEFAULT_URL);

  useEffect(() => {
    const nav = (navigator.language || "fr").toLowerCase();
    setLang(nav.startsWith("ar") ? "ar" : "fr");
  }, []);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("cta_url, meta_pixel_id, ga_id")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        if (data.cta_url) setCtaUrl(data.cta_url);
        injectTracking(data.meta_pixel_id, data.ga_id);
      });
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
      <div className="absolute inset-0">
        <ParticleWave />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      <div className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[52%] lg:block">
        <div className="relative h-full w-full">
          <img
            src="/images/khalid.png"
            alt="Abderrahim Khalid"
            className="portrait-fade absolute bottom-0 right-0 h-[96%] w-auto object-contain object-bottom"
            style={{
              filter: "drop-shadow(0 30px 60px rgba(46,163,255,0.18))",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_55%,rgba(46,163,255,0.18),transparent_60%)]" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 block lg:hidden">
        <img
          src="/images/khalid.png"
          alt=""
          className="portrait-fade absolute left-1/2 top-2 h-[48%] w-auto -translate-x-1/2 object-contain opacity-90"
          style={{ filter: "drop-shadow(0 20px 40px rgba(46,163,255,0.18))" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#071426] via-[#071426]/95 to-transparent" />
      </div>

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-end px-4 pt-4 sm:px-8 sm:pt-6">
        <button
          onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
          className="group relative rounded-full border border-[#2EA3FF55] bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-white backdrop-blur-md transition hover:border-[#5BC0FF] hover:bg-[#2EA3FF]/15 sm:text-sm"
        >
          <span className="opacity-60">{lang.toUpperCase()}</span>
          <span className="mx-1.5 opacity-40">/</span>
          <span>{c.switchTo}</span>
        </button>
      </header>

      <main className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-8 pt-24 text-center sm:px-8 lg:justify-center lg:pb-6 lg:pt-0 lg:text-left">
        <div className="lg:max-w-[58%]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2EA3FF55] bg-[#2EA3FF]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5BC0FF] backdrop-blur-md sm:text-xs">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#5BC0FF] shadow-[0_0_10px_#5BC0FF]" />
            {c.badge}
          </div>

          <h1
            className={`glow-text mt-4 font-black leading-[1.05] tracking-tight text-white ${
              isAr
                ? "text-[1.85rem] sm:text-5xl lg:text-[3.7rem]"
                : "text-[1.75rem] sm:text-5xl lg:text-[3.5rem]"
            }`}
          >
            {c.title}
          </h1>

          <p className={`mx-auto mt-3 max-w-2xl text-[0.95rem] font-bold leading-relaxed text-white sm:mt-4 sm:text-base lg:mx-0 lg:text-lg`}>
            {c.subtitle}
          </p>

          <p className="mt-2 hidden max-w-2xl border-l-2 border-[#2EA3FF55] pl-3 text-sm leading-relaxed text-[#AAB7C8]/85 sm:block">
            {c.mini}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-5 lg:justify-start">
            {c.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#2EA3FF55] bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md sm:text-sm"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-col items-center sm:mt-7 lg:items-center">
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn group cta-pulse lg:cta-pulse-strong relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#2EA3FF] via-[#3DB2FF] to-[#5BC0FF] px-6 py-4 text-base font-bold text-white sm:w-auto sm:px-9 sm:py-5 sm:text-lg lg:px-14 lg:py-7 lg:text-2xl lg:tracking-[0.12em] lg:font-black lg:text-black"
              style={{ boxShadow: "0 10px 40px -10px rgba(46,163,255,0.6)" }}
            >
              <span className="relative z-10 flex items-center gap-2 lg:gap-4">
                {c.cta}
                <svg
                  className={`h-5 w-5 transition-transform group-hover:translate-x-1 lg:h-7 lg:w-7 ${isAr ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
              <span className="cta-sheen" />
            </a>

            <div className="mt-3 flex flex-wrap items-baseline justify-center gap-2">
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
