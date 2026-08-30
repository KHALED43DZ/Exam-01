import { useState } from "react";
import type { QuranAyah } from "../types";
import { normalizePastedQuran, searchQuran } from "../quran";

export default function QuranDialog({ onInsert, onClose }: {
  onInsert: (ayah: QuranAyah, riwayah: "hafs" | "warsh") => void;
  onClose: () => void;
}) {
  const [riwayah, setRiwayah] = useState<"hafs" | "warsh">("warsh");
  const [text, setText] = useState("");
  const [results, setResults] = useState<QuranAyah[]>([]);
  const [status, setStatus] = useState("");

  async function find() {
    const q = normalizePastedQuran(text);
    if (!q) return;
    const found = await searchQuran(q, riwayah);
    setResults(found);
    setStatus(found.length ? `تم العثور على ${found.length} نتيجة من قاعدة البيانات المحلية.` :
      "لم يتم العثور على تطابق. أضف بيانات القرآن الرسمية إلى public/quran.");
  }

  return <div className="modal-backdrop">
    <div className="modal" dir="rtl">
      <div className="modal-head">
        <h2>إدراج آية موثقة</h2>
        <button className="icon-btn" onClick={onClose}>×</button>
      </div>

      <div className="notice">
        الآية لا تُعتمد من النص الملصق مباشرة. البحث يطابقها مع قاعدة القرآن المحلية، ثم
        يُدرج النص العثماني المخزن في القاعدة.
      </div>

      <label>الرواية</label>
      <select value={riwayah} onChange={e => setRiwayah(e.target.value as "hafs" | "warsh")}>
        <option value="warsh">ورش عن نافع</option>
        <option value="hafs">حفص عن عاصم</option>
      </select>

      <label>ألصق الآية أو جزءًا منها</label>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onPaste={e => setText(e.clipboardData.getData("text/plain"))}
        placeholder="الصق النص هنا ثم اضغط تحقق..."
      />

      <button className="primary" onClick={find}>تحقق وابحث</button>
      {status && <p className="muted">{status}</p>}

      <div className="results">
        {results.map(r => <button key={r.id} className="quran-result" onClick={() => onInsert(r, riwayah)}>
          <div className="small">سورة {r.surahName} — الآية {r.ayahNumber}</div>
          <div className={`quran-preview ${riwayah}`}>{r.uthmani}</div>
        </button>)}
      </div>
    </div>
  </div>
}