import { useMemo, useState, type FormEvent } from 'react'
import './RandomQuoteCollection.css'

interface Quote{id:string;text:string;author:string}
const catalog:Quote[]=[
  {id:'small-step',text:'A small step taken today gives tomorrow somewhere to begin.',author:'Local collection'},
  {id:'curiosity',text:'Curiosity turns an ordinary moment into an open door.',author:'Local collection'},
  {id:'practice',text:'Practice is patience made visible.',author:'Local collection'},
  {id:'listening',text:'Listening carefully is a quiet way to make room for someone.',author:'Local collection'},
  {id:'progress',text:'Progress can be gentle and still be progress.',author:'Local collection'},
  {id:'questions',text:'A useful question can carry you further than a quick answer.',author:'Local collection'},
  {id:'rest',text:'Rest gives effort a chance to find its direction again.',author:'Local collection'},
  {id:'kindness',text:'Kindness leaves a path that others can follow.',author:'Local collection'},
  {id:'learning',text:'Learning begins where certainty makes room for discovery.',author:'Local collection'},
  {id:'attention',text:'What you give your attention to becomes part of your day.',author:'Local collection'},
  {id:'change',text:'Change often arrives as a choice small enough to make today.',author:'Local collection'},
  {id:'creation',text:'Make something imperfect, then give it another thoughtful turn.',author:'Local collection'},
]
function sample(previous:string[],count:number){const result=[...catalog];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}const selected=result.slice(0,Math.min(count,result.length));if(selected.length===previous.length&&selected.every(q=>previous.includes(q.id))&&selected.length<result.length){[result[selected.length-1],result[selected.length]]=[result[selected.length],result[selected.length-1]];return result.slice(0,selected.length)}return selected}

export default function RandomQuoteCollection(){
  const [count,setCount]=useState('5');const [authors,setAuthors]=useState(false);const [quotes,setQuotes]=useState<Quote[]>(()=>sample([],5));const [error,setError]=useState('');const [announcement,setAnnouncement]=useState('Five distinct quotes selected.')
  const validCount=useMemo(()=>/^\d+$/.test(count)&&Number.isSafeInteger(Number(count))&&Number(count)>=1,[count])
  const generate=(event?:FormEvent)=>{event?.preventDefault();if(!validCount){setError('Enter a positive whole number of quotes.');return}const next=sample(quotes.map(q=>q.id),Number(count));setQuotes(next);setError('');setAnnouncement(`A new set of ${next.length} distinct quotes is ready.`)}
  return <div className="quotes-page"><header className="cm-project-header"><a className="cm-skip-link" href="#project-content">Skip to project</a><a className="cm-project-brand" href="https://codingmaxima.com/" aria-label="CodingMaxima website"><span className="cm-logo" role="img" aria-label="CodingMaxima"/></a><span className="cm-project-divider"/><div className="cm-project-meta"><span>INDEPENDENT PRACTICE PROJECT</span><strong>Quote Collection</strong></div></header>
    <main id="project-content" className="collection" aria-labelledby="collection-title"><header className="collection-heading"><p className="quote-kicker"><span aria-hidden="true">✳</span> A MOMENT OF INSPIRATION</p><h1 id="collection-title">Random Quote Collection</h1><p>Words to pause with. Collect fresh perspectives and keep the ones that stay with you.</p></header>
      <form onSubmit={generate} noValidate><div className="quote-panel"><section aria-labelledby="selected-title"><h2 id="selected-title" className="visually-hidden">Your quote collection</h2><div className="quote-list">{quotes.map((quote,index)=><figure className={`quote-card tone-${index%5+1}`} key={quote.id}><blockquote><p>{quote.text}</p></blockquote><figcaption className={!authors?'author-hidden':''}>— <cite>{quote.author}</cite></figcaption></figure>)}</div></section>
        <div className="actions"><button type="submit">Regenerate Quotes</button></div><p className="error" role="alert">{error}</p>
      </div><details className="settings"><summary>Collection settings</summary><div className="count-field"><label htmlFor="quote-count">Number of quotes</label><input id="quote-count" type="number" min="1" step="1" value={count} onChange={event=>{setCount(event.currentTarget.value);setError('')}} aria-invalid={error!==''||undefined} aria-describedby="count-help count-error"/></div><p id="count-help" className="help">{catalog.length} quotes available. Larger requests show the whole catalog.</p><p id="count-error" className="help">Enter a positive whole number.</p><label className="author-toggle"><input type="checkbox" checked={authors} onChange={event=>setAuthors(event.currentTarget.checked)}/> Show authors</label></details></form>
      <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </main><footer className="cm-project-footer"><span><strong>CodingMaxima</strong> · Learn visually. Think logically. Code confidently.</span><span className="cm-footer-label">INDEPENDENT PROJECT</span></footer>
  </div>
}
