import type { Question } from "../types";
import { Trash2, GripVertical } from "lucide-react";

export default function QuestionEditor({ q, onChange, onDelete }: {
  q: Question;
  onChange: (q: Question) => void;
  onDelete: () => void;
}) {
  return <div className="question-card">
    <div className="question-top">
      <GripVertical size={18} />
      <strong>{q.type === "quran" ? "آية قرآنية" : q.title}</strong>
      <button className="danger icon-btn" onClick={onDelete}><Trash2 size={17}/></button>
    </div>

    {q.type !== "quran" && <>
      <input value={q.title} onChange={e => onChange({...q, title: e.target.value})} placeholder="عنوان السؤال"/>
      <textarea value={q.prompt} onChange={e => onChange({...q, prompt: e.target.value})} placeholder="نص السؤال"/>
    </>}

    {q.type === "mcq" && <div className="options">
      {(q.options ?? ["", "", ""]).map((o, i) =>
        <input key={i} value={o} onChange={e => {
          const options = [...(q.options ?? [])]; options[i] = e.target.value;
          onChange({...q, options});
        }} placeholder={`الخيار ${i+1}`}/>
      )}
    </div>}

    {q.type === "quran" && q.quran && <div className={`quran-block ${q.quran.riwayah}`}>
      <div className="small">سورة {q.quran.surahName} — الآية {q.quran.ayahNumber} — {q.quran.riwayah === "warsh" ? "ورش" : "حفص"}</div>
      <div className="quran-text">{q.quran.text}</div>
    </div>}

    <div className="points">
      <label>النقطة</label>
      <input type="number" min="0" step="0.25" value={q.points} onChange={e => onChange({...q, points: Number(e.target.value)})}/>
    </div>
  </div>
}