import { ArrowRight, Check, CircleDot, Clock3, ScanLine, ShieldCheck } from 'lucide-react';
import { landingCopy } from '../copy/landingCopy.js';

const reassuranceIcons = {
  clock: Clock3,
  scan: ScanLine,
  shield: ShieldCheck,
};

function Header() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10 lg:py-7">
      <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
        <p className="font-heading text-[1.04rem] font-semibold tracking-[0.01em] text-midnight">
          {landingCopy.header.brand}
        </p>
        <p className="text-[0.8rem] leading-tight text-graphite/[0.62]">
          {landingCopy.header.descriptor}
        </p>
      </div>
      <p className="rounded-full border border-midnight/[0.12] bg-paper/70 px-3.5 py-1.5 text-[0.74rem] font-semibold text-midnight/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        {landingCopy.header.badge}
      </p>
    </header>
  );
}

function ScanPreviewCard() {
  return (
    <section
      aria-label={landingCopy.preview.ariaLabel}
      className="relative overflow-hidden rounded-[1.7rem] border border-paper/[0.14] bg-paper/[0.08] p-4 shadow-[0_30px_90px_rgba(15,36,55,0.24),inset_0_1px_0_rgba(245,243,238,0.12)] sm:p-5 lg:p-6"
    >
      <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-clay/20 blur-3xl" />
      <div className="absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-olive/[0.24] blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="pt-1">
          <p className="font-heading text-[1.1rem] font-semibold text-paper">{landingCopy.preview.title}</p>
          <p className="mt-1 max-w-[15rem] text-sm leading-6 text-paper/[0.58]">
            {landingCopy.preview.subtitle}
          </p>
        </div>

        <div className="relative grid h-[5rem] w-[5rem] shrink-0 place-items-center rounded-full border border-paper/[0.12] bg-midnight/[0.48] lg:h-[5.5rem] lg:w-[5.5rem]">
          <div className="absolute h-[4rem] w-[4rem] rounded-full border border-olive/[0.38] lg:h-[4.45rem] lg:w-[4.45rem]" />
          <div className="absolute h-[2.65rem] w-[2.65rem] rounded-full border border-clay/[0.42] lg:h-[2.95rem] lg:w-[2.95rem]" />
          <div className="absolute h-[1.35rem] w-[1.35rem] rounded-full bg-paper/8" />
          <span className="absolute left-1/2 top-1/2 h-[2.35rem] w-px origin-bottom -translate-x-1/2 -translate-y-full rotate-[38deg] bg-clay/[0.72]" />
          <span className="absolute left-1/2 top-1/2 h-[1.95rem] w-px origin-bottom -translate-x-1/2 -translate-y-full rotate-[150deg] bg-olive/[0.72]" />
          <CircleDot className="relative h-4 w-4 text-clay" aria-hidden="true" />
        </div>
      </div>

      <div className="relative mt-6 grid gap-2.5">
        {landingCopy.preview.signals.map((signal, index) => (
          <div
            key={signal}
            className="flex min-h-11 items-center gap-3 rounded-2xl border border-paper/10 bg-midnight/[0.36] px-3.5 text-[0.92rem] font-semibold text-paper/[0.84]"
            style={{ animationDelay: `${140 + index * 80}ms` }}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-olive/[0.22] text-olive">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span>{signal}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReassuranceStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {landingCopy.reassuranceItems.map(({ label, iconKey }) => {
        const Icon = reassuranceIcons[iconKey];

        return (
          <div
            key={label}
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-midnight/[0.08] bg-paper/70 px-4 py-3 shadow-[0_14px_40px_rgba(15,36,55,0.06),inset_0_1px_0_rgba(255,255,255,0.72)] sm:flex-col sm:items-start sm:gap-4 sm:px-5 sm:py-5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-midnight/[0.06] text-clay ring-1 ring-midnight/8">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-heading text-[0.95rem] font-semibold leading-tight text-midnight">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function LandingScreen({ onStartScan }) {
  const handleStartScan = () => {
    if (typeof onStartScan === 'function') {
      onStartScan();
      return;
    }

    console.log('Start scan clicked');
  };

  return (
    <main className="web-landing min-h-screen overflow-hidden bg-paper text-graphite antialiased">
      <div className="web-vignette" />
      <div className="web-aura web-aura-olive" />
      <div className="web-aura web-aura-clay" />
      <div className="web-aura web-aura-warm" />

      <Header />

      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-10 pt-7 sm:px-8 sm:pb-14 sm:pt-10 md:min-h-[calc(100vh-5.75rem)] md:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.86fr)] md:gap-10 lg:gap-16 lg:px-10 lg:pb-16 lg:pt-12 xl:gap-20">
        <div className="max-w-3xl motion-safe:animate-settle">
          <p className="mb-5 inline-flex rounded-full border border-midnight/10 bg-paper/[0.72] px-3.5 py-1.5 text-[0.78rem] font-semibold text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
            {landingCopy.hero.badge}
          </p>
          <h1 className="max-w-[46rem] font-heading text-[clamp(2.7rem,7vw,4.6rem)] font-semibold leading-[0.96] tracking-normal text-midnight lg:text-[clamp(4.1rem,6vw,6.1rem)]">
            {landingCopy.hero.headline}
          </h1>
          <p className="mt-6 max-w-[43rem] text-[1.08rem] leading-8 text-graphite/[0.74] sm:text-[1.18rem] sm:leading-8 md:max-w-[36rem]">
            {landingCopy.hero.subheadline}
          </p>
          <p className="mt-5 text-[0.96rem] font-semibold text-graphite/[0.58]">
            {landingCopy.hero.supportLine}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:max-w-[26rem]">
            <button
              type="button"
              onClick={handleStartScan}
              className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-clay px-6 py-4 font-heading text-[1.02rem] font-semibold text-paper shadow-[0_18px_42px_rgba(143,94,61,0.24)] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#D0A587] hover:shadow-[0_24px_54px_rgba(143,94,61,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midnight active:translate-y-0 sm:w-auto"
              aria-label={landingCopy.hero.ctaAriaLabel}
            >
              <span>{landingCopy.hero.cta}</span>
              <ArrowRight className="h-4 w-4 transition duration-300 ease-out group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <p className="text-center text-[0.9rem] leading-5 text-graphite/[0.58] sm:text-left">
              {landingCopy.hero.microcopy}
            </p>
          </div>
        </div>

        <div className="relative motion-safe:animate-settle motion-safe:[animation-delay:120ms] md:justify-self-end">
          <div className="web-scan-halo" />
          <div className="relative rounded-[2rem] bg-midnight p-4 shadow-[0_38px_120px_rgba(15,36,55,0.28),0_12px_34px_rgba(15,36,55,0.12)] ring-1 ring-paper/60 sm:p-5 lg:rounded-[2.35rem] lg:p-6">
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_20%_0%,rgba(245,243,238,0.10),rgba(245,243,238,0)_36%),radial-gradient(circle_at_100%_10%,rgba(200,155,123,0.12),rgba(200,155,123,0)_42%)]" />
            <ScanPreviewCard />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8 sm:pb-12 lg:px-10">
        <div className="border-t border-midnight/10 pt-5 sm:pt-6">
          <ReassuranceStrip />
        </div>
      </section>
    </main>
  );
}
