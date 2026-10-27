import { useState, type ChangeEvent } from 'react'
import './CentimeterFeet.css'

const cmPerFoot=30.48
const pretty=(value:number)=>value.toLocaleString(undefined,{maximumFractionDigits:6})

export default function CentimeterFeet(){
  const [cm,setCm]=useState('');const [ft,setFt]=useState('')
  const convert=(event:ChangeEvent<HTMLInputElement>,unit:'cm'|'ft')=>{const input=event.currentTarget;const value=input.valueAsNumber;const valid=input.value!==''&&input.validity.valid&&Number.isFinite(value)&&value>=0;if(unit==='cm'){setCm(input.value);setFt(valid?String(value/cmPerFoot):'')}else{setFt(input.value);setCm(valid?String(value*cmPerFoot):'')}}
  const centimeters=cm!==''&&Number.isFinite(Number(cm))?Number(cm):null;const feet=ft!==''&&Number.isFinite(Number(ft))?Number(ft):null
  return <div className="length-page"><header className="cm-project-header"><a className="cm-skip-link" href="#project-content">Skip to project</a><a className="cm-project-brand" href="https://codingmaxima.com/" aria-label="CodingMaxima website"><span className="cm-logo" role="img" aria-label="CodingMaxima"/></a><span className="cm-project-divider"/><div className="cm-project-meta"><span>INDEPENDENT PRACTICE PROJECT</span><strong>Centimeters &amp; Feet</strong></div></header>
    <main id="project-content" className="converter" aria-labelledby="converter-title"><p className="eyebrow"><span className="eyebrow-icon" aria-hidden="true">cm</span> LENGTH · INSTANT CONVERSION</p><h1 id="converter-title">Centimeters and Feet Converter</h1><p className="intro">Move between metric centimeters and everyday imperial feet.</p>
      <div className="fields"><div className="field"><label htmlFor="centimeters">Centimeters (cm)</label><input id="centimeters" type="number" min="0" step="any" placeholder="Enter centimeters" value={cm} onChange={event=>convert(event,'cm')}/></div><div className="field"><label htmlFor="feet">Feet (ft)</label><input id="feet" type="number" min="0" step="any" placeholder="Enter feet" value={ft} onChange={event=>convert(event,'ft')}/></div></div>
      <p className="result" aria-live="polite">{centimeters!==null&&feet!==null?`${pretty(centimeters)} cm = ${pretty(feet)} ft`:'Enter a valid, non-negative length to see the result.'}</p><p className="formula"><span aria-hidden="true">↔</span> 1 foot <strong>= 30.48 centimeters</strong><span className="formula-note">Feet shown as a decimal value.</span></p>
    </main><footer className="cm-project-footer"><span><strong>CodingMaxima</strong> · Learn visually. Think logically. Code confidently.</span><span className="cm-footer-label">INDEPENDENT PROJECT</span></footer>
  </div>
}
