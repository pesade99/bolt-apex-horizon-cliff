//#region node_modules/.nitro/vite/services/ssr/assets/name-filter-D9ZrsD_Y.js
var CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
var JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
var JONG = [
	"",
	"ㄱ",
	"ㄲ",
	"ㄳ",
	"ㄴ",
	"ㄵ",
	"ㄶ",
	"ㄷ",
	"ㄹ",
	"ㄺ",
	"ㄻ",
	"ㄼ",
	"ㄽ",
	"ㄾ",
	"ㄿ",
	"ㅀ",
	"ㅁ",
	"ㅂ",
	"ㅄ",
	"ㅅ",
	"ㅆ",
	"ㅇ",
	"ㅈ",
	"ㅊ",
	"ㅋ",
	"ㅌ",
	"ㅍ",
	"ㅎ"
];
var HANGUL = [
	"시발",
	"씨발",
	"씨팔",
	"시팔",
	"병신",
	"븅신",
	"지랄",
	"좆",
	"존나",
	"보지",
	"자지",
	"섹스",
	"야동",
	"강간",
	"창녀",
	"창년",
	"근친",
	"딸딸",
	"자위",
	"음란",
	"포르노",
	"야설",
	"펠라",
	"오럴",
	"애널",
	"후장",
	"개새",
	"개색",
	"느금",
	"니미",
	"애미",
	"엠창",
	"변태",
	"성폭",
	"새끼",
	"씹",
	"ㅅㅂ",
	"ㅆㅂ",
	"ㅂㅅ",
	"ㅅㅣ발",
	"시ㅂㅏㄹ",
	"ㅆㅣ발",
	"ㅅㅣㅂㅏㄹ",
	"ㅆㅣㅂㅏㄹ",
	"ㅂㅕㅇ신",
	"병ㅅㅣㄴ"
];
var LATIN = [
	"fuck",
	"shit",
	"bitch",
	"cunt",
	"dick",
	"cock",
	"pussy",
	"porn",
	"hentai",
	"rape",
	"nude",
	"penis",
	"vagina",
	"slut",
	"whore",
	"nigger",
	"nigga",
	"faggot",
	"anal",
	"boob",
	"sex",
	"xxx"
];
function decompose(text) {
	let out = "";
	for (const ch of text) {
		const code = ch.codePointAt(0) ?? 0;
		if (code < 44032 || code > 55203) {
			out += ch;
			continue;
		}
		const n = code - 44032;
		out += CHO[Math.floor(n / 588)] ?? "";
		out += JUNG[Math.floor(n % 588 / 28)] ?? "";
		out += JONG[n % 28] ?? "";
	}
	return out;
}
function foldLatin(text) {
	return text.toLowerCase().replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e").replace(/4/g, "a").replace(/5/g, "s").replace(/[@$]/g, "a");
}
function screenName(raw) {
	const name = raw.trim().replace(/\s+/g, " ");
	const letters = [...name];
	if (letters.length < 1 || letters.length > 10) return {
		ok: false,
		reason: "length"
	};
	if (!/^[\p{Script=Hangul}A-Za-z0-9 ]+$/u.test(name)) return {
		ok: false,
		reason: "chars"
	};
	const compact = name.replace(/ /g, "").toLowerCase();
	const jamo = decompose(compact);
	const folded = foldLatin(compact);
	const hangulHay = `${compact}\n${jamo}`;
	if (HANGUL.some((word) => hangulHay.includes(word) || jamo.includes(decompose(word)))) return {
		ok: false,
		reason: "banned"
	};
	if (LATIN.some((word) => folded.includes(word))) return {
		ok: false,
		reason: "banned"
	};
	return {
		ok: true,
		name
	};
}
function nameError(reason) {
	if (reason === "length") return "이름은 1자에서 10자까지입니다.";
	if (reason === "chars") return "한글, 영문, 숫자만 쓸 수 있습니다.";
	return "그 이름은 쓸 수 없습니다.";
}
//#endregion
export { screenName as n, nameError as t };
