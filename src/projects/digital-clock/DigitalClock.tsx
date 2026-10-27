import { useEffect, useState, type ChangeEvent } from 'react'
import './DigitalClock.css'

type ClockFormat='12'|'24'
function localTime(timestamp:number,format:ClockFormat){const date=new Date(timestamp);const pad=(n:number)=>String(n).padStart(2,'0');const hour=date.getHours();const time=`${pad(format==='12'?hour%12||12:hour)}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;return format==='12'?`${time} ${hour>=12?'PM':'AM'}`:time}
export default function DigitalClock(){
  const [format,setFormat]=useState<ClockFormat>('24');const [timestamp,setTimestamp]=useState(()=>Date.now())
  useEffect(()=>{let timer=0;const refresh=()=>{const now=Date.now();setTimestamp(now);timer=window.setTimeout(refresh,1000-(now%1000))};refresh();const onFocus=()=>refresh();const onVisibility=()=>{if(document.visibilityState==='visible')refresh()};window.addEventListener('focus',onFocus);window.addEventListener('pageshow',onFocus);document.addEventListener('visibilitychange',onVisibility);return()=>{clearTimeout(timer);window.removeEventListener('focus',onFocus);window.removeEventListener('pageshow',onFocus);document.removeEventListener('visibilitychange',onVisibility)}},[])
  const selectFormat=(event:ChangeEvent<HTMLInputElement>)=>{if(event.currentTarget.value==='12'||event.currentTarget.value==='24')setFormat(event.currentTarget.value)}
  const date=new Date(timestamp)
  return <div className="clock-page"><header className="cm-project-header"><a className="cm-skip-link" href="#project-content">Skip to project</a><a className="cm-project-brand" href="https://codingmaxima.com/" aria-label="CodingMaxima website"><span className="cm-logo" role="img" aria-label="CodingMaxima"/></a><span className="cm-project-divider"/><div className="cm-project-meta"><span>INDEPENDENT PRACTICE PROJECT</span><strong>Digital Clock</strong></div></header>
    <main id="project-content" className="clock-panel" aria-labelledby="clock-title"><p className="clock-kicker"><span/> YOUR LOCAL TIME</p><h1 id="clock-title">Digital Clock</h1><p className="subtitle">A little clarity, right on time.</p><time className="clock-display" dateTime={date.toISOString()} aria-live="off">{localTime(timestamp,format)}</time><p className="date">{date.toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      <fieldset><legend>Time format</legend><label><input type="radio" name="clock-format" value="12" checked={format==='12'} onChange={selectFormat}/> 12-hour</label><label><input type="radio" name="clock-format" value="24" checked={format==='24'} onChange={selectFormat}/> 24-hour</label></fieldset><p className="note"><span aria-hidden="true">◉</span> Syncing with your device's local time</p>
    </main><footer className="cm-project-footer"><span><strong>CodingMaxima</strong> · Learn visually. Think logically. Code confidently.</span><span className="cm-footer-label">INDEPENDENT PROJECT</span></footer>
  </div>
}
