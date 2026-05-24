import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Check,
  Clock3,
  DoorOpen,
  Eye,
  ListChecks,
  MessageCircle,
  Snowflake,
} from 'lucide-react';
import { answerOptions, assessmentQuestions, reassuranceCopy } from '../data/assessmentQuestions.js';
import ResultFlow from './ResultFlow.jsx';

const answerDelay = 190;
const resultReadyDelay = 5400;
const transitionStatuses = [
  'Analyzing your response patterns...',
  'Mapping your social re-entry profile...',
  'Preparing your Day 0 path...',
];

function resetAssessmentViewport() {
  window.scrollTo(0, 0);

  const appSurface = document.querySelector('main');

  if (appSurface) {
    appSurface.scrollTop = 0;
    appSurface.scrollLeft = 0;
  }
}

function ProgressHeader({ currentQuestionIndex, onBack, totalQuestions }) {
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <header className="relative z-10 w-full">
      <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-7">
        <button
          type="button"
          onClick={onBack}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-midnight/[0.1] bg-paper/70 text-midnight shadow-[0_12px_32px_rgba(15,36,55,0.07),inset_0_1px_0_rgba(255,255,255,0.72)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-olive/30 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive active:translate-y-0"
          aria-label={currentQuestionIndex === 0 ? 'Return to landing screen' : 'Go to previous question'}
        >
          <ArrowLeft className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
        </button>

        <p className="min-w-0 text-center font-heading text-[1.02rem] font-semibold tracking-[0.01em] text-midnight">
          ReEntera
        </p>

        <p
          className="min-w-10 shrink-0 text-right text-[0.86rem] font-semibold tabular-nums text-graphite/60"
          aria-label={`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
        >
          {currentQuestionIndex + 1} / {totalQuestions}
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl px-5 sm:px-7">
        <div
          className="h-1.5 overflow-hidden rounded-full bg-midnight/[0.08]"
          role="progressbar"
          aria-valuemin="1"
          aria-valuemax={totalQuestions}
          aria-valuenow={currentQuestionIndex + 1}
        >
          <div
            className="h-full rounded-full bg-clay transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}

function QuestionVisualCue({ compact, iconKey }) {
  const Icon = {
    conversation: MessageCircle,
    judged: Eye,
    avoidance: DoorOpen,
    freeze: Snowflake,
    pulse: Activity,
    discipline: ListChecks,
    future: Clock3,
  }[iconKey] ?? MessageCircle;

  return (
    <div
      className={[
        'relative mx-auto grid place-items-center',
        compact ? 'h-14 w-14 sm:h-24 sm:w-24' : 'h-[4.75rem] w-[4.75rem] sm:h-24 sm:w-24',
      ].join(' ')}
    >
      <div className="absolute inset-0 rounded-full bg-clay/[0.12] blur-2xl" />
      <div className="absolute h-[82%] w-[82%] rounded-full border border-olive/[0.18]" />
      <div className="absolute h-[54%] w-[54%] rounded-full border border-clay/[0.26]" />
      <span
        className={[
          'relative grid place-items-center rounded-full border border-midnight/[0.08] bg-paper/80 text-olive shadow-[0_18px_44px_rgba(15,36,55,0.08),inset_0_1px_0_rgba(255,255,255,0.74)] sm:h-14 sm:w-14',
          compact ? 'h-10 w-10' : 'h-12 w-12',
        ].join(' ')}
      >
        <Icon
          className={compact ? 'h-[1.125rem] w-[1.125rem] sm:h-6 sm:w-6' : 'h-5 w-5 sm:h-6 sm:w-6'}
          aria-hidden="true"
        />
      </span>
    </div>
  );
}

function AnswerButton({ isSelected, label, onSelect, value }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.currentTarget.blur();
        onSelect(value);
      }}
      className={[
        'group flex min-h-[3.65rem] w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-left shadow-[0_14px_42px_rgba(15,36,55,0.06),inset_0_1px_0_rgba(255,255,255,0.72)] transition duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive active:translate-y-[1px] sm:min-h-16 sm:px-5',
        isSelected
          ? 'border-clay/55 bg-clay/[0.16] text-midnight ring-2 ring-clay/[0.18]'
          : 'border-midnight/[0.08] bg-paper/78 text-graphite hover:-translate-y-0.5 hover:border-olive/[0.28] hover:bg-paper hover:shadow-[0_18px_48px_rgba(15,36,55,0.09),inset_0_1px_0_rgba(255,255,255,0.78)]',
      ].join(' ')}
      aria-pressed={isSelected}
      aria-label={`${value}, ${label}`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={[
            'grid h-8 w-8 shrink-0 place-items-center rounded-full border font-heading text-[0.9rem] font-semibold tabular-nums transition duration-200',
            isSelected
              ? 'border-clay/50 bg-clay text-paper'
              : 'border-midnight/[0.08] bg-midnight/[0.045] text-midnight/72 group-hover:border-olive/25 group-hover:bg-olive/[0.08]',
          ].join(' ')}
        >
          {value}
        </span>
        <span className="min-w-0 text-[1.02rem] font-semibold leading-5 sm:text-[1.08rem]">
          {label}
        </span>
      </span>

      <span
        className={[
          'grid h-6 w-6 shrink-0 place-items-center rounded-full border transition duration-200',
          isSelected
            ? 'border-clay bg-paper text-clay opacity-100'
            : 'border-midnight/[0.08] text-transparent opacity-60 group-hover:border-olive/30',
        ].join(' ')}
        aria-hidden="true"
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

function CompletionPlaceholder() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const statusTimers = [
      window.setTimeout(() => {
        setStatusIndex(1);
      }, 1500),
      window.setTimeout(() => {
        setStatusIndex(2);
      }, 3000),
    ];

    return () => {
      statusTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <section className="result-transition-motion relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[46rem] flex-col items-center justify-center px-5 py-12 text-center sm:px-7">
      <div className="result-transition-aura result-transition-aura-olive" />
      <div className="result-transition-aura result-transition-aura-clay" />

      <div className="result-scan-orb" aria-hidden="true">
        <span className="result-scan-ring result-scan-ring-outer" />
        <span className="result-scan-ring result-scan-ring-middle" />
        <span className="result-scan-ring result-scan-ring-inner" />
        <span className="result-scan-sweep" />
        <span className="result-scan-core">
          <span className="result-signal-dot result-signal-dot-clay" />
          <span className="result-signal-dot result-signal-dot-olive" />
          <span className="result-signal-dot result-signal-dot-paper" />
        </span>
      </div>

      <h1
        key={transitionStatuses[statusIndex]}
        className="result-status-line mt-9 max-w-[39rem] font-heading text-[1.95rem] font-semibold leading-tight text-midnight sm:text-[2.55rem]"
        role="status"
        aria-live="polite"
      >
        {transitionStatuses[statusIndex]}
      </h1>

      <div className="result-progress-line mt-7" aria-hidden="true">
        <span />
      </div>

      <p className="mt-6 max-w-[23rem] text-[1.03rem] font-semibold leading-7 text-graphite/[0.62]">
        No labels. No judgment.
        <span className="block">Just your private starting point.</span>
      </p>
    </section>
  );
}

export default function AssessmentScreen({
  answers,
  currentQuestionIndex,
  onAdvance,
  onAnswer,
  onBack,
}) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isResultReady, setIsResultReady] = useState(false);
  const advanceTimer = useRef(null);
  const resultTimer = useRef(null);
  const totalQuestions = assessmentQuestions.length;
  const isComplete = currentQuestionIndex >= totalQuestions;
  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const isLongQuestion = currentQuestion?.question.length > 155;
  const reassurance = reassuranceCopy[currentQuestionIndex % reassuranceCopy.length];

  useEffect(() => {
    setSelectedValue(isComplete ? null : answers[currentQuestionIndex]);
    setIsAdvancing(false);
    setIsResultReady(false);
    resetAssessmentViewport();

    if (isComplete) {
      window.clearTimeout(resultTimer.current);
      resultTimer.current = window.setTimeout(() => {
        setIsResultReady(true);
      }, resultReadyDelay);
    }

    return () => {
      window.clearTimeout(resultTimer.current);
    };
  }, [currentQuestionIndex, isComplete]);

  useEffect(() => {
    return () => {
      window.clearTimeout(advanceTimer.current);
      window.clearTimeout(resultTimer.current);
    };
  }, []);

  const handleSelect = (value) => {
    if (isAdvancing) {
      return;
    }

    setSelectedValue(value);
    setIsAdvancing(true);
    onAnswer(value);
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(onAdvance, answerDelay);
  };

  return (
    <main className="web-landing min-h-screen overflow-hidden bg-paper text-graphite antialiased">
      <div className="web-vignette" />
      <div className="web-aura web-aura-olive" />
      <div className="web-aura web-aura-clay" />
      <div className="web-aura web-aura-warm" />

      {isComplete && isResultReady ? (
        <ResultFlow answers={answers} onBack={onBack} />
      ) : (
        <>
          <ProgressHeader
            currentQuestionIndex={Math.min(currentQuestionIndex, totalQuestions - 1)}
            onBack={onBack}
            totalQuestions={totalQuestions}
          />
          {isComplete ? (
            <CompletionPlaceholder />
          ) : (
            <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col px-5 pb-7 pt-10 sm:min-h-[calc(100vh-6.25rem)] sm:px-7 sm:pb-10 sm:pt-9 lg:max-w-[39rem]">
              <p className="min-h-6 text-center text-[0.9rem] font-semibold text-graphite/50">
                {reassurance}
              </p>

              <div
                key={currentQuestion.id}
                className="assessment-question-motion flex flex-1 flex-col"
              >
                <div
                  className={[
                    'flex flex-1 flex-col justify-center',
                    isLongQuestion ? 'pb-4 pt-5 sm:pb-8 sm:pt-10' : 'pb-6 pt-8 sm:pb-8 sm:pt-10',
                  ].join(' ')}
                >
                  <QuestionVisualCue compact={isLongQuestion} iconKey={currentQuestion.iconKey} />

                  <div className={isLongQuestion ? 'mt-4 text-center sm:mt-7' : 'mt-7 text-center'}>
                    <p className="inline-flex rounded-full border border-olive/[0.18] bg-olive/[0.08] px-3.5 py-1.5 text-[0.77rem] font-bold uppercase tracking-[0.08em] text-olive">
                      {currentQuestion.dimension}
                    </p>
                    <h1
                      className={[
                        'mx-auto max-w-[37rem] font-heading font-semibold tracking-normal text-midnight',
                        isLongQuestion
                          ? 'mt-4 text-[1.36rem] leading-[1.12] sm:mt-5 sm:text-[2.05rem] sm:leading-[1.13]'
                          : 'mt-5 text-[1.72rem] leading-[1.13] sm:text-[2.2rem]',
                      ].join(' ')}
                    >
                      {currentQuestion.question}
                    </h1>
                  </div>
                </div>

                <div className="grid gap-2.5 pb-3 sm:gap-3">
                  {answerOptions.map((option) => (
                    <AnswerButton
                      key={option.value}
                      isSelected={selectedValue === option.value}
                      label={option.label}
                      onSelect={handleSelect}
                      value={option.value}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
