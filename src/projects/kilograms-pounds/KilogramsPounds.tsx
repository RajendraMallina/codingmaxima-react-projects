import { useState, type ChangeEvent } from 'react'
import './KilogramsPounds.css'

const poundsPerKilogram = 2.2046226218487757
const pretty = (value:number) => value.toLocaleString(undefined,{maximumFractionDigits:6})

export default function KilogramsPounds() {
  const [kg,setKg]=useState('')
  const [lb,setLb]=useState('')
  const convert=(event:ChangeEvent<HTMLInputElement>,unit:'kg'|'lb')=>{
    const input=event.currentTarget
    const amount=input.value!==''&&input.validity.valid&&Number.isFinite(input.valueAsNumber)&&input.valueAsNumber>=0?input.valueAsNumber:null
    if(unit==='kg'){setKg(input.value);setLb(amount===null?'':String(amount*poundsPerKilogram))}
    else{setLb(input.value);setKg(amount===null?'':String(amount/poundsPerKilogram))}
  }
  const kilograms=kg!==''&&Number.isFinite(Number(kg))?Number(kg):null
  const pounds=lb!==''&&Number.isFinite(Number(lb))?Number(lb):null

  return <div className="kg-page">
    <header className="cm-project-header"><a className="cm-skip-link" href="#project-content">Skip to project</a><a className="cm-project-brand" href="https://codingmaxima.com/" aria-label="CodingMaxima website"><span className="cm-logo" role="img" aria-label="CodingMaxima"/></a><span className="cm-project-divider"/><div className="cm-project-meta"><span>INDEPENDENT PRACTICE PROJECT</span><strong>Kilograms &amp; Pounds</strong></div></header>
    <main id="project-content" className="converter" aria-labelledby="converter-title">
      <p className="eyebrow"><span className="eyebrow-icon" aria-hidden="true">kg</span> WEIGHT · INSTANT CONVERSION</p>
      <h1 id="converter-title">Kilograms and Pounds Converter</h1><p className="intro">A clear, quick way to move between metric and imperial weight.</p>
      <div className="fields"><div className="field"><label htmlFor="kilograms">Kilograms (kg)</label><input id="kilograms" type="number" min="0" step="any" placeholder="Enter kilograms" value={kg} onChange={event=>convert(event,'kg')}/></div><div className="field"><label htmlFor="pounds">Pounds (lb)</label><input id="pounds" type="number" min="0" step="any" placeholder="Enter pounds" value={lb} onChange={event=>convert(event,'lb')}/></div></div>
      <p className="result" aria-live="polite">{kilograms!==null&&pounds!==null?`${pretty(kilograms)} kg = ${pretty(pounds)} lb`:'Enter a valid, non-negative weight to see the result.'}</p>
      <p className="formula"><span aria-hidden="true">↔</span> 1 kilogram <strong>= 2.2046226218 pounds</strong></p>
    </main>
    <footer className="cm-project-footer"><span><strong>CodingMaxima</strong> · Learn visually. Think logically. Code confidently.</span><span className="cm-footer-label">INDEPENDENT PROJECT</span></footer>
  </div>
}
