import { useMemo, useState, type FormEvent } from 'react'
import './StudentRecords.css'

type Student = { id: number; name: string; email: string; marks: number; gender: string; education: string; scholarship: boolean }
const emptyForm = { name: '', email: '', marks: '', gender: '', education: '', scholarship: false }

export default function StudentRecords() {
  const [form, setForm] = useState(emptyForm)
  const [students, setStudents] = useState<Student[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [message, setMessage] = useState('Your class list is ready. Add a student to get started.')
  const [nextId, setNextId] = useState(1)
  const allSelected = students.length > 0 && selected.length === students.length
  const markValue = Number(form.marks)
  const validMarks = form.marks !== '' && Number.isFinite(markValue) && markValue >= 0 && markValue <= 100
  const errors = useMemo(() => ({ name: form.name.trim().length < 2, email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()), marks: !validMarks, gender: !form.gender, education: !form.education }), [form, validMarks])
  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) { setForm((current) => ({ ...current, [key]: value })) }
  function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (Object.values(errors).some(Boolean)) { setMessage('Check the highlighted fields and complete the form.'); return }
    const student: Student = { id: nextId, name: form.name.trim(), email: form.email.trim(), marks: markValue, gender: form.gender, education: form.education, scholarship: form.scholarship }
    setStudents((current) => [...current, student]); setNextId((value) => value + 1); setMessage(student.name + ' was added to the class list.'); setForm(emptyForm)
  }
  function toggleStudent(id: number, checked: boolean) { setSelected((current) => checked ? [...new Set([...current, id])] : current.filter((item) => item !== id)) }
  function deleteSelected() { const count = selected.length; if (!count) return; const ids = new Set(selected); setStudents((current) => current.filter((student) => !ids.has(student.id))); setSelected([]); setMessage(count + (count === 1 ? ' student was removed.' : ' students were removed.')) }
  function deleteAll() { const count = students.length; if (!count) return; setStudents([]); setSelected([]); setMessage('All ' + count + (count === 1 ? ' student record was removed.' : ' student records were removed.')) }
  return <div className="sr-page">
    <header className="cm-project-header"><a className="cm-skip-link" href="#project-content">Skip to project</a><a className="cm-project-brand" href="https://codingmaxima.com/" aria-label="CodingMaxima website"><span className="cm-logo" role="img" aria-label="CodingMaxima" /></a><span className="cm-project-divider" aria-hidden="true" /><div className="cm-project-meta"><span>INDEPENDENT PRACTICE PROJECT</span><strong>Student Records</strong></div></header>
    <main className="sr-content" id="project-content" aria-labelledby="student-title">
      <section className="sr-intro"><p className="sr-eyebrow"><span aria-hidden="true">✓</span> FORMS · TABLES · CLASS LIST</p><h1 id="student-title">Student Records</h1><p>Add student details and keep your class list organized in one place.</p></section>
      <div className="sr-workspace">
        <section className="sr-card sr-form-card" aria-labelledby="form-title"><div className="sr-section-heading"><span className="sr-section-icon" aria-hidden="true">＋</span><div><h2 id="form-title">Student details</h2><p>Fields marked <span>*</span> are required.</p></div></div>
          <form onSubmit={addStudent} noValidate><div className="sr-fields">
            <div className="sr-field"><label htmlFor="sr-name">Full name <span>*</span></label><input id="sr-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Alex Morgan" autoComplete="name" maxLength={80} aria-invalid={errors.name && form.name !== ''} />{errors.name && form.name !== '' && <small className="sr-error">Enter at least 2 characters.</small>}</div>
            <div className="sr-field"><label htmlFor="sr-email">Email address <span>*</span></label><input id="sr-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="alex@example.com" autoComplete="email" maxLength={120} aria-invalid={errors.email && form.email !== ''} />{errors.email && form.email !== '' && <small className="sr-error">Enter a valid email address.</small>}</div>
            <div className="sr-field"><label htmlFor="sr-marks">Marks <span>*</span></label><div className="sr-suffix"><input id="sr-marks" type="number" min="0" max="100" step="any" value={form.marks} onChange={(e) => update('marks', e.target.value)} placeholder="0–100" aria-invalid={errors.marks && form.marks !== ''} /><span>/ 100</span></div>{errors.marks && form.marks !== '' && <small className="sr-error">Enter marks from 0 to 100.</small>}</div>
            <div className="sr-field"><label htmlFor="sr-education">Education <span>*</span></label><select id="sr-education" value={form.education} onChange={(e) => update('education', e.target.value)}><option value="">Select a program</option><option>B-Tech</option><option>BE</option><option>MCA</option><option>BCA</option></select></div>
          </div>
          <fieldset className="sr-gender"><legend>Gender <span>*</span></legend>{['Female', 'Male', 'Other'].map((gender) => <label className="sr-choice" key={gender}><input type="radio" name="gender" value={gender} checked={form.gender === gender} onChange={() => update('gender', gender)} /><span>{gender}</span></label>)}</fieldset>
          <label className="sr-scholarship"><input type="checkbox" checked={form.scholarship} onChange={(e) => update('scholarship', e.target.checked)} /><span><strong>Scholarship eligible</strong><small>Mark this student as eligible for a scholarship.</small></span></label><button className="sr-primary" type="submit"><span aria-hidden="true">＋</span> Add student</button></form>
        </section>
        <section className="sr-card sr-records-card" aria-labelledby="records-title"><div className="sr-records-heading"><div><p className="sr-kicker">YOUR CLASS</p><h2 id="records-title">Student list <span className="sr-count">{students.length}</span></h2></div><div className="sr-actions"><button type="button" onClick={deleteSelected} disabled={!selected.length}>⌫ Delete selected{selected.length > 0 && <span className="sr-selected-count">{selected.length}</span>}</button><button className="sr-danger" type="button" onClick={deleteAll} disabled={!students.length}>Delete all</button></div></div>
          <p className="sr-status" role="status" aria-live="polite">{message}</p>
          {!students.length ? <div className="sr-empty"><span aria-hidden="true">▤</span><h3>Your class list is empty</h3><p>Add the first student using the form. Their details will appear here.</p></div> : <><div className="sr-table-scroll"><table><caption className="sr-visually-hidden">Student records in your class list</caption><thead><tr><th className="sr-select-col"><input type="checkbox" aria-label="Select all student records" checked={allSelected} ref={(node) => { if (node) node.indeterminate = selected.length > 0 && !allSelected }} onChange={(e) => setSelected(e.target.checked ? students.map((s) => s.id) : [])} /></th><th scope="col">Student</th><th scope="col">Marks</th><th scope="col">Gender</th><th scope="col">Education</th><th scope="col">Scholarship</th></tr></thead><tbody>{students.map((s) => <tr key={s.id} className={selected.includes(s.id) ? 'sr-selected-row' : ''}><td className="sr-select-col"><input type="checkbox" aria-label={'Select ' + s.name} checked={selected.includes(s.id)} onChange={(e) => toggleStudent(s.id, e.target.checked)} /></td><td><div className="sr-identity"><span className="sr-avatar" aria-hidden="true">{s.name.charAt(0).toUpperCase()}</span><span><strong>{s.name}</strong><small>{s.email}</small></span></div></td><td><span className={'sr-mark' + (s.marks >= 75 ? ' sr-high' : '')}>{s.marks}<small> / 100</small></span></td><td>{s.gender}</td><td>{s.education}</td><td><span className={'sr-scholarship-pill' + (s.scholarship ? ' sr-eligible' : '')}>{s.scholarship ? '✓ Eligible' : '— No'}</span></td></tr>)}</tbody></table></div><div className="sr-table-foot"><span>Showing {students.length} {students.length === 1 ? 'student' : 'students'}</span><span>Select rows to remove multiple records.</span></div></>}
        </section>
      </div>
    </main><footer className="cm-project-footer"><span><strong>CodingMaxima</strong> · Learn visually. Think logically. Code confidently.</span><span className="cm-footer-label">INDEPENDENT PROJECT</span></footer>
  </div>
}
