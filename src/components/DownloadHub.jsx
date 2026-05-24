import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FileText,
  LockKeyhole,
} from 'lucide-react';
import { getDownloadAssignment, downloadFilePaths } from '../data/downloadHub.js';
import { paceOptions } from '../data/resultFlow.js';

const downloadCardCopy = [
  {
    ariaLabel: 'Download your personalized Day 0 Field Guide PDF',
    description: 'Your assigned mission, where to do it, and what counts as a win.',
    icon: Compass,
    key: 'fieldGuide',
    title: 'Day 0 Field Guide',
    buttonLabel: 'Download Field Guide',
  },
  {
    ariaLabel: 'Download the Proof Log PDF',
    description: 'Use this after the rep to record what actually happened and collect proof.',
    href: downloadFilePaths.proofLog,
    icon: ClipboardCheck,
    key: 'proofLog',
    title: 'Proof Log',
    buttonLabel: 'Download Proof Log',
  },
  {
    ariaLabel: 'Download the Foundation Guide PDF',
    description:
      'Read this after Day 0 to understand the method behind social re-entry, reps, proof, and rebuilding confidence.',
    href: downloadFilePaths.foundationGuide,
    icon: BookOpen,
    key: 'foundationGuide',
    title: 'Foundation Guide',
    buttonLabel: 'Download Foundation Guide',
  },
];

function getPaceTitle(selectedPace) {
  return paceOptions.find((option) => option.id === selectedPace)?.title;
}

export function MissionSummaryCard({ missionName, resultPattern, selectedPace }) {
  const paceTitle = getPaceTitle(selectedPace);
  const rows = [
    ['Result Pattern', resultPattern],
    ['Mission', missionName],
    ['Starting Pace', paceTitle],
  ].filter(([, value]) => Boolean(value));

  return (
    <section className="relative overflow-hidden rounded-[1.35rem] border border-midnight/[0.08] bg-paper/[0.82] p-5 shadow-[0_20px_70px_rgba(15,36,55,0.08),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(94,122,106,0.12),rgba(94,122,106,0)_32rem),radial-gradient(circle_at_96%_0%,rgba(200,155,123,0.12),rgba(200,155,123,0)_30rem)]" />
      <div className="relative grid gap-5 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:items-start">
        <div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-olive/[0.16] bg-olive/[0.08] text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.64)]">
            <LockKeyhole className="h-5 w-5 stroke-[1.7]" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-heading text-[1.28rem] font-semibold leading-tight text-midnight sm:text-[1.45rem]">
            Your Assigned Mission
          </h2>
          <p className="mt-2 max-w-[22rem] text-[1rem] leading-6 text-graphite/[0.64]">
            Do not make it impressive. Make it completed.
          </p>
        </div>

        <dl className="grid gap-3">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-midnight/[0.07] bg-paper/[0.72] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.66)]"
            >
              <dt className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-olive">
                {label}
              </dt>
              <dd className="mt-1 font-heading text-[1.02rem] font-semibold leading-6 text-midnight">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function DownloadCard({ ariaLabel, buttonLabel, description, href, icon: Icon, title }) {
  return (
    <article className="group relative flex min-h-full flex-col overflow-hidden rounded-[1.35rem] border border-midnight/[0.075] bg-paper/[0.82] p-5 shadow-[0_18px_60px_rgba(15,36,55,0.07),inset_0_1px_0_rgba(255,255,255,0.72)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-olive/[0.22] hover:bg-paper hover:shadow-[0_24px_78px_rgba(15,36,55,0.1),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(200,155,123,0.11),rgba(200,155,123,0)_28rem),linear-gradient(145deg,rgba(94,122,106,0.055),rgba(245,243,238,0)_56%)] opacity-80 transition duration-300 group-hover:opacity-100" />
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-olive/[0.16] bg-olive/[0.08] text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.64)]">
            <Icon className="h-5 w-5 stroke-[1.7]" aria-hidden="true" />
          </div>
          <FileText className="mt-1 h-4 w-4 shrink-0 text-clay/70" aria-hidden="true" />
        </div>

        <h3 className="mt-5 font-heading text-[1.28rem] font-semibold leading-tight text-midnight sm:text-[1.42rem]">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-[1rem] leading-7 text-graphite/[0.66]">{description}</p>

        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={ariaLabel}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-midnight/[0.08] bg-midnight px-4 py-3 font-heading text-[0.96rem] font-semibold text-paper shadow-[0_16px_36px_rgba(15,36,55,0.17)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#17324B] hover:shadow-[0_20px_46px_rgba(15,36,55,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive active:translate-y-0"
        >
          <span>{buttonLabel}</span>
          <ArrowRight className="h-4 w-4 transition duration-300 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function NextStepsBlock() {
  const steps = [
    'Download your Field Guide.',
    'Complete the smallest version of your Day 0 rep.',
    'Open the Proof Log and write what actually happened.',
    'Read the Foundation Guide when you are ready to understand the full method.',
  ];

  return (
    <section className="rounded-[1.35rem] border border-olive/[0.15] bg-olive/[0.075] p-5 shadow-[0_18px_56px_rgba(15,36,55,0.06),inset_0_1px_0_rgba(255,255,255,0.62)] sm:p-6 lg:p-7">
      <h2 className="font-heading text-[1.35rem] font-semibold text-midnight">What to do next</h2>
      <ol className="mt-5 grid gap-3.5">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3.5 text-[1rem] leading-7 text-graphite/[0.7]">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-paper/[0.84] font-heading text-[0.9rem] font-semibold text-olive ring-1 ring-olive/[0.14]">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 font-heading text-[1.08rem] font-semibold text-midnight">
        One rep is proof. The ladder comes next.
      </p>
    </section>
  );
}

export function ProductBridgeBlock() {
  return (
    <section className="relative h-full overflow-hidden rounded-[1.35rem] bg-midnight p-6 text-paper shadow-[0_30px_100px_rgba(15,36,55,0.24),0_10px_30px_rgba(15,36,55,0.12)] ring-1 ring-paper/55 sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(245,243,238,0.1),rgba(245,243,238,0)_35%),radial-gradient(circle_at_92%_12%,rgba(200,155,123,0.15),rgba(200,155,123,0)_42%),radial-gradient(circle_at_50%_100%,rgba(94,122,106,0.14),rgba(94,122,106,0)_48%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <h2 className="font-heading text-[1.55rem] font-semibold leading-[1.12] text-paper sm:text-[1.72rem]">
            Day 0 gives you proof. The 8-week system gives you the ladder.
          </h2>
          <p className="mt-4 text-[1.03rem] leading-8 text-paper/[0.72] sm:text-[1.08rem]">
            Today, you are not trying to fix your whole social life. You are collecting the first
            data point. If this felt useful, the full ReEntera system shows you what to do next for
            the next 8 weeks.
          </p>
        </div>

        <div className="mt-7 flex border-t border-paper/[0.1] pt-5 sm:justify-end">
          <a
            href="#"
            aria-label="See the 8-Week Social Re-Entry System"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-paper/[0.14] bg-paper/[0.08] px-5 py-3 font-heading text-[0.96rem] font-semibold text-paper shadow-[inset_0_1px_0_rgba(245,243,238,0.1)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-paper/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:translate-y-0 sm:w-auto"
          >
            <span>See the 8-Week Social Re-Entry System →</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function DownloadHub({
  assignedMission,
  firstName,
  resultPattern,
  selectedPace,
}) {
  const assignment = getDownloadAssignment(resultPattern);
  const missionName = assignedMission ?? assignment.missionName;
  const displayResultPattern = assignment.resultPattern;
  const cards = downloadCardCopy.map((card) => ({
    ...card,
    href: card.href ?? assignment.fieldGuideHref,
  }));

  return (
    <section className="download-hub-motion relative z-10 w-full pb-12 pt-10 sm:pb-20 sm:pt-12 lg:pb-24">
      <div className="pointer-events-none absolute left-1/2 top-5 -z-10 h-[45rem] w-[min(66rem,96vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_48%_14%,rgba(200,155,123,0.2),rgba(200,155,123,0)_52%),radial-gradient(ellipse_at_16%_48%,rgba(94,122,106,0.16),rgba(94,122,106,0)_50%),radial-gradient(ellipse_at_88%_62%,rgba(15,36,55,0.06),rgba(15,36,55,0)_44%)] blur-2xl" />

      <div className="mx-auto w-full max-w-[60rem] px-4 sm:px-6">
        <div>
          <p className="inline-flex rounded-full border border-olive/[0.18] bg-olive/[0.08] px-3.5 py-1.5 text-[0.77rem] font-bold uppercase tracking-[0.08em] text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            DAY 0 GEAR UNLOCKED
          </p>
          <h1 className="mt-5 max-w-[44rem] font-heading text-[2.45rem] font-semibold leading-[1.02] tracking-normal text-midnight sm:text-[3.35rem] lg:text-[3.7rem]">
            Your Day 0 Gear Is Ready
          </h1>
          <p className="mt-5 max-w-[43rem] text-[1.08rem] leading-8 text-graphite/[0.68] sm:text-[1.18rem]">
            Download the tools, complete your rep, and come back to log what actually happened.
          </p>
          {firstName ? (
            <p className="mt-4 max-w-[40rem] font-heading text-[1.08rem] font-semibold leading-7 text-midnight/[0.82]">
              Nice work, {firstName}. Your first rep is now assigned.
            </p>
          ) : null}
        </div>

        <div className="mt-8 sm:mt-10">
          <MissionSummaryCard
            missionName={missionName}
            resultPattern={displayResultPattern}
            selectedPace={selectedPace}
          />
        </div>

        <div className="mt-10 sm:mt-12">
          <div className="flex items-end justify-between gap-5">
            <div>
              <h2 className="font-heading text-[1.65rem] font-semibold leading-tight text-midnight sm:text-[2rem]">
                Download Your Tools
              </h2>
              <p className="mt-2 max-w-[33rem] text-[1rem] leading-7 text-graphite/[0.62]">
                Keep these open before and after the rep. The order matters less than completion.
              </p>
            </div>
            <CheckCircle2 className="hidden h-7 w-7 shrink-0 text-olive/70 sm:block" aria-hidden="true" />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3 md:gap-5">
            {cards.map((card) => (
              <DownloadCard key={card.key} {...card} />
            ))}
          </div>
        </div>

        <div className="mt-8 grid w-full gap-5 sm:gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-stretch">
          <NextStepsBlock />
          <ProductBridgeBlock />
        </div>

        <p className="mt-8 border-t border-midnight/[0.09] pt-5 text-[0.95rem] font-semibold leading-6 text-graphite/[0.52]">
          Your tools are unlocked. Save this page or use the backup link from your email later.
        </p>
      </div>
    </section>
  );
}
