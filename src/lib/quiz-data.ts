import { EXTRA_QUESTIONS } from "./quiz-extra";

export const QUESTION_COUNT = 10;
export const TIME_LIMIT = 20;

export type CourseId = "intro" | "hashira" | "infinity";

export type Question = {
  id: string;
  course: CourseId;
  prompt: string;
  choices: string[];
  answer: number;
  explain: string;
};

export type CourseMeta = {
  id: CourseId;
  seal: string;
  title: string;
  scope: string;
  spoiler: string | null;
};

export const COURSES: CourseMeta[] = [
  {
    id: "intro",
    seal: "選",
    title: "최종 선별",
    scope: "1기. 가족, 호흡의 시작, 최종 선별, 나타구모산, 기둥 회의까지.",
    spoiler: null,
  },
  {
    id: "hashira",
    seal: "柱",
    title: "기둥 실전",
    scope: "무한열차·유곽·도공 마을·합동 강화 훈련. 그 전투의 결과를 포함합니다.",
    spoiler: "2–4기",
  },
  {
    id: "infinity",
    seal: "城",
    title: "무한성",
    scope: "무한성에서 해가 뜨기까지. 만화 완결의 결말을 묻습니다.",
    spoiler: "완결",
  },
];

export const QUESTIONS: Question[] = [
  {
    id: "intro-hero",
    course: "intro",
    prompt: "혈귀가 된 동생을 인간으로 되돌리려고 귀살대에 들어간 소년은?",
    choices: ["카마도 탄지로", "아가츠마 젠이츠", "하시비라 이노스케", "토미오카 기유"],
    answer: 0,
    explain: "탄지로는 숯을 팔러 간 사이 가족을 잃고, 네즈코를 되돌리기 위해 귀살대의 길을 걷는다.",
  },
  {
    id: "intro-fate",
    course: "intro",
    prompt: "이야기가 시작될 때 탄지로의 집에 닥친 일은?",
    choices: [
      "도공에게 집을 빼앗겼다",
      "혈귀가 가족을 죽이고 네즈코만 혈귀가 되었다",
      "마을이 탄지로를 산에서 쫓아냈다",
      "등나무 독으로 식구가 잠들었다",
    ],
    answer: 1,
    explain: "탄지로가 자리를 비운 밤, 혈귀가 가족을 죽이고 여동생 네즈코를 혈귀로 만들었다.",
  },
  {
    id: "intro-bamboo",
    course: "intro",
    prompt: "혈귀가 된 네즈코가 사람을 물지 않으려고 입에 문 것은?",
    choices: ["대나무", "부적", "등나무 가지", "일륜도 고리"],
    answer: 0,
    explain: "네즈코는 대나무 재갈을 문다. 우로코다키의 암시와 본인의 의지로 인간을 해치지 않으려 한다.",
  },
  {
    id: "intro-giyu",
    course: "intro",
    prompt: "네즈코가 탄지로를 감싸는 것을 보고, 둘을 스승에게 보낸 수주는?",
    choices: ["렌고쿠 쿄쥬로", "코쵸 시노부", "토미오카 기유", "우즈이 텐겐"],
    answer: 2,
    explain: "물의 기둥 토미오카 기유가 두 사람을 전 수주 우로코다키 사콘지에게 보낸다.",
  },
  {
    id: "intro-teacher",
    course: "intro",
    prompt: "사기리 산에서 탄지로에게 물의 호흡을 가르친 전 기둥은?",
    choices: ["우로코다키 사콘지", "쿠와지마 지고로", "히메지마 교메이", "코쵸 카나에"],
    answer: 0,
    explain: "우로코다키 사콘지는 은퇴한 물의 기둥이다. 여우 가면을 쓴 제자들을 길러 왔다.",
  },
  {
    id: "intro-days",
    course: "intro",
    prompt: "귀살대 입대 시험, 최종 선별에서 살아남아야 하는 기간은?",
    choices: ["하룻밤", "사흘", "이레 (7일)", "한 달"],
    answer: 2,
    explain: "최종 선별은 혈귀가 있는 산에서 7일을 버티는 시험이다. 살아남은 사람만 대원이 된다.",
  },
  {
    id: "intro-mountain",
    course: "intro",
    prompt: "최종 선별이 열리는 산은?",
    choices: ["사기리 산", "나타구모 산", "후지카사네 산", "쿠모토리 산"],
    answer: 2,
    explain: "후지카사네 산은 등나무가 혈귀를 가둬 두는 시험장이다. 사기리 산은 우로코다키의 수련지다.",
  },
  {
    id: "intro-flower",
    course: "intro",
    prompt: "혈귀가 꺼려, 최종 선별과 귀살대에서 울타리처럼 쓰이는 꽃은?",
    choices: ["벚꽃", "등나무꽃", "국화", "푸른 거미 백합"],
    answer: 1,
    explain: "등나무는 혈귀가 싫어하는 꽃이다. 푸른 거미 백합은 그와 다른, 무잔이 찾는 전설의 꽃이다.",
  },
  {
    id: "intro-rank",
    course: "intro",
    prompt: "최종 선별을 막 통과한 대원에게 주는 가장 낮은 계급은?",
    choices: ["갑 (키노에)", "기둥", "계 (미즈노토)", "병 (히노에)"],
    answer: 2,
    explain: "귀살대 계급은 계에서 갑까지 열 단계다. 신입은 가장 아래인 계, 미즈노토다.",
  },
  {
    id: "intro-sabito",
    course: "intro",
    prompt: "여우 가면을 쓰고 탄지로의 검을 거듭 쳐 내며 단련시킨 소년은?",
    choices: ["마코모", "사비토", "겐야", "무라타"],
    answer: 1,
    explain: "사비토는 우로코다키의 제자로, 최종 선별에서 손 혈귀에게 죽었다. 마코모도 그 제자다.",
  },
  {
    id: "intro-thunder",
    course: "intro",
    prompt: "아가츠마 젠이츠가 구사하는 호흡은?",
    choices: ["바람의 호흡", "짐승의 호흡", "번개의 호흡", "안개의 호흡"],
    answer: 2,
    explain: "젠이츠는 번개의 호흡을 쓴다. 극도로 무서워지면 의식을 잃고, 그 상태에서 실력이 나온다.",
  },
  {
    id: "intro-hearing",
    course: "intro",
    prompt: "젠이츠가 사람과 혈귀의 상태를 가릴 때 쓰는 특출한 감각은?",
    choices: ["후각", "청각", "미각", "촉각"],
    answer: 1,
    explain: "젠이츠는 청각이 매우 예리하다. 소리만으로 위치와 속마음을 분간한다.",
  },
  {
    id: "intro-beast",
    course: "intro",
    prompt: "하시비라 이노스케가 스스로 만들어 쓰는 호흡은?",
    choices: ["짐승의 호흡", "뱀의 호흡", "바위의 호흡", "꽃의 호흡"],
    answer: 0,
    explain: "짐승의 호흡은 사조에게 배운 형이 아니다. 이노스케가 산속에서 스스로 만든 호흡이다.",
  },
  {
    id: "intro-boar",
    course: "intro",
    prompt: "이노스케가 얼굴을 가리려고 늘 쓰는 것은?",
    choices: ["여우 가면", "멧돼지 머리", "나비 머리장식", "흰 뱀"],
    answer: 1,
    explain: "이노스케는 자신을 키운 멧돼지의 가죽을 쓰고, 톱니처럼 이가 빠진 쌍검으로 싸운다.",
  },
  {
    id: "intro-smell",
    course: "intro",
    prompt: "탄지로가 혈귀의 빈틈을 알아챌 때 내세우는 감각은?",
    choices: ["청각", "시력", "후각", "미각"],
    answer: 2,
    explain: "탄지로는 후각이 뛰어나다. 미국 공식 소개에도 물의 호흡, 히노카미 카구라와 함께 이 후각이 적혀 있다.",
  },
  {
    id: "intro-rui",
    course: "intro",
    prompt: "나타구모산 거미 가족을 이끌던 루이의 직위는?",
    choices: ["하현의 오", "하현의 일", "상현의 육", "전 기둥"],
    answer: 0,
    explain: "루이는 하현의 오다. 실로 산을 영역 삼았고, 탄지로와 기유에게 쓰러진다.",
  },
  {
    id: "intro-kyogai",
    course: "intro",
    prompt: "북으로 저택의 방을 뒤집던 쿄가이의 과거 직위는?",
    choices: ["현역 상현의 육", "숫자가 지워진 전 하현의 육", "귀살대 당주", "도공 마을 수장"],
    answer: 1,
    explain: "쿄가이는 하현의 육이었으나 무잔에게 직위를 빼앗겼다. 몸에 붙은 북으로 방을 돌린다.",
  },
  {
    id: "intro-crow",
    course: "intro",
    prompt: "귀살대원에게 임무를 전하는 까마귀를 무엇이라 부르나?",
    choices: ["카스가이 까마귀", "십이귀월", "히노카미", "일륜조"],
    answer: 0,
    explain: "카스가이 까마귀가 명령을 전한다. 젠이츠에게만은 까마귀 대신 참새 춘타로가 따라붙었다.",
  },
  {
    id: "intro-sparrow",
    course: "intro",
    prompt: "젠이츠에게 배정된 전령 새는 까마귀가 아니다. 무엇으로 나왔나?",
    choices: ["참새", "제비", "부엉이", "비둘기"],
    answer: 0,
    explain: "다른 대원은 카스가이 까마귀를 받지만, 젠이츠의 새는 참새다. 이름은 춘타로다.",
  },
  {
    id: "intro-sword",
    course: "intro",
    prompt: "혈귀의 목을 베도록 만들어진, 사용자에 따라 색이 달라지는 검은?",
    choices: ["일륜도", "목검", "철퇴", "쿠나이"],
    answer: 0,
    explain: "일륜도는 벤 자리가 혈귀처럼 재생되지 않게 하는 귀살대의 검이다. 색은 쓰는 사람에 따라 드러난다.",
  },
  {
    id: "intro-black",
    course: "intro",
    prompt: "탄지로의 첫 일륜도는 완성 직후 어떻게 보였나?",
    choices: ["선명한 적색", "물빛 파랑", "색이 거의 없는 흑도", "벚꽃색"],
    answer: 2,
    explain: "탄지로의 도는 검은빛에 가깝게 나왔다. 희귀한 흑도로, 도공은 색이 드러나기를 기다린다.",
  },
  {
    id: "intro-author",
    course: "intro",
    prompt: "『귀멸의 칼날』을 쓰고 그린 작가는?",
    choices: ["고토게 코요하루", "토가시 요시히로", "아라카와 히로무", "이시다 스이"],
    answer: 0,
    explain: "고토게 코요하루의 만화는 주간 소년 점프에 2016년 2월부터 2020년 5월까지 연재되었다.",
  },
  {
    id: "intro-studio",
    course: "intro",
    prompt: "TV 애니메이션 『귀멸의 칼날』을 만든 스튜디오는?",
    choices: ["유포테이블", "본즈", "매드하우스", "선라이즈"],
    answer: 0,
    explain: "애니메이션은 유포테이블 작품이다. 공식 포털 kimetsu.com과 미국 공식 사이트가 그 이름으로 소개한다.",
  },
  {
    id: "intro-box",
    course: "intro",
    prompt: "햇빛을 피해야 하는 네즈코를 낮에 옮기려고 탄지로가 등에 지는 것은?",
    choices: ["나무 상자", "가마", "철창", "우산"],
    answer: 0,
    explain: "우로코다키가 마련한 상자에 네즈코를 넣고 이동한다. 네즈코는 그 안에서 자며 힘을 회복한다.",
  },
  {
    id: "intro-tamayo",
    course: "intro",
    prompt: "아사쿠사에서 탄지로와 손잡고, 혈귀를 인간으로 되돌릴 약을 연구하는 여의사는?",
    choices: ["타마요", "코쵸 시노부", "카마도 네즈코", "칸자키 아오이"],
    answer: 0,
    explain: "타마요는 무잔에게서 벗어난 혈귀다. 조수 유시로와 함께 인간으로 돌아가는 약을 연구한다.",
  },
  {
    id: "intro-muzan",
    course: "intro",
    prompt: "아사쿠사 한낮의 거리에서 탄지로가 마주친 혈귀의 시조는?",
    choices: ["키부츠지 무잔", "루이", "쿄가이", "손 혈귀"],
    answer: 0,
    explain: "키부츠지 무잔은 모든 혈귀의 근원이다. 번화가에서는 인간 가족처럼 꾸미고 다닌다.",
  },
  {
    id: "intro-kanao",
    course: "intro",
    prompt: "나비 저택에서 결정을 동전 던지기에 맡기던 소녀 검사의 이름은?",
    choices: ["츠유리 카나오", "칸자키 아오이", "칸로지 미츠리", "코쵸 카나에"],
    answer: 0,
    explain: "카나오는 코쵸 자매에게 거둬진 검사다. 꽃의 호흡을 익히기 전, 동전으로 행동을 정했다.",
  },
  {
    id: "intro-charcoal",
    course: "intro",
    prompt: "혈귀에게 습격당하기 전, 탄지로 집안이 산에서 해 오던 일은?",
    choices: ["숯 장사", "도검 제작", "닌자 임무", "기차 승무"],
    answer: 0,
    explain: "탄지로는 숯을 구워 마을에 팔러 다녔다. 그 사이 집에 혈귀가 들었다.",
  },

  {
    id: "hashira-title",
    course: "hashira",
    prompt: "귀살대에서 가장 높은 검사에게 붙는 호칭은?",
    choices: ["기둥", "상현", "당주", "카스가이"],
    answer: 0,
    explain: "기둥은 귀살대 최상위 검사다. 공식 기둥전은 수·염·음·하·충·연·사·풍·암 아홉 이름을 한자리에 놓는다.",
  },
  {
    id: "hashira-nine",
    course: "hashira",
    prompt: "수주·염주·음주·하주·충주·연주·사주·풍주·암주로 꼽는 기둥은 모두 몇 명인가?",
    choices: ["일곱", "아홉", "열두", "넷"],
    answer: 1,
    explain: "이 호칭으로 소개되는 기둥은 아홉이다. 염주 렌고쿠가 죽은 뒤 현역 수는 그만큼 줄어든다.",
  },
  {
    id: "hashira-water",
    course: "hashira",
    prompt: "이야기가 본편에 들어선 뒤의 물의 기둥(수주)은?",
    choices: ["토미오카 기유", "우로코다키 사콘지", "시나즈가와 사네미", "토키토 무이치로"],
    answer: 0,
    explain: "현 수주는 토미오카 기유다. 우로코다키 사콘지는 그 전 세대의 물의 기둥이다.",
  },
  {
    id: "hashira-flame-fight",
    course: "hashira",
    prompt: "무한열차에서 불의 기둥 렌고쿠 쿄쥬로가 맞선 상현은?",
    choices: ["상현의 삼 아카자", "하현의 오 루이", "상현의 오 교코", "하현의 일 엔무"],
    answer: 0,
    explain: "아카자는 상현의 삼이다. 렌고쿠는 탄지로 일행을 지킨 뒤 이 싸움에서 죽는다.",
  },
  {
    id: "hashira-enmu",
    course: "hashira",
    prompt: "무한열차에 깃든 하현의 일, 엔무의 혈귀술은?",
    choices: ["꿈", "실", "항아리", "북"],
    answer: 0,
    explain: "엔무는 잠든 사람을 꿈속에 가둔다. 열차와 하나가 되어 승객을 노렸다.",
  },
  {
    id: "hashira-ablaze",
    course: "hashira",
    prompt: "렌고쿠가 탄지로에게 남긴 말로 알려진 구절은?",
    choices: ["마음을 불태워라", "반짝이는 것이 최선이다", "규칙은 칼보다 세다", "냄새를 따라라"],
    answer: 0,
    explain: "『마음을 불태워라』는 렌고쿠가 남긴 말이다. 탄지로는 이후 전투에서 이 말을 되뇐다.",
  },
  {
    id: "hashira-upper6",
    course: "hashira",
    prompt: "유곽에서 음주 우즈이 텐겐이 상대하던 상현의 육은?",
    choices: ["다키와 규타로", "한텐구와 교코", "아카자와 엔무", "루이와 쿄가이"],
    answer: 0,
    explain: "상현의 육은 남매 다키와 규타로가 한 자리를 나눈다. 형의 이름인 규타로가 그 자리의 본체다.",
  },
  {
    id: "hashira-retire",
    course: "hashira",
    prompt: "유곽 전투 뒤 텐겐이 현역 기둥에서 물러나게 된 계기로 작품이 보여주는 것은?",
    choices: ["왼손과 왼눈을 잃은 부상", "당주에게 파면당함", "혈귀가 되기로 함", "도공으로 전업"],
    answer: 0,
    explain: "텐겐은 규타로와의 싸움에서 왼손과 왼눈을 잃고, 세 아내와 함께 전선을 떠난다.",
  },
  {
    id: "hashira-wives",
    course: "hashira",
    prompt: "텐겐과 함께 유곽에 잠입한 아내는 몇 명인가?",
    choices: ["한 명", "두 명", "세 명", "다섯 명"],
    answer: 2,
    explain: "쿠노이치 출신의 히나츠루, 마키오, 스마가 텐겐과 함께 움직인다.",
  },
  {
    id: "hashira-shinobu",
    course: "hashira",
    prompt: "벌레의 기둥 코쵸 시노부가 독을 무기로 삼는 까닭은?",
    choices: [
      "완력이 모자라 혈귀의 목을 벨 수 없어서",
      "일륜도를 분실해서",
      "물의 호흡이 금지되어서",
      "눈이 보이지 않아서",
    ],
    answer: 0,
    explain: "시노부의 검은 목을 자르기보다 독을 넣도록 가늘다. 벌레의 호흡은 그 한계에서 나왔다.",
  },
  {
    id: "hashira-love-origin",
    course: "hashira",
    prompt: "칸로지 미츠리의 사랑의 호흡은 무엇에서 갈라져 나왔나?",
    choices: ["불의 호흡", "물의 호흡", "번개의 호흡", "바위의 호흡"],
    answer: 0,
    explain: "미츠리는 렌고쿠 밑에서 불의 호흡을 배우다, 자기 몸에 맞게 사랑의 호흡으로 바꿨다.",
  },
  {
    id: "hashira-hair",
    course: "hashira",
    prompt: "미츠리의 머리가 분홍과 연두로 나뉜 식습관 쪽 계기는?",
    choices: ["사쿠라모치를 많이 먹었다", "혈귀를 먹었다", "등나무 독을 마셨다", "머리염색을 했다"],
    answer: 0,
    explain: "공식 설정에서 미츠리는 힘을 내려고 사쿠라모치를 계속 먹었고, 그 뒤 머리색이 갈라졌다.",
  },
  {
    id: "hashira-gyomei",
    course: "hashira",
    prompt: "기둥들 사이에서 최강으로 꼽히는 바위의 기둥은?",
    choices: ["히메지마 교메이", "이구로 오바나이", "토키토 무이치로", "시나즈가와 사네미"],
    answer: 0,
    explain: "앞이 보이지 않는 교메이는 합동 강화 훈련에서 최강으로 대우받는 바위의 기둥이다.",
  },
  {
    id: "hashira-weapon",
    course: "hashira",
    prompt: "히메지마 교메이가 쓰는 무기의 조합은?",
    choices: ["쇠사슬로 이은 도끼와 철퇴", "톱니 쌍검", "독침 같은 세검", "대형 쿠나이"],
    answer: 0,
    explain: "교메이는 도끼와 철퇴를 쇠사슬로 잇고, 염주와 청각으로 상대의 위치를 잡는다.",
  },
  {
    id: "hashira-young",
    course: "hashira",
    prompt: "안개의 기둥 토키토 무이치로가 기둥 가운데 두드러지는 점은?",
    choices: ["최연소 기둥", "당주의 아들", "전직 혈귀", "참새의 주인"],
    answer: 0,
    explain: "무이치로는 열네 살의 안개의 기둥으로, 현역 기둥 가운데 가장 어리다.",
  },
  {
    id: "hashira-snake",
    course: "hashira",
    prompt: "뱀의 기둥 이구로 오바나이가 목에 두르는 흰 뱀의 이름은?",
    choices: ["카부라마루", "춘타로", "유시로", "사비토"],
    answer: 0,
    explain: "카부라마루는 오바나이가 늘 함께 두는 흰 뱀이다. 오바나이는 뱀의 호흡을 쓴다.",
  },
  {
    id: "hashira-hinokami",
    course: "hashira",
    prompt: "탄지로가 아버지에게 물려받은 집안의 신년 의식 춤은?",
    choices: ["히노카미 카구라", "카스가이 무", "등나무 춤", "음률 점수"],
    answer: 0,
    explain: "히노카미 카구라는 카마도 가문이 해마다 추던 춤이다. 탄지로는 이를 검의 형으로 되살린다.",
  },
  {
    id: "hashira-sun",
    course: "hashira",
    prompt: "도공 마을 전투가 끝난 뒤, 네즈코가 타지 않고 견뎌 낸 것은?",
    choices: ["햇빛", "무한열차의 꿈", "최종 선별의 이레", "등나무 독무"],
    answer: 0,
    explain: "도공 마을 편 끝에 네즈코는 햇볕 아래서도 불타지 않는다. 그 뒤로 무잔의 표적이 된다.",
  },
  {
    id: "hashira-smith",
    course: "hashira",
    prompt: "탄지로의 일륜도를 만들고 고치는 성마른 도공은?",
    choices: ["하가네즈카 호타루", "테치카와하라 텟친", "칸자키 아오이", "우로코다키 사콘지"],
    answer: 0,
    explain: "호타루 하가네즈카가 탄지로의 도를 벼린다. 텟친 테치카와하라는 도공 마을의 우두머리다.",
  },
  {
    id: "hashira-village",
    course: "hashira",
    prompt: "도공 마을을 습격한 상현의 사와 상현의 오는?",
    choices: ["한텐구와 교코", "다키와 규타로", "아카자와 엔무", "루이와 쿄가이"],
    answer: 0,
    explain: "상현의 사 한텐구는 감정의 분신으로 갈라지고, 상현의 오 교코는 항아리 혈귀술을 쓴다.",
  },
  {
    id: "hashira-leader",
    course: "hashira",
    prompt: "귀살대 당주의 이름은?",
    choices: ["우부야시키 카가야", "쿠와지마 지고로", "하가네즈카 호타루", "키부츠지 무잔"],
    answer: 0,
    explain: "우부야시키 카가야는 젊은 나이에 세상을 뜨는 가문의 당주로, 기둥들에게 명령을 내린다.",
  },
  {
    id: "hashira-genya",
    course: "hashira",
    prompt: "바람의 기둥 사네미의 동생으로, 혈귀의 살을 먹어 힘을 빌리는 대원은?",
    choices: ["시나즈가와 겐야", "아가츠마 젠이츠", "하시비라 이노스케", "토키토 무이치로"],
    answer: 0,
    explain: "겐야는 호흡을 제대로 쓰지 못한다. 대신 혈귀를 먹으면 잠시 그 힘을 끌어 쓴다.",
  },
  {
    id: "hashira-flash",
    course: "hashira",
    prompt: "젠이츠가 오래도록 유일하게 써 온 번개의 호흡 제1형은?",
    choices: ["벽력일섬", "노기", "삼층 찌르기", "안개비"],
    answer: 0,
    explain: "제1형 벽력일섬은 번개를 본뜬 발도술이다. 젠이츠는 겁에 질려 잠든 채 이 형을 펼친다.",
  },
  {
    id: "hashira-training",
    course: "hashira",
    prompt: "네즈코가 햇빛을 이긴 뒤, 기둥들이 전 대원을 모아 연 수련의 이름은?",
    choices: ["기둥 합동 강화 훈련", "최종 선별", "도공 시합", "등나무 제"],
    answer: 0,
    explain: "기둥 합동 강화 훈련은 대원들이 기둥을 돌며 바닥을 끌어올리는 수련이다. 애니 4기의 제목이기도 하다.",
  },
  {
    id: "hashira-love",
    course: "hashira",
    prompt: "사랑의 기둥은 누구인가?",
    choices: ["칸로지 미츠리", "코쵸 시노부", "코쵸 카나에", "츠유리 카나오"],
    answer: 0,
    explain: "미츠리 칸로지가 사랑의 기둥이다. 카나에는 이미 세상을 떠난 꽃의 기둥이다.",
  },
  {
    id: "hashira-wind",
    course: "hashira",
    prompt: "바람의 기둥은 누구인가?",
    choices: ["시나즈가와 사네미", "이구로 오바나이", "토미오카 기유", "우즈이 텐겐"],
    answer: 0,
    explain: "사네미 시나즈가와가 바람의 기둥이다. 오바나이는 뱀, 기유는 물, 텐겐은 소리의 기둥이다.",
  },
  {
    id: "hashira-insect",
    course: "hashira",
    prompt: "벌레의 기둥은 누구인가?",
    choices: ["코쵸 시노부", "코쵸 카나에", "칸로지 미츠리", "칸자키 아오이"],
    answer: 0,
    explain: "시노부 코쵸가 벌레의 기둥이다. 나비 저택에서 다친 대원을 돌리는 일도 맡는다.",
  },
  {
    id: "hashira-eyes",
    course: "hashira",
    prompt: "상현의 눈에는 하현과 달리 무엇이 새겨지나?",
    choices: [
      "한쪽에는 숫자, 다른 쪽에는 「상현」",
      "양쪽 다 당주의 문장",
      "아무것도 새기지 않는다",
      "일륜도의 색깔",
    ],
    answer: 0,
    explain: "하현은 한쪽 눈에 직위가 새겨진다. 상현은 한쪽 눈에 숫자, 다른 쪽 눈에 상현이라는 글자가 있다.",
  },
  {
    id: "hashira-sound",
    course: "hashira",
    prompt: "소리의 기둥(음주)은 누구인가?",
    choices: ["우즈이 텐겐", "토키토 무이치로", "아가츠마 젠이츠", "히메지마 교메이"],
    answer: 0,
    explain: "우즈이 텐겐이 소리의 호흡을 쓰는 음주다. 무이치로는 안개, 교메이는 바위의 기둥이다.",
  },

  {
    id: "inf-upper1",
    course: "infinity",
    prompt: "상현의 일은 누구인가?",
    choices: ["코쿠시보", "도우마", "아카자", "한텐구"],
    answer: 0,
    explain: "코쿠시보는 상현의 일이자 무잔 바로 아래의 혈귀다. 달의 호흡을 쓴다.",
  },
  {
    id: "inf-yoriichi",
    course: "infinity",
    prompt: "해의 호흡을 처음 만든 검객은?",
    choices: ["츠기쿠니 요리이치", "카마도 탄쥬로", "우로코다키 사콘지", "렌고쿠 신쥬로"],
    answer: 0,
    explain: "츠기쿠니 요리이치가 해의 호흡의 시조다. 카마도 집의 히노카미 카구라는 그 형이 춤으로 남은 것이다.",
  },
  {
    id: "inf-twins",
    course: "infinity",
    prompt: "코쿠시보가 인간이던 때, 요리이치와 어떤 사이였나?",
    choices: ["쌍둥이 형제", "사제", "부자", "서로 모르는 도공"],
    answer: 0,
    explain: "코쿠시보의 인간 시절 이름은 츠기쿠니 미치카츠다. 요리이치와 쌍둥이다.",
  },
  {
    id: "inf-doma",
    course: "infinity",
    prompt: "상현의 이 도우마를 쓰러뜨리려고 시노부가 제 몸에 준비해 둔 것은?",
    choices: ["치사량의 등나무 독", "해의 호흡 검무", "기차를 세우는 장치", "까마귀 떼"],
    answer: 0,
    explain: "시노부는 목을 베기 어려운 몸 대신, 자신을 등나무 독으로 채워 도우마가 흡수하게 했다.",
  },
  {
    id: "inf-nakime",
    course: "infinity",
    prompt: "비파로 무한성의 방을 옮기던 나키메가 한텐구 사후 받은 직위는?",
    choices: ["상현의 사", "하현의 일", "상현의 일", "기둥"],
    answer: 0,
    explain: "나키메는 무한성을 조종하던 혈귀다. 한텐구가 죽은 뒤 상현의 사로 올라간다.",
  },
  {
    id: "inf-kaigaku",
    course: "infinity",
    prompt: "젠이츠의 선배로, 혈귀가 되어 상현의 육이 된 인물은?",
    choices: ["카이가쿠", "겐야", "사비토", "무이치로"],
    answer: 0,
    explain: "카이가쿠는 지고로의 제자였으나 코쿠시보의 피로 혈귀가 되어 상현의 육이 된다.",
  },
  {
    id: "inf-seventh",
    course: "infinity",
    prompt: "카이가쿠전에서 젠이츠가 새로 펼친 번개의 호흡은 제 몇 형인가?",
    choices: ["제7형", "제1형", "제11형", "제3형"],
    answer: 0,
    explain: "제7형 화뢰신은 젠이츠가 만든 형이다. 카이가쿠는 제1형을 하찮게 여겨 익히지 않았다.",
  },
  {
    id: "inf-nagi",
    course: "infinity",
    prompt: "기유가 물의 호흡에 더해 스스로 만든 제11형의 이름은?",
    choices: ["노기", "벽력일섬", "화뢰신", "안개비"],
    answer: 0,
    explain: "제11형 노기(凪)는 기유만의 형이다. 움직임을 지운 뒤 일격에 모은다.",
  },
  {
    id: "inf-survivors",
    course: "infinity",
    prompt: "무잔과의 최종 결전에 선 현역 기둥 가운데, 뒤에 살아남은 둘은?",
    choices: ["기유와 사네미", "시노부와 미츠리", "무이치로와 교메이", "오바나이와 텐겐"],
    answer: 0,
    explain: "그 결전의 기둥 중 토미오카 기유와 시나즈가와 사네미가 살아남는다. 텐겐은 그 전에 은퇴했다.",
  },
  {
    id: "inf-demon",
    course: "infinity",
    prompt: "해가 뜨기 직전, 무잔을 끝내려다 탄지로에게 닥친 일은?",
    choices: ["잠시 혈귀가 되었다", "그 자리에서 기둥에 임명되었다", "기억을 모두 잃었다", "도공으로 전업했다"],
    answer: 0,
    explain: "무잔의 피로 탄지로는 잠시 혈귀가 된다. 동료들과 타마요가 남긴 약으로 인간에 돌아온다.",
  },
  {
    id: "inf-nezuko",
    course: "infinity",
    prompt: "완결에서 네즈코는 어떻게 되나?",
    choices: ["인간으로 돌아온다", "상현의 일이 된다", "무한성에 남는다", "이야기에서 사라진다"],
    answer: 0,
    explain: "네즈코는 인간으로 돌아온다. 시간이 흐른 뒤 젠이츠와 부부가 된 것으로 그려진다.",
  },
  {
    id: "inf-lily",
    course: "infinity",
    prompt: "무잔이 햇빛만 이기면 완전해진다고 믿으며 찾던 꽃은?",
    choices: ["푸른 거미 백합", "등나무", "벚꽃", "국화"],
    answer: 0,
    explain: "푸른 거미 백합은 무잔을 혈귀로 만든 약과 엮인 꽃이다. 그는 이 꽃으로 태양을 극복하려 한다.",
  },
  {
    id: "inf-chapters",
    course: "infinity",
    prompt: "『귀멸의 칼날』 만화는 모두 몇 화를 연재했나?",
    choices: ["205화", "127화", "23화", "366화"],
    answer: 0,
    explain: "2016년 2월부터 2020년 5월까지 주간 소년 점프에 205화가 실렸다.",
  },
  {
    id: "inf-volumes",
    course: "infinity",
    prompt: "그 연재를 묶은 단행본은 몇 권인가?",
    choices: ["23권", "18권", "32권", "9권"],
    answer: 0,
    explain: "점프 코믹스 단행본은 전 23권이다. 205화를 그 권수에 나누어 담았다.",
  },
  {
    id: "inf-mark",
    course: "infinity",
    prompt: "귀살대 문양을 각성한 검사에게 따라온다고 알려진 대가는?",
    choices: ["스물다섯 전에 죽기 쉽다", "청각을 잃는다", "일륜도가 반드시 부러진다", "반드시 혈귀가 된다"],
    answer: 0,
    explain: "문양은 힘을 크게 올리지만, 각성자는 대개 스물다섯을 넘기지 못했다. 태어날 때부터 문양이 있던 요리이치는 예외다.",
  },
  {
    id: "inf-hakuji",
    course: "infinity",
    prompt: "상현의 삼 아카자가 인간이던 시절의 이름은?",
    choices: ["하쿠지", "미치카츠", "카이가쿠", "호타루"],
    answer: 0,
    explain: "아카자의 인간 시절 이름은 하쿠지다. 무한성에서 탄지로·기유와 싸우다 그 기억이 되살아난다.",
  },
  {
    id: "inf-kotoha",
    course: "infinity",
    prompt: "이노스케의 어머니 코토하를 죽인 상현은?",
    choices: ["도우마", "아카자", "교코", "엔무"],
    answer: 0,
    explain: "코토하는 도우마의 교단에 흘러 들어갔다가 죽임을 당한다. 이노스케는 무한성에서 그 사실을 마주한다.",
  },
  {
    id: "inf-dawn",
    course: "infinity",
    prompt: "지상으로 끌려 나온 무잔을 끝내는 결정적인 조건은?",
    choices: ["해가 뜨는 것", "등나무 숲으로 유인하는 것", "열차를 폭파하는 것", "십이귀월의 배신"],
    answer: 0,
    explain: "혈귀는 햇빛을 견디지 못한다. 대원들은 동이 틀 때까지 무잔을 붙들고, 햇빛 속에서 결착이 난다.",
  },
  {
    id: "inf-era",
    course: "infinity",
    prompt: "무잔이 혈귀가 된 시기는 작품에서 대략 언제로 나오나?",
    choices: ["약 천 년 전 헤이안 시대", "다이쇼가 시작된 해", "최종 선별이 생긴 해", "무한열차가 놓인 해"],
    answer: 0,
    explain: "무잔은 헤이안 시대에 병을 고치려다 혈귀가 되었고, 그 뒤로 약 천 년을 살았다.",
  },
  {
    id: "inf-kanao",
    course: "infinity",
    prompt: "다음 중 무한성 결전에서 목숨을 잃지 않은 사람은?",
    choices: ["츠유리 카나오", "토키토 무이치로", "히메지마 교메이", "이구로 오바나이"],
    answer: 0,
    explain: "카나오는 도우마전에서 크게 다치지만 살아남는다. 무이치로, 교메이, 오바나이는 그 결전에서 죽는다.",
  },
  ...EXTRA_QUESTIONS.map((question) => ({
    ...question,
    course: question.course as CourseId,
  })),
];

const seen = new Set<string>();
for (const question of QUESTIONS) {
  if (question.course !== "intro" && question.course !== "hashira" && question.course !== "infinity") {
    throw new Error(`course ${question.id}`);
  }
  if (seen.has(question.id)) throw new Error(`duplicate id ${question.id}`);
  seen.add(question.id);
  if (question.choices.length !== 4) throw new Error(`choices ${question.id}`);
  if (new Set(question.choices).size !== 4) throw new Error(`dup choice ${question.id}`);
  if (question.answer < 0 || question.answer > 3) throw new Error(`answer ${question.id}`);
  if (!question.choices[question.answer]) throw new Error(`blank ${question.id}`);
}

for (const course of COURSES) {
  const n = QUESTIONS.filter((q) => q.course === course.id).length;
  if (n < QUESTION_COUNT) throw new Error(`${course.id} pool ${n}`);
}

export function poolCount(course: CourseId): number {
  return QUESTIONS.filter((q) => q.course === course).length;
}

function shuffleChoices(question: Question): Question {
  const choices = [...question.choices];
  const correct = choices[question.answer];
  if (!correct) throw new Error(question.id);
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = choices[i]!;
    const b = choices[j]!;
    choices[i] = b;
    choices[j] = a;
  }
  return { ...question, choices, answer: choices.indexOf(correct) };
}

export function pickQuestions(course: CourseId, count = QUESTION_COUNT): Question[] {
  const pool = QUESTIONS.filter((q) => q.course === course).map((q) => ({
    ...q,
    choices: [...q.choices],
  }));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = pool[i]!;
    const b = pool[j]!;
    pool[i] = b;
    pool[j] = a;
  }
  return pool.slice(0, count).map(shuffleChoices);
}

export function reshuffle(questions: Question[]): Question[] {
  return questions.map((q) => shuffleChoices({ ...q, choices: [...q.choices] }));
}

export type Rank = { seal: string; name: string; reading: string; line: string };

export function rankFor(correct: number, total: number): Rank {
  if (total === QUESTION_COUNT && correct >= 10) {
    return {
      seal: "柱",
      name: "기둥",
      reading: "하시라",
      line: "열 문제를 모두 맞혔습니다. 귀살대 최고의 자리입니다.",
    };
  }
  const ratio = total === 0 ? 0 : correct / total;
  if (ratio >= 0.9) {
    return { seal: "甲", name: "갑", reading: "키노에", line: "기둥 바로 아래. 비운 한 칸만 채우면 됩니다." };
  }
  if (ratio >= 0.8) {
    return { seal: "丙", name: "병", reading: "히노에", line: "전장에 내보낼 실력입니다. 틀린 해설만 다시 보면 됩니다." };
  }
  if (ratio >= 0.6) {
    return { seal: "戊", name: "무", reading: "츠치노에", line: "중견 대원입니다. 해설을 한 번 더 읽으면 금세 올라갑니다." };
  }
  if (ratio >= 0.4) {
    return { seal: "壬", name: "임", reading: "미즈노에", line: "막 이름을 올린 대원입니다. 틀린 문제가 다음 임무입니다." };
  }
  return {
    seal: "癸",
    name: "계",
    reading: "미즈노토",
    line: "최종 선별은 통과했습니다. 아래 해설부터 다시 익히면 됩니다.",
  };
}

export function pointsFor(elapsedSec: number, streak: number, timed: boolean): number {
  const clamped = Math.min(TIME_LIMIT, Math.max(0, elapsedSec));
  const speed = timed ? Math.max(0, Math.round((TIME_LIMIT - clamped) * 4)) : 40;
  const streakBonus = Math.max(0, streak - 1) * 20;
  return 100 + speed + streakBonus;
}

export type BestEntry = {
  score: number;
  correct: number;
  total: number;
  timed: boolean;
  at: number;
};

export type BestMap = Record<CourseId, BestEntry | null>;

const STORAGE_KEY = "kimetsu-mondap-v1";

export function emptyBest(): BestMap {
  return { intro: null, hashira: null, infinity: null };
}

export type SaveShape = { best: BestMap; timed: boolean; sound: boolean };

export function loadSave(): SaveShape {
  const fallback: SaveShape = { best: emptyBest(), timed: true, sound: true };
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<SaveShape>;
    const best = emptyBest();
    for (const course of COURSES) {
      const entry = parsed.best?.[course.id];
      if (entry && typeof entry.score === "number" && typeof entry.correct === "number") {
        best[course.id] = {
          score: entry.score,
          correct: entry.correct,
          total: typeof entry.total === "number" ? entry.total : QUESTION_COUNT,
          timed: Boolean(entry.timed),
          at: typeof entry.at === "number" ? entry.at : 0,
        };
      }
    }
    return {
      best,
      timed: typeof parsed.timed === "boolean" ? parsed.timed : true,
      sound: typeof parsed.sound === "boolean" ? parsed.sound : true,
    };
  } catch {
    return fallback;
  }
}

export function writeSave(save: SaveShape) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
}

export function courseById(id: CourseId): CourseMeta {
  const course = COURSES.find((c) => c.id === id);
  if (!course) throw new Error(id);
  return course;
}
