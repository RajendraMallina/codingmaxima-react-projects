import type { ReactNode } from 'react'
import './practice-labs.css'

export default function LabLayout({ title, icon, kicker, description, children }: { title: string; icon: string; kicker: string; description: string; children: ReactNode }) {
  return <div className="lab-page"><header className="cm-project-header"><a className="cm-skip-link" href="#project-content">Skip to project</a><a className="cm-project-brand" href="https://codingmaxima.com/" aria-label="CodingMaxima website"><span className="cm-logo" role="img" aria-label="CodingMaxima" /></a><span className="cm-project-divider" aria-hidden="true" /><div className="cm-project-meta"><span>INDEPENDENT PRACTICE PROJECT</span><strong>{title}</strong></div></header><main id="project-content" className="lab-content"><section className="lab-intro"><p className="lab-kicker"><span aria-hidden="true">{icon}</span> {kicker}</p><h1>{title}</h1><p>{description}</p></section>{children}</main><footer className="cm-project-footer"><span><strong>CodingMaxima</strong> · Learn visually. Think logically. Code confidently.</span><span className="cm-footer-label">INDEPENDENT PROJECT</span></footer></div>
}
