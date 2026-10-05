import { createServerFn } from "@tanstack/react-start";
import { screenName, type NameReject } from "./name-filter";

export type BoardCourse = "intro" | "hashira" | "infinity";

export type BoardEntry = {
  id: number;
  name: string;
  score: number;
  course: BoardCourse;
};

export type SubmitResult =
  | { ok: true; id: number; board: BoardEntry[] }
  | { ok: false; reason: NameReject | "score" | "course" };

const COURSES = new Set<BoardCourse>(["intro", "hashira", "infinity"]);

function asCourse(value: string): BoardCourse | null {
  return COURSES.has(value as BoardCourse) ? (value as BoardCourse) : null;
}

function asBoard(rows: { id: number; name: string; score: number; course: string }[]): BoardEntry[] {
  return rows.flatMap((row) => {
    const course = asCourse(row.course);
    if (!course) return [];
    return [{ id: Number(row.id), name: row.name, score: Number(row.score), course }];
  });
}

async function topBoard() {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ id: number; name: string; score: number; course: string }>`
    select id, name, score, course
    from quiz_scores
    order by score desc, created_at asc
    limit 20
  `;
  return asBoard(rows);
}

export const fetchBoard = createServerFn({ method: "GET" }).handler(async (): Promise<BoardEntry[]> => {
  return topBoard();
});

export const submitScore = createServerFn({ method: "POST" })
  .validator((input: { name: string; score: number; course: string }) => input)
  .handler(async ({ data }): Promise<SubmitResult> => {
    const course = asCourse(data.course);
    if (!course) return { ok: false, reason: "course" };
    if (!Number.isInteger(data.score) || data.score < 0 || data.score > 2800) {
      return { ok: false, reason: "score" };
    }
    const screened = screenName(typeof data.name === "string" ? data.name : "");
    if (!screened.ok) return { ok: false, reason: screened.reason };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const inserted = await sql<{ id: number }>`
      insert into quiz_scores (name, score, course)
      values (${screened.name}, ${data.score}, ${course})
      returning id
    `;
    const id = Number(inserted[0]?.id ?? 0);
    return { ok: true, id, board: await topBoard() };
  });
