import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  MapPin,
  MessageCircle,
  Mic2,
  PersonStanding,
  ShieldCheck,
  Target,
  Wind,
  X,
} from 'lucide-react';
import {
  RESULT_CONFIG,
  RESULT_KEYS,
  getBarrierScores,
  getResultPattern,
  hopeCurvePoints,
  insightCards,
  paceOptions,
  shouldShowLostYearsBlock,
} from '../data/resultFlow.js';
import { missionCopy } from '../copy/missionCopy.js';
import { resultsCopy } from '../copy/resultsCopy.js';
import DownloadHub from './DownloadHub.jsx';

const resultStepCount = 3;
const screen4StepCount = 2;
const missionPlaceholderDelay = 250;

const preFlightIcons = {
  posture: PersonStanding,
  visual: Eye,
  vocal: Mic2,
  wind: Wind,
};

const preFlightCards = missionCopy.preFlightCards.map((card) => ({
  ...card,
  Icon: preFlightIcons[card.iconKey],
}));

const missionVariants = Object.fromEntries(
  Object.entries(missionCopy.fieldMissions).map(([resultKey, mission]) => [
    resultKey,
    {
      ...mission,
      missionTitle: RESULT_CONFIG[resultKey].fieldMissionTitle,
    },
  ]),
);

function resetViewportPosition() {
  window.scrollTo(0, 0);

  const appSurface = document.querySelector('main');

  if (appSurface) {
    appSurface.scrollTop = 0;
    appSurface.scrollLeft = 0;
  }
}

function ResultHeader({
  ariaLabel = resultsCopy.resultHeader.resultStepAriaLabel,
  backAriaLabel,
  countLabel,
  onBack,
  stepCount = resultStepCount,
  stepIndex,
}) {
  const progressPercent = ((stepIndex + 1) / stepCount) * 100;
  const visibleLabel = countLabel ?? `${stepIndex + 1} / ${stepCount}`;

  return (
    <header className="sticky top-0 z-20 w-full bg-paper/[0.72] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[60rem] items-center justify-between gap-4 px-5 sm:h-20 sm:px-7">
        <button
          type="button"
          onClick={onBack}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-midnight/[0.1] bg-paper/[0.72] text-midnight shadow-[0_12px_32px_rgba(15,36,55,0.07),inset_0_1px_0_rgba(255,255,255,0.72)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-olive/30 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive active:translate-y-0"
          aria-label={
            backAriaLabel ??
            (stepIndex === 0
              ? resultsCopy.resultHeader.returnToFinalQuestion
              : resultsCopy.resultHeader.previousResultScreen)
          }
        >
          <ArrowLeft className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
        </button>

        <p className="min-w-0 text-center font-heading text-[1.02rem] font-semibold tracking-[0.01em] text-midnight">
          {resultsCopy.resultHeader.brand}
        </p>

        <p
          className="min-w-10 shrink-0 text-right text-[0.86rem] font-semibold tabular-nums text-graphite/60"
          aria-label={`${ariaLabel} ${stepIndex + 1} of ${stepCount}`}
        >
          {visibleLabel}
        </p>
      </div>

      <div className="mx-auto w-full max-w-[60rem] px-5 sm:px-7">
        <div
          className="h-1.5 overflow-hidden rounded-full bg-midnight/[0.08]"
          role="progressbar"
          aria-valuemin="1"
          aria-valuemax={stepCount}
          aria-valuenow={stepIndex + 1}
        >
          <div
            className="h-full rounded-full bg-clay transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}

function ScreenIntro({ eyebrow, title, subtitle, wide = false }) {
  return (
    <div className={wide ? 'mx-auto max-w-[60rem]' : 'mx-auto max-w-[45rem]'}>
      <p className="inline-flex rounded-full border border-olive/[0.18] bg-olive/[0.08] px-3.5 py-1.5 text-[0.77rem] font-bold uppercase tracking-[0.08em] text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        {eyebrow}
      </p>
      <h1 className="mt-5 max-w-[44rem] font-heading text-[2.35rem] font-semibold leading-[1.02] tracking-normal text-midnight sm:text-[3.15rem]">
        {title}
      </h1>
      <p className="mt-4 max-w-[41rem] text-[1.08rem] leading-8 text-graphite/[0.68] sm:text-[1.18rem]">
        {subtitle}
      </p>
    </div>
  );
}

function PrepCard({ card }) {
  const { Icon, goal, mechanic, title } = card;

  return (
    <article className="group relative overflow-hidden rounded-[1.35rem] border border-midnight/[0.075] bg-paper/[0.82] p-5 shadow-[0_18px_56px_rgba(15,36,55,0.07),inset_0_1px_0_rgba(255,255,255,0.74)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-olive/[0.2] hover:bg-paper hover:shadow-[0_24px_70px_rgba(15,36,55,0.09),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_9%_2%,rgba(200,155,123,0.12),rgba(200,155,123,0)_34rem),linear-gradient(135deg,rgba(94,122,106,0.055),rgba(245,243,238,0)_48%)] opacity-80 transition duration-300 group-hover:opacity-100" />
      <div className="relative grid gap-5 sm:grid-cols-[3.35rem_minmax(0,1fr)] sm:gap-6">
        <div className="grid h-[3.35rem] w-[3.35rem] place-items-center rounded-2xl border border-olive/[0.16] bg-olive/[0.075] text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.64)]">
          <Icon className="h-6 w-6 stroke-[1.65]" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <h2 className="font-heading text-[1.28rem] font-semibold leading-[1.15] text-midnight sm:text-[1.52rem]">
            {title}
          </h2>

          <div className="mt-5 grid gap-4 lg:grid-cols-2 lg:gap-6">
            <div>
              <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-olive">
                {missionCopy.preFlight.mechanicLabel}
              </p>
              <p className="mt-1.5 text-[1.02rem] leading-7 text-graphite/[0.72]">{mechanic}</p>
            </div>

            <div>
              <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-clay">
                {missionCopy.preFlight.goalLabel}
              </p>
              <p className="mt-1.5 text-[1.02rem] leading-7 text-graphite/[0.72]">{goal}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function PreFlightRoutineScreen({ onNext }) {
  return (
    <section className="preflight-motion relative z-10 mx-auto w-full max-w-[61rem] px-5 pb-16 pt-10 sm:px-7 sm:pb-24 sm:pt-12">
      <div className="pointer-events-none absolute left-1/2 top-8 -z-10 h-[34rem] w-[min(58rem,92vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_50%_34%,rgba(200,155,123,0.18),rgba(200,155,123,0)_54%),radial-gradient(ellipse_at_24%_56%,rgba(94,122,106,0.16),rgba(94,122,106,0)_50%)] blur-2xl" />

      <div className="mx-auto max-w-[53rem]">
        <p className="inline-flex rounded-full border border-olive/[0.18] bg-olive/[0.08] px-3.5 py-1.5 text-[0.77rem] font-bold uppercase tracking-[0.08em] text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          {missionCopy.preFlight.eyebrow}
        </p>
        <h1 className="mt-5 max-w-[45rem] font-heading text-[2.35rem] font-semibold leading-[1.02] tracking-normal text-midnight sm:text-[3.2rem] lg:text-[3.45rem]">
          {missionCopy.preFlight.title}
        </h1>
        <p className="mt-5 max-w-[47rem] text-[1.08rem] leading-8 text-graphite/[0.68] sm:text-[1.18rem]">
          {missionCopy.preFlight.subtitle}
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:mt-11 sm:gap-5">
        {preFlightCards.map((card) => (
          <PrepCard key={card.title} card={card} />
        ))}
      </div>

      <div className="mt-7 flex justify-end rounded-[1.35rem] border border-midnight/[0.08] bg-midnight px-5 py-5 text-paper shadow-[0_24px_76px_rgba(15,36,55,0.2),inset_0_1px_0_rgba(245,243,238,0.1)] sm:px-6 lg:px-7">
        <button
          type="button"
          onClick={onNext}
          className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-clay px-6 py-4 font-heading text-[0.98rem] font-semibold uppercase tracking-[0.02em] text-paper shadow-[0_18px_42px_rgba(143,94,61,0.24)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#D0A587] hover:shadow-[0_24px_54px_rgba(143,94,61,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:translate-y-0 sm:w-auto"
        >
          <span>{missionCopy.preFlight.cta}</span>
          <ArrowRight className="h-4 w-4 transition duration-300 ease-out group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function getMissionVariant(result) {
  return missionVariants[result?.id] ?? missionVariants[RESULT_KEYS.bodyReaction];
}

function TacticalBriefing({ mission }) {
  return (
    <section className="relative overflow-hidden rounded-[1.35rem] border border-olive/[0.18] bg-olive/[0.075] p-5 shadow-[0_18px_58px_rgba(15,36,55,0.06),inset_0_1px_0_rgba(255,255,255,0.68)] sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(245,243,238,0.78),rgba(245,243,238,0)_32rem)]" />
      <div className="relative grid gap-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-olive/[0.18] bg-paper/[0.78] text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <ShieldCheck className="h-5 w-5 stroke-[1.7]" aria-hidden="true" />
        </div>
        <div className="max-w-[47rem] space-y-4 text-[1.04rem] leading-7 text-graphite/[0.74] sm:text-[1.08rem] sm:leading-8">
          <p>
            <span className="font-bold text-midnight">{missionCopy.missionSections.tacticalTruthLabel}</span>{' '}
            {mission.briefing[0].replace(`${missionCopy.missionSections.tacticalTruthLabel} `, '')}
          </p>
          <p>{mission.briefing[1]}</p>
        </div>
      </div>
    </section>
  );
}

function MissionSection({ children, Icon, title }) {
  return (
    <section className="border-t border-paper/[0.12] pt-6 first:border-t-0 first:pt-0">
      <div className="grid gap-4 sm:grid-cols-[2.65rem_minmax(0,1fr)] sm:gap-5">
        <div className="grid h-[2.65rem] w-[2.65rem] place-items-center rounded-xl border border-paper/[0.13] bg-paper/[0.07] text-clay shadow-[inset_0_1px_0_rgba(245,243,238,0.08)]">
          <Icon className="h-5 w-5 stroke-[1.7]" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="font-heading text-[1.18rem] font-semibold leading-tight text-paper sm:text-[1.32rem]">
            {title}
          </h2>
          <div className="mt-3 space-y-4 text-[1.03rem] leading-7 text-paper/[0.74] sm:text-[1.07rem] sm:leading-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionCard({ mission }) {
  return (
    <section className="relative overflow-hidden rounded-[1.55rem] bg-midnight p-5 text-paper shadow-[0_34px_110px_rgba(15,36,55,0.26),0_12px_34px_rgba(15,36,55,0.12)] ring-1 ring-paper/60 sm:p-6 lg:rounded-[2rem] lg:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 rounded-[inherit] bg-[radial-gradient(circle_at_13%_4%,rgba(245,243,238,0.11),rgba(245,243,238,0)_38%),radial-gradient(circle_at_91%_4%,rgba(200,155,123,0.15),rgba(200,155,123,0)_45%)]" />
      <div className="relative space-y-7">
        <MissionSection Icon={Target} title={missionCopy.missionSections.missionOfDay}>
          {mission.missionOfDay.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MissionSection>

        <MissionSection Icon={MapPin} title={missionCopy.missionSections.bestPlace}>
          <ul className="space-y-2.5">
            {mission.bestPlaces.map((place) => (
              <li key={place} className="flex gap-3">
                <span className="mt-[0.42rem] text-clay" aria-hidden="true">
                  •
                </span>
                <span>{place}</span>
              </li>
            ))}
          </ul>
          <p>{mission.bestPlaceNote}</p>
        </MissionSection>

        <MissionSection Icon={MessageCircle} title={missionCopy.missionSections.scenario}>
          {mission.scenario.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MissionSection>

        <MissionSection Icon={ShieldCheck} title={missionCopy.missionSections.proofRule}>
          {mission.proofRule.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MissionSection>
      </div>
    </section>
  );
}

function BridgeSection({ mission }) {
  return (
    <section className="relative overflow-hidden rounded-[1.35rem] border border-midnight/[0.08] bg-paper/[0.78] p-5 shadow-[0_20px_62px_rgba(15,36,55,0.07),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_0%,rgba(200,155,123,0.12),rgba(200,155,123,0)_34rem)]" />
      <div className="relative max-w-[50rem] space-y-4">
        <p className="text-[1.06rem] leading-8 text-graphite/[0.72]">{mission.bridgeLead}</p>
        <blockquote className="rounded-[1.05rem] border border-olive/[0.15] bg-olive/[0.065] px-4 py-4 text-[1.04rem] font-semibold leading-7 text-midnight shadow-[inset_0_1px_0_rgba(255,255,255,0.56)] sm:px-5">
          {mission.bridgeQuote}
        </blockquote>
      </div>
    </section>
  );
}

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

function SuccessModalState({ onContinue }) {
  return (
    <div className="relative">
      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-olive/[0.16] bg-olive/[0.08] text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.62)]">
        <CheckCircle2 className="h-5 w-5 stroke-[1.7]" aria-hidden="true" />
      </div>
      <h2
        id="gear-unlock-title"
        className="mt-5 max-w-[23rem] font-heading text-[1.75rem] font-semibold leading-tight text-midnight sm:text-[2rem]"
      >
        {missionCopy.emailCapture.successTitle}
      </h2>
      <p className="mt-3 max-w-[24rem] text-[1.02rem] leading-7 text-graphite/[0.66]">
        {missionCopy.emailCapture.successBody}
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="mt-6 flex min-h-14 w-full items-center justify-center rounded-2xl bg-clay px-6 py-4 font-heading text-[1.02rem] font-semibold text-paper shadow-[0_18px_42px_rgba(143,94,61,0.22)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#D0A587] hover:shadow-[0_24px_54px_rgba(143,94,61,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midnight active:translate-y-0"
      >
        {missionCopy.emailCapture.successCta}
      </button>
    </div>
  );
}

function EmailCaptureModal({
  email,
  errors,
  firstName,
  isOpen,
  modalSuccess,
  onClose,
  onContinue,
  onEmailChange,
  onFirstNameChange,
  onSubmit,
}) {
  const firstNameRef = useRef(null);

  useEffect(() => {
    if (!isOpen || modalSuccess) {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => {
      firstNameRef.current?.focus();
    }, 80);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, modalSuccess, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="email-modal-overlay fixed inset-0 z-50 flex min-h-screen items-start justify-center overflow-y-auto bg-midnight/[0.46] px-4 py-4 backdrop-blur-[5px] sm:items-center sm:py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="gear-unlock-title"
        aria-modal="true"
        className="email-modal-panel relative max-h-[calc(100vh-2rem)] w-full max-w-[31rem] overflow-y-auto rounded-[1.45rem] border border-paper/[0.58] bg-paper p-5 text-midnight shadow-[0_34px_110px_rgba(5,15,24,0.28),inset_0_1px_0_rgba(255,255,255,0.78)] sm:max-h-[calc(100vh-3rem)] sm:p-6"
        role="dialog"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(200,155,123,0.16),rgba(200,155,123,0)_32rem),radial-gradient(circle_at_90%_8%,rgba(94,122,106,0.12),rgba(94,122,106,0)_28rem)]" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-midnight/[0.09] bg-paper/[0.76] text-midnight shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-olive/25 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive active:translate-y-0"
          aria-label={missionCopy.emailCapture.closeAriaLabel}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {modalSuccess ? (
          <SuccessModalState onContinue={onContinue} />
        ) : (
          <form className="relative" noValidate onSubmit={onSubmit}>
            <div className="pr-11">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-olive/[0.16] bg-olive/[0.08] text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.62)]">
                <ShieldCheck className="h-5 w-5 stroke-[1.7]" aria-hidden="true" />
              </div>
              <h2
                id="gear-unlock-title"
                className="mt-5 max-w-[23rem] font-heading text-[1.75rem] font-semibold leading-tight text-midnight sm:text-[2rem]"
              >
                {missionCopy.emailCapture.title}
              </h2>
              <p className="mt-3 max-w-[23rem] text-[1.03rem] font-semibold leading-7 text-midnight/[0.76]">
                {missionCopy.emailCapture.lead}
              </p>
              <p className="mt-3 max-w-[24rem] text-[1rem] leading-7 text-graphite/[0.66]">
                {missionCopy.emailCapture.body}
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <label htmlFor="day-0-first-name" className="text-[0.82rem] font-bold uppercase tracking-[0.08em] text-olive">
                  {missionCopy.emailCapture.firstNameLabel}
                </label>
                <input
                  ref={firstNameRef}
                  id="day-0-first-name"
                  type="text"
                  value={firstName}
                  onChange={(event) => onFirstNameChange(event.target.value)}
                  placeholder={missionCopy.emailCapture.firstNamePlaceholder}
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={errors.firstName ? 'day-0-first-name-error' : undefined}
                  className="mt-2 h-14 w-full rounded-2xl border border-midnight/[0.1] bg-paper/[0.78] px-4 text-[1.06rem] font-semibold text-midnight shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition duration-200 ease-out placeholder:text-graphite/35 focus:border-olive/45 focus:outline-none focus:ring-4 focus:ring-olive/[0.12]"
                />
                {errors.firstName ? (
                  <p id="day-0-first-name-error" className="mt-2 text-[0.92rem] font-semibold text-[#9B4A3A]">
                    {errors.firstName}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="day-0-email" className="text-[0.82rem] font-bold uppercase tracking-[0.08em] text-olive">
                  {missionCopy.emailCapture.emailLabel}
                </label>
                <input
                  id="day-0-email"
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder={missionCopy.emailCapture.emailPlaceholder}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'day-0-email-error' : undefined}
                  className="mt-2 h-14 w-full rounded-2xl border border-midnight/[0.1] bg-paper/[0.78] px-4 text-[1.06rem] font-semibold text-midnight shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition duration-200 ease-out placeholder:text-graphite/35 focus:border-olive/45 focus:outline-none focus:ring-4 focus:ring-olive/[0.12]"
                />
                {errors.email ? (
                  <p id="day-0-email-error" className="mt-2 text-[0.92rem] font-semibold text-[#9B4A3A]">
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-clay px-6 py-4 font-heading text-[1.02rem] font-semibold text-paper shadow-[0_18px_42px_rgba(143,94,61,0.22)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#D0A587] hover:shadow-[0_24px_54px_rgba(143,94,61,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midnight active:translate-y-0"
            >
              <span>{missionCopy.emailCapture.submit}</span>
            </button>
            <p className="mt-3 text-center text-[0.92rem] font-semibold text-graphite/[0.58]">
              {missionCopy.emailCapture.reassurance}
            </p>
            <p className="mx-auto mt-2 max-w-[22rem] text-center text-[0.84rem] leading-5 text-graphite/[0.48]">
              {missionCopy.emailCapture.privacy}
            </p>
          </form>
        )}
      </section>
    </div>
  );
}

function MissionScreen({ onDownloadReady, result }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const mission = getMissionVariant(result);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const validateGearForm = () => {
    const nextErrors = {};

    if (!firstName.trim()) {
      nextErrors.firstName = missionCopy.emailCapture.firstNameRequired;
    }

    if (!email.trim()) {
      nextErrors.email = missionCopy.emailCapture.emailRequired;
    } else if (!isValidEmail(email)) {
      nextErrors.email = missionCopy.emailCapture.emailInvalid;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleGearSubmit = (event) => {
    event.preventDefault();

    if (!validateGearForm()) {
      return;
    }

    const contact = {
      email: email.trim(),
      firstName: firstName.trim(),
    };

    if (import.meta.env.DEV) {
      console.info('Day 0 gear unlock:', contact);
    }

    onDownloadReady(contact);
    setModalSuccess(true);
  };

  const handleContinueToDownload = () => {
    setModalOpen(false);
    setModalSuccess(false);
    onDownloadReady({
      email: email.trim(),
      firstName: firstName.trim(),
      shouldShowDownloadPage: true,
    });
  };

  return (
    <section className="mission-motion relative z-10 mx-auto w-full max-w-[61rem] px-5 pb-16 pt-10 sm:px-7 sm:pb-24 sm:pt-12">
      <div className="pointer-events-none absolute left-1/2 top-6 -z-10 h-[42rem] w-[min(62rem,94vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_50%_18%,rgba(200,155,123,0.18),rgba(200,155,123,0)_52%),radial-gradient(ellipse_at_18%_52%,rgba(94,122,106,0.16),rgba(94,122,106,0)_48%)] blur-2xl" />

      <div className="mx-auto max-w-[53rem]">
        <p className="inline-flex rounded-full border border-olive/[0.18] bg-olive/[0.08] px-3.5 py-1.5 text-[0.77rem] font-bold uppercase tracking-[0.08em] text-olive shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          {mission.badge}
        </p>
        <p className="mt-5 font-heading text-[1.08rem] font-semibold leading-6 text-clay sm:text-[1.18rem]">
          {mission.missionTitle}
        </p>
        <h1 className="mt-3 max-w-[48rem] font-heading text-[2.25rem] font-semibold leading-[1.02] tracking-normal text-midnight sm:text-[3.05rem] lg:text-[3.35rem]">
          {mission.heading}
        </h1>
      </div>

      <div className="mt-9 grid gap-5 sm:mt-11 sm:gap-6">
        <TacticalBriefing mission={mission} />
        <MissionCard mission={mission} />
        <BridgeSection mission={mission} />
      </div>

      <div className="mx-auto mt-8 flex max-w-[42rem] flex-col items-center text-center">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-clay px-6 py-4 font-heading text-[0.98rem] font-semibold uppercase tracking-[0.02em] text-paper shadow-[0_18px_42px_rgba(143,94,61,0.22)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#D0A587] hover:shadow-[0_24px_54px_rgba(143,94,61,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midnight active:translate-y-0 sm:w-auto sm:px-8"
        >
          <span>{missionCopy.missionCta.accept}</span>
        </button>
        <p className="mt-3 text-[0.94rem] font-semibold text-graphite/[0.55]">
          {missionCopy.missionCta.microcopy}
        </p>
      </div>

      <EmailCaptureModal
        email={email}
        errors={errors}
        firstName={firstName}
        isOpen={modalOpen}
        modalSuccess={modalSuccess}
        onClose={closeModal}
        onContinue={handleContinueToDownload}
        onEmailChange={(value) => {
          setEmail(value);
          setErrors((currentErrors) => ({ ...currentErrors, email: undefined }));
        }}
        onFirstNameChange={(value) => {
          setFirstName(value);
          setErrors((currentErrors) => ({ ...currentErrors, firstName: undefined }));
        }}
        onSubmit={handleGearSubmit}
      />
    </section>
  );
}

function getRadarPoint(index, value, count, radius, center) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count;
  const scaledRadius = (value / 5) * radius;

  return {
    x: center + Math.cos(angle) * scaledRadius,
    y: center + Math.sin(angle) * scaledRadius,
  };
}

function ResultRadarCard({ barrierScores }) {
  const { resultProfile } = resultsCopy;
  const center = 126;
  const radius = 88;
  const points = barrierScores.map(({ score }, index) =>
    getRadarPoint(index, score, barrierScores.length, radius, center),
  );
  const polygonPoints = points.map(({ x, y }) => `${x},${y}`).join(' ');
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="rounded-[1.25rem] border border-paper/[0.12] bg-paper/[0.055] p-4 shadow-[inset_0_1px_0_rgba(245,243,238,0.08)] sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-[1rem] font-semibold text-paper">
          {resultProfile.radarTitle}
        </h2>
        <span className="rounded-full border border-paper/[0.12] px-2.5 py-1 text-[0.72rem] font-semibold text-paper/[0.58]">
          {resultProfile.radarBadge}
        </span>
      </div>

      <div className="result-radar-fade mt-5 grid gap-5 lg:grid-cols-[minmax(15rem,0.9fr)_minmax(11rem,0.8fr)] lg:items-center">
        <svg
          className="mx-auto h-auto w-full max-w-[19rem]"
          viewBox="0 0 252 252"
          role="img"
          aria-label={resultProfile.radarAriaLabel}
        >
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C89B7B" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#5E7A6A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={center} cy={center} r={radius + 12} fill="url(#radarGlow)" />
          {gridLevels.map((level) => {
            const gridPoints = barrierScores
              .map((_, index) =>
                getRadarPoint(index, level * 5, barrierScores.length, radius, center),
              )
              .map(({ x, y }) => `${x},${y}`)
              .join(' ');

            return (
              <polygon
                key={level}
                points={gridPoints}
                fill="none"
                stroke="rgba(245,243,238,0.15)"
                strokeWidth="1"
              />
            );
          })}
          {barrierScores.map((score, index) => {
            const endPoint = getRadarPoint(index, 5, barrierScores.length, radius, center);
            const labelPoint = getRadarPoint(index, 5.72, barrierScores.length, radius, center);

            return (
              <g key={score.key}>
                <line
                  x1={center}
                  y1={center}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke="rgba(245,243,238,0.13)"
                  strokeWidth="1"
                />
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(245,243,238,0.66)"
                  fontSize="10"
                  fontWeight="600"
                >
                  {score.shortLabel}
                </text>
              </g>
            );
          })}
          <polygon
            points={polygonPoints}
            fill="rgba(200,155,123,0.22)"
            stroke="#C89B7B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {points.map((point, index) => (
            <circle
              key={barrierScores[index].key}
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="#F5F3EE"
              stroke="#C89B7B"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        <dl className="grid gap-2.5">
          {barrierScores.map(({ key, label, score }) => (
            <div
              key={key}
              className="grid gap-1.5 rounded-2xl border border-paper/[0.1] bg-midnight/[0.24] px-3.5 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[0.82rem] font-semibold leading-4 text-paper/[0.78]">{label}</dt>
                <dd className="font-heading text-[0.9rem] font-semibold tabular-nums text-clay">
                  {score.toFixed(1)}
                </dd>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-paper/[0.1]">
                <div
                  className="h-full rounded-full bg-olive"
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function SocialSignalVisual() {
  return (
    <div className="relative min-h-[17rem] overflow-hidden rounded-[1.25rem] border border-paper/[0.12] bg-[radial-gradient(circle_at_42%_36%,rgba(200,155,123,0.18),rgba(200,155,123,0)_34%),radial-gradient(circle_at_68%_65%,rgba(94,122,106,0.18),rgba(94,122,106,0)_38%),rgba(245,243,238,0.055)] shadow-[inset_0_1px_0_rgba(245,243,238,0.08)]">
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/[0.11]" />
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-olive/[0.28]" />
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-clay/[0.32]" />
      <div className="absolute left-[20%] top-[28%] h-2 w-2 rounded-full bg-clay/80 shadow-[0_0_32px_rgba(200,155,123,0.5)]" />
      <div className="absolute right-[24%] top-[31%] h-1.5 w-1.5 rounded-full bg-paper/70" />
      <div className="absolute bottom-[28%] left-[31%] h-1.5 w-1.5 rounded-full bg-olive/80 shadow-[0_0_28px_rgba(94,122,106,0.5)]" />
      <svg
        className="absolute inset-x-8 top-1/2 h-20 -translate-y-1/2 text-clay/[0.85]"
        viewBox="0 0 260 82"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 44 C28 44 30 44 48 44 C58 44 62 22 70 22 C80 22 83 62 96 62 C108 62 111 44 124 44 C142 44 144 44 160 44 C176 44 179 31 188 31 C199 31 202 52 214 52 C226 52 228 44 258 44"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.78"
        />
      </svg>
      <div className="absolute inset-x-8 bottom-7 h-px bg-gradient-to-r from-transparent via-paper/24 to-transparent" />
    </div>
  );
}

function InsightCard({ text, title }) {
  return (
    <article className="rounded-2xl border border-midnight/[0.08] bg-paper/[0.72] p-4 shadow-[0_14px_42px_rgba(15,36,55,0.06),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-5">
      <h3 className="font-heading text-[1rem] font-semibold text-midnight">{title}</h3>
      <p className="mt-2 text-[0.98rem] leading-6 text-graphite/[0.64]">{text}</p>
    </article>
  );
}

function ResultProfileScreen({ barrierScores, hasLostYearsBlock, onNext, result }) {
  const { resultProfile } = resultsCopy;

  return (
    <section className="result-flow-motion relative z-10 mx-auto w-full max-w-[60rem] px-5 pb-14 pt-10 sm:px-7 sm:pb-20 sm:pt-12">
      <ScreenIntro
        eyebrow={resultProfile.eyebrow}
        title={resultProfile.title}
        subtitle={resultProfile.subtitle}
        wide
      />

      <div className="relative mt-8 overflow-hidden rounded-[1.55rem] bg-midnight p-4 text-paper shadow-[0_34px_110px_rgba(15,36,55,0.26),0_12px_34px_rgba(15,36,55,0.12)] ring-1 ring-paper/60 sm:mt-10 sm:p-5 lg:rounded-[2rem] lg:p-6">
        <div className="pointer-events-none absolute inset-x-0 h-72 max-w-[60rem] rounded-[inherit] bg-[radial-gradient(circle_at_16%_0%,rgba(245,243,238,0.12),rgba(245,243,238,0)_38%),radial-gradient(circle_at_95%_8%,rgba(200,155,123,0.16),rgba(200,155,123,0)_44%)]" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.09em] text-paper/[0.54]">
                {resultProfile.startingPatternLabel}
              </p>
              <h2 className="mt-3 max-w-[36rem] font-heading text-[2rem] font-semibold leading-[1.05] text-paper sm:text-[2.65rem]">
                {result.name}
              </h2>
            </div>
            <span className="rounded-full border border-clay/35 bg-clay/[0.16] px-3.5 py-1.5 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-paper">
              {result.badge}
            </span>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(17rem,0.7fr)]">
            <ResultRadarCard barrierScores={barrierScores} />
            <SocialSignalVisual />
          </div>

          <p className="mt-7 max-w-[51rem] text-[1.06rem] leading-8 text-paper/[0.72]">
            {result.explanation}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {insightCards.map((card) => (
          <InsightCard key={card.title} {...card} />
        ))}
      </div>

      {hasLostYearsBlock ? (
        <div className="mt-6 rounded-[1.35rem] border border-clay/[0.18] bg-clay/[0.1] p-5 shadow-[0_18px_54px_rgba(15,36,55,0.07),inset_0_1px_0_rgba(255,255,255,0.62)] sm:p-6">
          <h2 className="font-heading text-[1.25rem] font-semibold text-midnight">
            {resultProfile.lostYears.title}
          </h2>
          <div className="mt-3 max-w-[48rem] space-y-4 text-[1.03rem] leading-7 text-graphite/[0.68]">
            {resultProfile.lostYears.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 rounded-[1.35rem] border border-olive/[0.16] bg-paper/[0.78] p-5 shadow-[0_20px_62px_rgba(15,36,55,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
        <p className="max-w-[36rem] font-heading text-[1.2rem] font-semibold leading-7 text-midnight">
          {resultProfile.noteLead}
          <span className="mt-1 block text-[1rem] font-medium text-graphite/[0.62]">
            {resultProfile.noteSupport}
          </span>
        </p>
        <button
          type="button"
          onClick={onNext}
          className="group mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-clay px-6 py-4 font-heading text-[1.02rem] font-semibold text-paper shadow-[0_18px_42px_rgba(143,94,61,0.22)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#D0A587] hover:shadow-[0_24px_54px_rgba(143,94,61,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midnight active:translate-y-0 sm:mt-0 sm:w-auto"
        >
          <span>{resultProfile.cta}</span>
          <ArrowRight className="h-4 w-4 transition duration-300 ease-out group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function HopeCurve() {
  return (
    <div className="relative overflow-hidden rounded-[1.55rem] border border-midnight/[0.08] bg-paper/[0.78] p-5 shadow-[0_24px_78px_rgba(15,36,55,0.09),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(200,155,123,0.16),rgba(200,155,123,0)_34%),radial-gradient(circle_at_82%_18%,rgba(94,122,106,0.14),rgba(94,122,106,0)_36%)]" />
      <div className="relative">
        <svg className="h-44 w-full sm:h-56" viewBox="0 0 720 250" fill="none" aria-hidden="true">
          <path
            d="M72 190 C198 188 235 136 336 132 C442 128 492 82 648 60"
            stroke="#C89B7B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M72 190 C198 188 235 136 336 132 C442 128 492 82 648 60 L648 220 L72 220 Z"
            fill="url(#hopeFill)"
          />
          <defs>
            <linearGradient id="hopeFill" x1="360" y1="60" x2="360" y2="220">
              <stop stopColor="#5E7A6A" stopOpacity="0.18" />
              <stop offset="1" stopColor="#C89B7B" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[
            { x: 72, y: 190, color: '#C89B7B' },
            { x: 258, y: 146, color: '#5E7A6A' },
            { x: 444, y: 112, color: '#5E7A6A' },
            { x: 648, y: 60, color: '#5E7A6A' },
          ].map((point, index) => (
            <g key={hopeCurvePoints[index].label}>
              <circle cx={point.x} cy={point.y} r="11" fill={point.color} opacity="0.18" />
              <circle cx={point.x} cy={point.y} r="5" fill={point.color} />
            </g>
          ))}
        </svg>

        <div className="grid gap-3 sm:grid-cols-4">
          {hopeCurvePoints.map((point, index) => (
            <div
              key={point.label}
              className="rounded-2xl border border-midnight/[0.08] bg-paper/[0.72] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.62)]"
            >
              <p
                className={[
                  'font-heading text-[1rem] font-semibold',
                  index === 0 ? 'text-clay' : 'text-olive',
                ].join(' ')}
              >
                {point.label}
              </p>
              <p className="mt-1 text-[0.9rem] leading-5 text-graphite/[0.62]">{point.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReframeHopeScreen({ onNext }) {
  const { reframe } = resultsCopy;

  return (
    <section className="result-flow-motion relative z-10 mx-auto w-full max-w-[48rem] px-5 pb-14 pt-10 sm:px-7 sm:pb-20 sm:pt-12">
      <ScreenIntro
        eyebrow={reframe.eyebrow}
        title={reframe.title}
        subtitle={reframe.subtitle}
      />

      <div className="mt-8">
        <HopeCurve />
      </div>

      <div className="mt-7 max-w-[43rem] space-y-4 text-[1.08rem] leading-8 text-graphite/[0.68]">
        {reframe.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {reframe.reassurancePills.map((pill) => (
          <div
            key={pill}
            className="flex min-h-14 items-center gap-3 rounded-2xl border border-midnight/[0.08] bg-paper/[0.72] px-4 shadow-[0_14px_42px_rgba(15,36,55,0.06),inset_0_1px_0_rgba(255,255,255,0.72)]"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-olive/[0.1] text-olive ring-1 ring-olive/[0.16]">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="font-heading text-[0.96rem] font-semibold text-midnight">
              {pill}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-[1.2rem] border border-olive/[0.14] bg-olive/[0.07] px-4 py-4 text-[1rem] font-semibold leading-6 text-midnight shadow-[inset_0_1px_0_rgba(255,255,255,0.54)]">
        {reframe.note}
      </p>

      <button
        type="button"
        onClick={onNext}
        className="group mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-clay px-6 py-4 font-heading text-[1.02rem] font-semibold text-paper shadow-[0_18px_42px_rgba(143,94,61,0.22)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#D0A587] hover:shadow-[0_24px_54px_rgba(143,94,61,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midnight active:translate-y-0 sm:w-auto"
      >
        <span>{reframe.cta}</span>
        <ArrowRight className="h-4 w-4 transition duration-300 ease-out group-hover:translate-x-1" aria-hidden="true" />
      </button>
    </section>
  );
}

function PaceOptionCard({ isSelected, onSelect, option }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={[
        'group w-full rounded-[1.25rem] border p-5 text-left shadow-[0_16px_52px_rgba(15,36,55,0.06),inset_0_1px_0_rgba(255,255,255,0.72)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive active:translate-y-[1px]',
        isSelected
          ? 'border-clay/55 bg-clay/[0.14] ring-2 ring-clay/[0.16]'
          : 'border-midnight/[0.08] bg-paper/[0.74] hover:-translate-y-0.5 hover:border-olive/[0.26] hover:bg-paper hover:shadow-[0_20px_58px_rgba(15,36,55,0.09),inset_0_1px_0_rgba(255,255,255,0.76)]',
      ].join(' ')}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-[1.35rem] font-semibold leading-tight text-midnight">
            {option.title}
          </h2>
          <p className="mt-2 text-[0.98rem] font-semibold text-olive">{option.subtitle}</p>
        </div>
        {option.badge ? (
          <span className="rounded-full border border-olive/[0.18] bg-olive/[0.09] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-olive">
            {option.badge}
          </span>
        ) : (
          <span
            className={[
              'mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition duration-300',
              isSelected
                ? 'border-clay bg-clay text-paper'
                : 'border-midnight/[0.12] text-transparent group-hover:border-olive/35',
            ].join(' ')}
            aria-hidden="true"
          >
            <Check className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <p className="mt-4 max-w-[33rem] text-[1rem] leading-7 text-graphite/[0.64]">
        {option.description}
      </p>
    </button>
  );
}

function MicroCommitmentScreen({ onSelectPace, selectedPace }) {
  const { microCommitment } = resultsCopy;

  return (
    <section className="result-flow-motion relative z-10 mx-auto w-full max-w-[45rem] px-5 pb-14 pt-10 sm:px-7 sm:pb-20 sm:pt-12">
      <ScreenIntro
        eyebrow={microCommitment.eyebrow}
        title={microCommitment.title}
        subtitle={microCommitment.subtitle}
      />

      <div className="mt-8 grid gap-3">
        {paceOptions.map((option) => (
          <PaceOptionCard
            key={option.id}
            isSelected={selectedPace === option.id}
            onSelect={onSelectPace}
            option={option}
          />
        ))}
      </div>

      <p className="mt-6 rounded-[1.2rem] border border-midnight/[0.08] bg-paper/[0.72] px-4 py-4 text-[1rem] leading-7 text-graphite/[0.66] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        {microCommitment.note}
      </p>
    </section>
  );
}

export default function ResultFlow({ answers, onBack }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedPace, setSelectedPace] = useState(null);
  const [screen4StepIndex, setScreen4StepIndex] = useState(null);
  const [downloadContact, setDownloadContact] = useState(null);
  const [showDownloadPage, setShowDownloadPage] = useState(false);
  const missionTimer = useRef(null);
  const barrierScores = useMemo(() => getBarrierScores(answers), [answers]);
  const result = useMemo(() => getResultPattern(answers), [answers]);
  const hasLostYearsBlock = useMemo(() => shouldShowLostYearsBlock(answers), [answers]);

  useLayoutEffect(() => {
    resetViewportPosition();
  }, [screen4StepIndex, showDownloadPage, stepIndex]);

  useEffect(() => {
    return () => {
      window.clearTimeout(missionTimer.current);
    };
  }, []);

  const goBack = () => {
    if (showDownloadPage) {
      setShowDownloadPage(false);
      return;
    }

    if (screen4StepIndex === 1) {
      setScreen4StepIndex(0);
      return;
    }

    if (screen4StepIndex === 0) {
      setScreen4StepIndex(null);
      return;
    }

    if (stepIndex > 0) {
      setStepIndex((currentStep) => currentStep - 1);
      return;
    }

    onBack();
  };

  const goNext = () => {
    resetViewportPosition();
    setStepIndex((currentStep) => Math.min(currentStep + 1, resultStepCount - 1));
  };

  const handleSelectPace = (paceId) => {
    setSelectedPace(paceId);
    window.clearTimeout(missionTimer.current);
    missionTimer.current = window.setTimeout(() => {
      resetViewportPosition();
      setScreen4StepIndex(0);
    }, missionPlaceholderDelay);
  };

  const advanceScreen4 = () => {
    resetViewportPosition();
    setScreen4StepIndex((currentStep) => Math.min((currentStep ?? 0) + 1, screen4StepCount - 1));
  };

  const handleDownloadReady = (contact) => {
    setDownloadContact({
      email: contact.email,
      firstName: contact.firstName,
      resultKey: result.id,
    });

    if (contact.shouldShowDownloadPage) {
      setShowDownloadPage(true);
    }
  };

  return (
    <>
      {showDownloadPage ? (
        <ResultHeader
          ariaLabel={resultsCopy.resultHeader.downloadPageAriaLabel}
          backAriaLabel={resultsCopy.resultHeader.downloadBackAriaLabel}
          countLabel={resultsCopy.resultHeader.downloadCountLabel}
          onBack={goBack}
          stepCount={1}
          stepIndex={0}
        />
      ) : screen4StepIndex === null ? (
        <ResultHeader onBack={goBack} stepIndex={stepIndex} />
      ) : (
        <ResultHeader
          ariaLabel={resultsCopy.resultHeader.screen4AriaLabel}
          backAriaLabel={
            screen4StepIndex === 0
              ? resultsCopy.resultHeader.screen4BackToPace
              : resultsCopy.resultHeader.screen4BackToPreflight
          }
          countLabel={`${resultsCopy.resultHeader.screen4CountPrefix} ${screen4StepIndex + 1} ${resultsCopy.resultHeader.screen4CountConnector} ${screen4StepCount}`}
          onBack={goBack}
          stepCount={screen4StepCount}
          stepIndex={screen4StepIndex}
        />
      )}

      {showDownloadPage ? (
        <DownloadHub
          firstName={downloadContact?.firstName}
          resultKey={downloadContact?.resultKey ?? result.id}
          selectedPace={selectedPace}
        />
      ) : screen4StepIndex === 0 ? (
        <PreFlightRoutineScreen onNext={advanceScreen4} />
      ) : screen4StepIndex === 1 ? (
        <MissionScreen onDownloadReady={handleDownloadReady} result={result} />
      ) : (
        <>
          {stepIndex === 0 ? (
            <ResultProfileScreen
              barrierScores={barrierScores}
              hasLostYearsBlock={hasLostYearsBlock}
              onNext={goNext}
              result={result}
            />
          ) : null}
          {stepIndex === 1 ? <ReframeHopeScreen onNext={goNext} /> : null}
          {stepIndex === 2 ? (
            <MicroCommitmentScreen onSelectPace={handleSelectPace} selectedPace={selectedPace} />
          ) : null}
        </>
      )}
    </>
  );
}
