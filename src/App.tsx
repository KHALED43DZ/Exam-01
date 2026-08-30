import { useEffect, useMemo, useState } from "react";
import { FileDown, Save, Plus, Printer, WifiOff, CheckCircle2, AlertTriangle } from "lucide-react";
import { db } from "./db";
import type { Exam, Question, QuestionType, QuranAyah } from "./types";
import QuranDialog from "./components/QuranDialog";
import QuestionEditor from "./components/QuestionEditor";
import Preview from "./components/Preview";

const uid = () => crypto.randomUUID();

const blankExam: Exam = {
  institution: "",
  subject: "العلوم الإسلامية",
  level: "الثالثة ثانوي",
  duration: "ساعتان",
  teacher: "",
  title: "اختبار الفصل",
  questions: [],
  updatedAt: Date.now()
};

export default function App() {
  const [exam, setExam] = useState<Exam>(blankExam);
  const [quranOpen, setQuranOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on = () => setOffline(false), off = () => setOffline(true);
    addEventListener("online", on); addEventListener("offline", off);
    db.exams.orderBy("updatedAt").last().then(last => { if (last) setExam(last); });
    return () => { removeEventListener("online", on); removeEventListener("offline", off); };
  }, []);

  const total = useMemo(() => exam.questions.reduce((s, q) => s + Number(q.points || 0), 0), [exam.questions]);
  const statusOk = total === 20;

  function update(p: Partial<Exam>) { setExam(e => ({...e, ...p, updatedAt: Date.now()})); setSaved(false); }

  function add(type: QuestionType) {
    const q: Question = {
      id: uid(), type, title: type === "integration" ? "وضعية إدماجية" : type === "matching" ? "سؤال ربط" : "سؤال جديد",
      prompt: "", points: type === "integration" ? 6 : 2,
      options: type === "mcq" ? ["", "", ""] : undefined
    };
    update({questions: [...exam.questions, q]});
  }

  function updateQ(id: string, q: Question) {
    update({questions: exam.questions.map(x => x.id === id ? q : x)});
  }

  async function save() {
    const id = await db.exams.put({...exam, id: exam.id});
    setExam(e => ({...e, id}));
    setSaved(true);
  }

  function print() { window.print(); }

  function exportHtml() {
    const blob = new Blob([document.documentElement.outerHTML], {type: "text/html;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "اختبار.html"; a.click();
    URL.revokeObjectURL(url);
  }

  function insertQuran(ayah: QuranAyah, riwayah: "hafs" | "warsh") {
    add("quran");
    setExam(e => {
      const qs = [...e.questions];
      qs[qs.length - 1] = {
        id: qs[qs.length - 1].id,
        type: "quran",
        title: "آية قرآنية",
        prompt: "اقرأ الآية ثم أجب:",
        points: 2,
        quran: { ayahId: ayah.id, surahName: ayah.surahName, ayahNumber: ayah.ayahNumber, text: ayah.uthmani, riwayah }
      };
      return {...e, questions: qs, updatedAt: Date.now()};
    });
    setQuranOpen(false);
  }

  return <div className="app" dir="rtl">
    <header className="topbar">
      <div>
        <div className="brand">منشئ الاختبارات</div>
        <div className="subtitle">أداة PWA للمعلمين — A4 / RTL / Offline</div>
      </div>
      <div className="top-actions">
        {offline && <span className="offline"><WifiOff size={16}/> دون اتصال</span>}
        {saved && <span className="saved"><CheckCircle2 size={16}/> محفوظ</span>}
        <button onClick={save}><Save size={17}/> حفظ</button>
        <button onClick={print}><Printer size={17}/> طباعة / PDF</button>
      </div>
    </header>

    <div className="workspace">
      <aside className="sidebar">
        <h2>بيانات الاختبار</h2>
        <input value={exam.institution} onChange={e => update({institution:e.target.value})} placeholder="اسم المؤسسة"/>
        <input value={exam.subject} onChange={e => update({subject:e.target.value})} placeholder="المادة"/>
        <input value={exam.level} onChange={e => update({level:e.target.value})} placeholder="المستوى"/>
        <input value={exam.duration} onChange={e => update({duration:e.target.value})} placeholder="المدة"/>
        <input value={exam.teacher} onChange={e => update({teacher:e.target.value})} placeholder="اسم الأستاذ"/>
        <input value={exam.title} onChange={e => update({title:e.target.value})} placeholder="عنوان الاختبار"/>

        <h2 className="mt">إضافة سؤال</h2>
        <div className="button-grid">
          <button onClick={() => add("text")}><Plus/> سؤال نصي</button>
          <button onClick={() => add("mcq")}><Plus/> اختيار متعدد</button>
          <button onClick={() => add("matching")}><Plus/> ربط</button>
          <button onClick={() => add("integration")}><Plus/> وضعية إدماجية</button>
          <button className="quran-button" onClick={() => setQuranOpen(true)}><Plus/> آية موثقة</button>
        </div>

        <div className={`total-box ${statusOk ? "ok" : "warn"}`}>
          {statusOk ? <CheckCircle2/> : <AlertTriangle/>}
          <span>مجموع النقاط: <b>{total}</b> / 20</span>
        </div>

        <button className="secondary full" onClick={exportHtml}><FileDown size={17}/> تصدير نسخة HTML</button>
      </aside>

      <section className="editor">
        <div className="section-title">
          <div><h2>بناء الأسئلة</h2><span>تُحفظ المسودة محليًا على الجهاز.</span></div>
          <span>{exam.questions.length} سؤال</span>
        </div>
        {exam.questions.length === 0 && <div className="empty">أضف أول سؤال من القائمة.</div>}
        {exam.questions.map(q => <QuestionEditor key={q.id} q={q}
          onChange={newQ => updateQ(q.id,newQ)}
          onDelete={() => update({questions: exam.questions.filter(x => x.id !== q.id)})}
        />)}
      </section>

      <section className="preview-panel">
        <div className="preview-title"><h2>معاينة A4</h2><span>الطباعة تستخدم مقاس A4 الحقيقي.</span></div>
        <Preview exam={exam}/>
      </section>
    </div>

    {quranOpen && <QuranDialog onClose={() => setQuranOpen(false)} onInsert={insertQuran}/>}
  </div>
}