import type { QuranAyah } from "./types";

const stripForSearch = (value: string) =>
  value.normalize("NFC")
    .replace(/[﴿﴾۝۞]/g, " ")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, "")
    .replace(/[إأٱآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ـ/g, "")
    .replace(/\s+/g, " ")
    .trim();

let cache: Record<"hafs" | "warsh", QuranAyah[] | null> = { hafs: null, warsh: null };

export async function loadQuran(riwayah: "hafs" | "warsh"): Promise<QuranAyah[]> {
  if (cache[riwayah]) return cache[riwayah]!;
  try {
    const res = await fetch(`./quran/${riwayah}.json`, { cache: "force-cache" });
    if (!res.ok) throw new Error("Quran data not installed");
    const data = await res.json();
    const rows: QuranAyah[] = Array.isArray(data) ? data : (data.ayahs ?? data.data ?? []);
    cache[riwayah] = rows;
    return rows;
  } catch {
    cache[riwayah] = [];
    return [];
  }
}

export async function searchQuran(query: string, riwayah: "hafs" | "warsh") {
  const rows = await loadQuran(riwayah);
  const q = stripForSearch(query);
  if (!q) return [];
  return rows
    .map((r) => ({ ...r, _score: stripForSearch(r.searchText || r.uthmani).includes(q) ? 2 : 0 }))
    .filter((r) => r._score > 0)
    .slice(0, 20)
    .map(({ _score, ...r }) => r);
}

export function normalizePastedQuran(value: string) {
  return value.normalize("NFC").replace(/[﴿﴾]/g, "").replace(/\s+/g, " ").trim();
}