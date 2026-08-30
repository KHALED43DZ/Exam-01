import type { Exam } from "../types";

export default function Preview({ exam }: { exam: Exam }) {
  return <div className="preview-wrap">
    <div className="a4-page" id="print-page">
      <header className="exam-header">
        <div>
          <strong>{exam.institution || "اسم المؤسسة"}</strong>
          <div>{exam.level || "المستوى"}</div>
        </div>
        <div className="center-head">
          <strong>{exam.title || "اختبار"}</strong>
          <div>{exam.subject || "المادة"}</div>
        </div>
        <div className="head-meta">
          <div>الأستاذ: {exam.teacher || "—"}</div>
          <div>المدة: {exam.duration || "—"}</div>
        </div>
      </header>

      <div className="score-line">العلامة: ____ / 20</div>

      <main>
        {exam.questions.map((q, i) => <section className="print-question" key={q.id}>
          <div className="question-title">
            <span>السؤال {i + 1}</span>
            <span>{q.points} ن</span>
          </div>

          {q.type === "quran" && q.quran ? (
            <>
              <p>{q.prompt}</p>
              <div className={`quran-text print-quran ${q.quran.riwayah}`}>
                {q.quran.text}
              </div>
            </>
          ) : <>
            <p className="prompt">{q.prompt || "اكتب نص السؤال هنا..."}</p>
            {q.type === "mcq" && <div className="print-options">
              {(q.options ?? []).map((o, j) => <div key={j}>□ {o || `الخيار ${j+1}`}</div>)}
            </div>}
            {q.type === "matching" && <div className="answer-space">مساحة الإجابة</div>}
            {q.type === "integration" && <div className="answer-space tall">مساحة الوضعية والإجابة</div>}
            {q.type === "text" && <div className="answer-space">........................................................................</div>}
          </>}
        </section>)}
      </main>

      <footer>صفحة الاختبار — جاهزة للطباعة A4</footer>
    </div>
  </div>
}