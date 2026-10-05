import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { ScoreBoard } from "@/components/score-board";
import {
  COURSES,
  QUESTION_COUNT,
  TIME_LIMIT,
  courseById,
  loadSave,
  pickQuestions,
  pointsFor,
  poolCount,
  rankFor,
  reshuffle,
  writeSave,
  type BestMap,
  type CourseId,
  type Question,
} from "@/lib/quiz-data";
import { playTone, unlockAudio } from "@/lib/quiz-audio";

type Log = {
  picked: number | null;
  correct: boolean;
  elapsed: number;
  gained: number;
};

type Run = {
  course: CourseId;
  questions: Question[];
  index: number;
  picked: number | null;
  locked: boolean;
  correctCount: number;
  score: number;
  streak: number;
  bestStreak: number;
  startedAt: number;
  log: Log[];
  timed: boolean;
  sound: boolean;
  review: boolean;
};

const KEYS = ["1", "2", "3", "4"];

export function QuizApp() {
  const [course, setCourse] = useState<CourseId>("intro");
  const [timed, setTimed] = useState(true);
  const [sound, setSound] = useState(true);
  const [best, setBest] = useState<BestMap | null>(null);
  const [phase, setPhase] = useState<"home" | "play" | "result">("home");
  const [run, setRun] = useState<Run | null>(null);
  const [left, setLeft] = useState(TIME_LIMIT);
  const runRef = useRef<Run | null>(null);
  const lockRef = useRef(false);
  const commitRef = useRef<(pick: number | null) => void>(() => {});
  const nextRef = useRef<() => void>(() => {});

  useEffect(() => {
    const saved = loadSave();
    setBest(saved.best);
    setTimed(saved.timed);
    setSound(saved.sound);
  }, []);

  useEffect(() => {
    if (!best) return;
    writeSave({ best, timed, sound });
  }, [best, timed, sound]);

  function begin(nextCourse: CourseId, questions: Question[], review: boolean) {
    unlockAudio();
    lockRef.current = false;
    const next: Run = {
      course: nextCourse,
      questions,
      index: 0,
      picked: null,
      locked: false,
      correctCount: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      startedAt: Date.now(),
      log: [],
      timed,
      sound,
      review,
    };
    runRef.current = next;
    setRun(next);
    setLeft(TIME_LIMIT);
    setPhase("play");
  }

  function startCourse() {
    begin(course, pickQuestions(course), false);
  }

  function retrySame() {
    if (!run) return;
    begin(run.course, pickQuestions(run.course), false);
  }

  function retryMissed() {
    if (!run) return;
    const missed = run.questions.filter((_, i) => !run.log[i]?.correct);
    if (missed.length === 0) return;
    begin(run.course, reshuffle(missed), true);
  }

  commitRef.current = (pick: number | null) => {
    if (lockRef.current) return;
    const current = runRef.current;
    if (!current || current.locked) return;
    lockRef.current = true;
    const question = current.questions[current.index];
    if (!question) return;
    const elapsed = (Date.now() - current.startedAt) / 1000;
    const correct = pick !== null && pick === question.answer;
    const streak = correct ? current.streak + 1 : 0;
    const gained = correct ? pointsFor(elapsed, streak, current.timed) : 0;
    const next: Run = {
      ...current,
      picked: pick,
      locked: true,
      correctCount: current.correctCount + (correct ? 1 : 0),
      score: current.score + gained,
      streak,
      bestStreak: Math.max(current.bestStreak, streak),
      log: [...current.log, { picked: pick, correct, elapsed, gained }],
    };
    runRef.current = next;
    setRun(next);
    if (current.sound) playTone(correct ? "ok" : "bad");
  };

  nextRef.current = () => {
    const current = runRef.current;
    if (!current || !current.locked) return;
    if (current.index + 1 >= current.questions.length) {
      if (!current.review && current.questions.length === QUESTION_COUNT) {
        setBest((prev) => {
          const map = prev ?? { intro: null, hashira: null, infinity: null };
          const previous = map[current.course];
          if (previous && previous.score >= current.score) return map;
          return {
            ...map,
            [current.course]: {
              score: current.score,
              correct: current.correctCount,
              total: current.questions.length,
              timed: current.timed,
              at: Date.now(),
            },
          };
        });
      }
      setPhase("result");
      return;
    }
    lockRef.current = false;
    const next: Run = {
      ...current,
      index: current.index + 1,
      picked: null,
      locked: false,
      startedAt: Date.now(),
    };
    runRef.current = next;
    setRun(next);
    setLeft(TIME_LIMIT);
  };

  useEffect(() => {
    if (phase !== "play" || !run?.timed || run.locked) return;
    const tick = () => {
      const current = runRef.current;
      if (!current || current.locked) return;
      const remain = TIME_LIMIT - (Date.now() - current.startedAt) / 1000;
      if (remain <= 0) {
        setLeft(0);
        commitRef.current(null);
        return;
      }
      setLeft(remain);
    };
    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [phase, run?.index, run?.locked, run?.timed]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (phase !== "play") return;
      const current = runRef.current;
      if (!current) return;
      if (!current.locked && KEYS.includes(event.key)) {
        event.preventDefault();
        commitRef.current(Number(event.key) - 1);
      } else if (current.locked && event.key === "Enter") {
        event.preventDefault();
        nextRef.current();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const live =
    phase === "play" && run?.locked
      ? run.log.at(-1)?.correct
        ? "정답입니다."
        : "오답입니다."
      : "";

  return (
    <div className="relative min-h-screen bg-ink text-paper">
      <div className="lattice pointer-events-none absolute inset-0" aria-hidden="true" />
      <main className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm text-cinnabar">鬼滅の刃</p>
            <h1 className="font-display text-4xl leading-tight font-bold sm:text-5xl">귀멸 문답</h1>
          </div>
          <p className="text-right text-xs leading-relaxed text-muted">
            비공식 설정 퀴즈
            <br />
            한 판 {QUESTION_COUNT}문제
            <br />
            <Link to="/village" className="underline">
              마을
            </Link>
          </p>
        </header>

        {phase === "home" ? (
          <Home
            course={course}
            timed={timed}
            sound={sound}
            best={best}
            onCourse={setCourse}
            onTimed={() => setTimed((v) => !v)}
            onSound={() => setSound((v) => !v)}
            onStart={startCourse}
          />
        ) : null}

        {phase === "play" && run ? (
          <Play run={run} left={left} onPick={(i) => commitRef.current(i)} onNext={() => nextRef.current()} />
        ) : null}

        {phase === "result" && run ? (
          <Result
            run={run}
            best={best}
            onRetry={retrySame}
            onMissed={retryMissed}
            onHome={() => setPhase("home")}
          />
        ) : null}

        <p className="sr-only" aria-live="polite">
          {live}
        </p>

        <footer className="mt-8 text-xs leading-relaxed text-muted">
          문제 은행은 나무위키의 귀멸의 칼날 설정·인물 문서와 공식 프로필을 대조해 늘렸습니다. 기둥
          호칭은 kimetsu.com 기둥전과 애니 인물 소개를 확인했습니다. 연재는 고토게 코요하루, 주간 소년
          점프, 205화·단행본 23권입니다. 전투와 결말은 표시된 코스에만 넣었습니다.
        </footer>
      </main>
    </div>
  );
}

function Home({
  course,
  timed,
  sound,
  best,
  onCourse,
  onTimed,
  onSound,
  onStart,
}: {
  course: CourseId;
  timed: boolean;
  sound: boolean;
  best: BestMap | null;
  onCourse: (id: CourseId) => void;
  onTimed: () => void;
  onSound: () => void;
  onStart: () => void;
}) {
  return (
    <section className="sheet rise flex flex-1 flex-col p-5 sm:p-8">
      <p className="text-sm text-muted">오늘 밤의 시험. 보기를 고르면 바로 해설이 나옵니다.</p>
      <div className="mt-5 grid gap-3" role="radiogroup" aria-label="코스">
        {COURSES.map((item) => {
          const selected = course === item.id;
          const record = best?.[item.id];
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onCourse(item.id)}
              className={
                "press min-h-12 border px-4 py-3 text-left " +
                (selected ? "border-paper bg-paper/10" : "border-line bg-ink")
              }
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-lg font-bold">
                  <span className="mr-2 text-cinnabar">{item.seal}</span>
                  {item.title}
                </span>
                {item.spoiler ? (
                  <span className="shrink-0 text-xs text-cinnabar">{item.spoiler} 스포일러</span>
                ) : (
                  <span className="shrink-0 text-xs text-muted">스포일러 없음</span>
                )}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">{item.scope}</span>
              <span className="mt-2 block text-xs text-muted">
                문제 은행 {poolCount(item.id)}문항 중 {QUESTION_COUNT}문항
                {record ? ` · 최고 ${record.correct}/${record.total} · ${record.score}점` : ""}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={timed}
          onClick={onTimed}
          className="press min-h-12 border border-line bg-ink px-3 py-2 text-left text-sm"
        >
          <span className="block text-muted">제한 시간</span>
          <span className="font-bold">{timed ? `${TIME_LIMIT}초` : "없음"}</span>
        </button>
        <button
          type="button"
          aria-pressed={sound}
          onClick={onSound}
          className="press flex min-h-12 items-center justify-between border border-line bg-ink px-3 py-2 text-left text-sm"
        >
          <span>
            <span className="block text-muted">효과음</span>
            <span className="font-bold">{sound ? "켜짐" : "꺼짐"}</span>
          </span>
          {sound ? <Volume2 aria-hidden="true" className="size-5" /> : <VolumeX aria-hidden="true" className="size-5" />}
        </button>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="press mt-5 min-h-12 bg-paper px-4 py-3 font-display text-lg font-bold text-ink"
      >
        시험 시작
      </button>
      <p className="mt-3 text-xs text-muted">키보드 1–4로 고르고, Enter로 다음 문제로 넘어갑니다.</p>
    </section>
  );
}

function Play({
  run,
  left,
  onPick,
  onNext,
}: {
  run: Run;
  left: number;
  onPick: (index: number) => void;
  onNext: () => void;
}) {
  const question = run.questions[run.index];
  if (!question) return null;
  const meta = courseById(run.course);
  const last = run.log.at(-1);
  const remain = run.timed ? Math.ceil(Math.max(0, left)) : null;
  const urgent = remain !== null && remain <= 5 && !run.locked;

  return (
    <section className="sheet rise flex flex-1 flex-col p-5 sm:p-8" key={question.id}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="text-cinnabar">{meta.seal}</span> {meta.title}
          {run.review ? " · 오답 복습" : ""}
        </p>
        {run.timed ? <Timer left={left} urgent={urgent} label={remain ?? 0} /> : <span className="text-sm text-muted">시간 제한 없음</span>}
      </div>

      <div className="mt-4 flex gap-1" aria-hidden="true">
        {run.questions.map((_, i) => (
          <span
            key={i}
            className={"h-1 flex-1 " + (i < run.index ? "bg-paper" : i === run.index ? "bg-cinnabar" : "bg-line")}
          />
        ))}
      </div>

      <p className="mt-4 text-sm text-muted tabular-nums">
        {run.index + 1} / {run.questions.length}
        <span className="mx-2 text-line">/</span>
        {run.score}점
        {run.streak > 1 ? <span className="ml-2 text-paper">연속 {run.streak}</span> : null}
      </p>

      <h2 className="mt-3 min-h-24 font-display text-2xl leading-snug font-bold">{question.prompt}</h2>

      <div className="mt-2 grid gap-3">
        {question.choices.map((choice, index) => {
          const isAnswer = index === question.answer;
          const isPicked = index === run.picked;
          let tone = "border-line bg-ink";
          if (run.locked && isAnswer) tone = "border-paper bg-paper/15";
          else if (run.locked && isPicked) tone = "border-cinnabar bg-cinnabar/15";
          return (
            <button
              key={choice}
              type="button"
              disabled={run.locked}
              onClick={() => onPick(index)}
              className={"press flex min-h-12 items-start gap-3 border px-4 py-3 text-left " + tone}
            >
              <span className="font-display text-cinnabar">{index + 1}</span>
              <span className="flex-1 leading-snug">{choice}</span>
              {run.locked && isAnswer ? <span className="text-xs text-paper">정답</span> : null}
              {run.locked && isPicked && !isAnswer ? <span className="text-xs text-cinnabar">내 선택</span> : null}
            </button>
          );
        })}
      </div>

      {run.locked && last ? (
        <div className="mt-5 border-t border-line pt-4">
          <p className="font-display text-lg font-bold">{last.correct ? "맞았습니다" : last.picked === null ? "시간이 다 됐습니다" : "아닙니다"}</p>
          <p className="mt-1 text-sm text-muted tabular-nums">
            {last.correct ? `+${last.gained}점` : "0점"}
            {last.correct && run.streak > 1 ? ` · 연속 ${run.streak}` : ""}
            {!last.correct && run.bestStreak > 0 ? " · 연속이 끊겼습니다" : ""}
          </p>
          <p className="mt-3 text-sm leading-relaxed">{question.explain}</p>
          <button type="button" onClick={onNext} className="press mt-4 min-h-12 w-full bg-paper px-4 py-3 font-bold text-ink">
            {run.index + 1 >= run.questions.length ? "결과 보기" : "다음 문제"}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function Timer({ left, urgent, label }: { left: number; urgent: boolean; label: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, left / TIME_LIMIT));
  return (
    <div className="relative grid size-11 place-items-center" aria-label={`남은 시간 ${label}초`}>
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" className="absolute">
        <circle cx="22" cy="22" r={r} fill="none" className="stroke-line" strokeWidth="3" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          className={urgent ? "stroke-cinnabar" : "stroke-paper"}
          strokeWidth="3"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          strokeLinecap="butt"
          transform="rotate(-90 22 22)"
        />
      </svg>
      <span className={"relative text-sm font-bold tabular-nums " + (urgent ? "text-cinnabar" : "text-paper")}>{label}</span>
    </div>
  );
}

function Result({
  run,
  best,
  onRetry,
  onMissed,
  onHome,
}: {
  run: Run;
  best: BestMap | null;
  onRetry: () => void;
  onMissed: () => void;
  onHome: () => void;
}) {
  const meta = courseById(run.course);
  const rank = rankFor(run.correctCount, run.questions.length);
  const missed = run.questions.length - run.correctCount;
  const record = best?.[run.course];

  return (
    <section className="sheet rise flex flex-1 flex-col p-5 sm:p-8">
      <p className="text-sm text-muted">
        <span className="text-cinnabar">{meta.seal}</span> {meta.title}
        {run.review ? " · 오답 복습" : ""}
      </p>
      <div className="mx-auto mt-6 grid size-28 place-items-center rounded-full border-2 border-cinnabar text-cinnabar">
        <div className="text-center">
          <div className="font-display text-4xl leading-none">{rank.seal}</div>
          <div className="mt-1 text-xs">{rank.name}</div>
        </div>
      </div>
      <h2 className="mt-4 text-center font-display text-3xl font-bold">
        {rank.name}
        <span className="ml-2 text-base font-normal text-muted">{rank.reading}</span>
      </h2>
      <p className="mt-2 text-center text-sm leading-relaxed text-muted">{rank.line}</p>
      <dl className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className="border border-line px-2 py-3">
          <dt className="text-xs text-muted">정답</dt>
          <dd className="font-display text-2xl font-bold tabular-nums">
            {run.correctCount}
            <span className="text-sm text-muted">/{run.questions.length}</span>
          </dd>
        </div>
        <div className="border border-line px-2 py-3">
          <dt className="text-xs text-muted">점수</dt>
          <dd className="font-display text-2xl font-bold tabular-nums">{run.score}</dd>
        </div>
        <div className="border border-line px-2 py-3">
          <dt className="text-xs text-muted">최장 연속</dt>
          <dd className="font-display text-2xl font-bold tabular-nums">{run.bestStreak}</dd>
        </div>
      </dl>
      {!run.review && record ? (
        <p className="mt-3 text-center text-xs text-muted">이 코스 최고 {record.correct}/{record.total} · {record.score}점</p>
      ) : null}
      {run.review ? <p className="mt-3 text-center text-xs text-muted">복습 시험은 최고 기록에 남지 않습니다.</p> : null}

      <ScoreBoard score={run.score} course={run.course} allow={!run.review} />

      <div className="mt-6 grid gap-3">
        <button type="button" onClick={onRetry} className="press flex min-h-12 items-center justify-center gap-2 bg-paper px-4 py-3 font-bold text-ink">
          <RotateCcw aria-hidden="true" className="size-4" />
          같은 코스 다시
        </button>
        {missed > 0 ? (
          <button type="button" onClick={onMissed} className="press min-h-12 border border-line px-4 py-3 font-bold">
            틀린 {missed}문제만 다시
          </button>
        ) : null}
        <button type="button" onClick={onHome} className="press min-h-12 border border-line px-4 py-3">
          코스 고르기
        </button>
      </div>

      <h3 className="mt-8 font-display text-lg font-bold">해설</h3>
      <div className="mt-2 border-t border-line">
        {run.questions.map((question, index) => {
          const log = run.log[index];
          const ok = log?.correct ?? false;
          const picked = log?.picked;
          return (
            <details key={question.id} className="border-b border-line">
              <summary className="flex min-h-12 items-start gap-3 py-3">
                <span className={"mt-0.5 text-xs " + (ok ? "text-paper" : "text-cinnabar")}>{ok ? "정답" : "오답"}</span>
                <span className="flex-1 text-sm leading-snug">{question.prompt}</span>
              </summary>
              <div className="pb-4 pl-10 text-sm leading-relaxed">
                <p>
                  정답 · {question.choices[question.answer]}
                </p>
                {picked === null ? <p className="text-muted">고르지 못했습니다.</p> : null}
                {picked !== null && picked !== question.answer ? (
                  <p className="text-muted">내 선택 · {question.choices[picked]}</p>
                ) : null}
                <p className="mt-2 text-muted">{question.explain}</p>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
