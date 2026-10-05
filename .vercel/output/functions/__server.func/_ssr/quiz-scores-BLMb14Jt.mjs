import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as screenName } from "./name-filter-D9ZrsD_Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-scores-BLMb14Jt.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var COURSES = /* @__PURE__ */ new Set([
	"intro",
	"hashira",
	"infinity"
]);
function asCourse(value) {
	return COURSES.has(value) ? value : null;
}
function asBoard(rows) {
	return rows.flatMap((row) => {
		const course = asCourse(row.course);
		if (!course) return [];
		return [{
			id: Number(row.id),
			name: row.name,
			score: Number(row.score),
			course
		}];
	});
}
async function topBoard() {
	const { getSql } = await import("./db-BOnpBW5W.mjs");
	return asBoard(await (await getSql())`
    select id, name, score, course
    from quiz_scores
    order by score desc, created_at asc
    limit 20
  `);
}
var fetchBoard_createServerFn_handler = createServerRpc({
	id: "bcb51face1d8cc6ac0f58ba83c300867446262f89e1dcd5d8cc76418f64b2e8d",
	name: "fetchBoard",
	filename: "src/lib/quiz-scores.ts"
}, (opts) => fetchBoard.__executeServer(opts));
var fetchBoard = createServerFn({ method: "GET" }).handler(fetchBoard_createServerFn_handler, async () => {
	return topBoard();
});
var submitScore_createServerFn_handler = createServerRpc({
	id: "cb65c03aa587269fd4722bda0f311bef23d40ff224d639b9513102fdbec88f3d",
	name: "submitScore",
	filename: "src/lib/quiz-scores.ts"
}, (opts) => submitScore.__executeServer(opts));
var submitScore = createServerFn({ method: "POST" }).validator((input) => input).handler(submitScore_createServerFn_handler, async ({ data }) => {
	const course = asCourse(data.course);
	if (!course) return {
		ok: false,
		reason: "course"
	};
	if (!Number.isInteger(data.score) || data.score < 0 || data.score > 2800) return {
		ok: false,
		reason: "score"
	};
	const screened = screenName(typeof data.name === "string" ? data.name : "");
	if (!screened.ok) return {
		ok: false,
		reason: screened.reason
	};
	const { getSql } = await import("./db-BOnpBW5W.mjs");
	const inserted = await (await getSql())`
      insert into quiz_scores (name, score, course)
      values (${screened.name}, ${data.score}, ${course})
      returning id
    `;
	return {
		ok: true,
		id: Number(inserted[0]?.id ?? 0),
		board: await topBoard()
	};
});
//#endregion
export { fetchBoard_createServerFn_handler, submitScore_createServerFn_handler };
