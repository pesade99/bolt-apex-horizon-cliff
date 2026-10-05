import { useEffect, useState } from "react";
import { nameError, screenName } from "@/lib/name-filter";
import { courseById, type CourseId } from "@/lib/quiz-data";
import { fetchBoard, submitScore, type BoardEntry } from "@/lib/quiz-scores";

export function ScoreBoard({
  score,
  course,
  allow,
}: {
  score: number;
  course: CourseId;
  allow: boolean;
}) {
  const [board, setBoard] = useState<BoardEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [mine, setMine] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    fetchBoard()
      .then((rows) => {
        if (!live) return;
        setBoard(rows);
      })
      .catch(() => {
        if (!live) return;
        setFailed(true);
      });
    return () => {
      live = false;
    };
  }, []);

  async function leaveName() {
    const screened = screenName(name);
    if (!screened.ok) {
      setError(nameError(screened.reason));
      return;
    }
    setPending(true);
    setError("");
    try {
      const result = await submitScore({ data: { name: screened.name, score, course } });
      if (!result.ok) {
        if (result.reason === "length" || result.reason === "chars" || result.reason === "banned") {
          setError(nameError(result.reason));
        } else {
          setError("점수를 남기지 못했습니다.");
        }
        return;
      }
      setMine(result.id);
      setBoard(result.board);
      setName(screened.name);
    } catch {
      setError("지금 이름을 남기지 못했습니다. 잠시 뒤 다시 눌러 주세요.");
    } finally {
      setPending(false);
    }
  }

  const listed = board?.some((row) => row.id === mine) ?? false;

  return (
    <div className="mt-6 border border-line p-4">
      <h3 className="font-display text-lg font-bold">점수판</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        오락실처럼 이름을 남기면, 이 문답을 푼 사람들과 점수를 나눕니다. 상위 20명만 남습니다.
      </p>
      {allow ? (
        mine === null ? (
          <form
            className="mt-3 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void leaveName();
            }}
          >
            <label className="sr-only" htmlFor="score-name">
              이름
            </label>
            <input
              id="score-name"
              value={name}
              maxLength={10}
              autoComplete="nickname"
              placeholder="이름"
              onChange={(event) => setName(event.target.value)}
              className="min-h-12 flex-1 border border-line bg-ink px-3 text-base text-paper outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={pending}
              className="press min-h-12 bg-paper px-4 font-bold text-ink disabled:opacity-60"
            >
              {pending ? "남기는 중" : "이름을 남긴다"}
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm">
            <span className="text-cinnabar">{name}</span>
            <span className="text-muted"> · {score}점을 남겼습니다.</span>
          </p>
        )
      ) : (
        <p className="mt-3 text-sm text-muted">복습 점수는 점수판에 오르지 않습니다.</p>
      )}
      {error ? <p className="mt-2 text-sm text-cinnabar">{error}</p> : null}
      {failed && board === null ? <p className="mt-3 text-sm text-muted">점수판을 불러오지 못했습니다.</p> : null}
      {board && board.length === 0 ? <p className="mt-3 text-sm text-muted">아직 이름을 남긴 사람이 없습니다.</p> : null}
      {board && board.length > 0 ? (
        <ol className="mt-3 border-t border-line">
          {board.map((row, index) => {
            const meta = courseById(row.course);
            const highlight = row.id === mine;
            return (
              <li
                key={row.id}
                className={
                  "flex min-h-11 items-baseline gap-3 border-b border-line py-2 " +
                  (highlight ? "bg-paper/10" : "")
                }
              >
                <span className={"w-6 text-right text-sm tabular-nums " + (index === 0 ? "text-cinnabar" : "text-muted")}>
                  {index + 1}
                </span>
                <span className="flex-1 truncate text-sm font-bold">{row.name}</span>
                <span className="text-xs text-muted">{meta.title}</span>
                <span className="w-16 text-right font-display text-lg font-bold tabular-nums">{row.score}</span>
              </li>
            );
          })}
        </ol>
      ) : null}
      {mine !== null && board && !listed ? (
        <p className="mt-2 text-xs text-muted">이번 {score}점은 20위 밖입니다. 이름만 기록되었습니다.</p>
      ) : null}
    </div>
  );
}
