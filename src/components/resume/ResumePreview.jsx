import React from 'react';

// Shared data renderer helpers
const ContactItem = ({ children }) => children ? <span>{children}</span> : null;

// ─────────────────────────────────────────────
// TEMPLATE 1: Modern (Basic) – clean blue accent
// ─────────────────────────────────────────────
const ModernTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-black w-full h-full font-['Arial',sans-serif] text-[11px] leading-[1.4]">
      {/* Header */}
      <div className="bg-blue-700 text-white px-8 py-6">
        <h1 className="text-[22px] font-bold uppercase tracking-[2px]">{p.firstName} {p.lastName}</h1>
        {p.targetRole && <p className="text-blue-200 text-[11px] mt-1 tracking-wide">{p.targetRole}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-blue-100 mt-2">
          <ContactItem>{p.email}</ContactItem>
          <ContactItem>{p.phone}</ContactItem>
          <ContactItem>{p.address}</ContactItem>
          <ContactItem>{p.linkedIn}</ContactItem>
          <ContactItem>{p.github}</ContactItem>
        </div>
      </div>
      <div className="px-8 py-5 space-y-4">
        {p.summary && <Section title="PROFESSIONAL SUMMARY" accent="border-blue-700"><p className="text-[10.5px] leading-relaxed">{p.summary}</p></Section>}
        {resume.experience?.length > 0 && <Section title="EXPERIENCE" accent="border-blue-700">{resume.experience.map((e, i) => <ExpItem key={i} item={e} />)}</Section>}
        {resume.education?.length > 0 && <Section title="EDUCATION" accent="border-blue-700">{resume.education.map((e, i) => <EduItem key={i} item={e} />)}</Section>}
        {resume.skills?.length > 0 && <Section title="SKILLS" accent="border-blue-700"><p className="text-[10.5px]">{resume.skills.join(' • ')}</p></Section>}
        {resume.projects?.length > 0 && <Section title="PROJECTS" accent="border-blue-700">{resume.projects.map((pr, i) => <ProjItem key={i} item={pr} />)}</Section>}
        {resume.certifications?.length > 0 && <Section title="CERTIFICATIONS" accent="border-blue-700">{resume.certifications.map((c, i) => <CertItem key={i} item={c} />)}</Section>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TEMPLATE 2: Minimal (Basic) – clean black lines
// ─────────────────────────────────────────────
const MinimalTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-black w-full h-full font-['Georgia',serif] text-[11px] leading-[1.5]">
      <div className="px-10 pt-8 pb-4 text-center border-b-2 border-black">
        <h1 className="text-[24px] font-bold uppercase tracking-[3px]">{p.firstName} {p.lastName}</h1>
        {p.targetRole && <p className="text-[11px] mt-1 italic text-gray-600">{p.targetRole}</p>}
        <div className="flex justify-center flex-wrap gap-x-4 text-[9.5px] text-gray-600 mt-2">
          <ContactItem>{p.email}</ContactItem>
          <ContactItem>{p.phone}</ContactItem>
          <ContactItem>{p.address}</ContactItem>
          <ContactItem>{p.linkedIn}</ContactItem>
        </div>
      </div>
      <div className="px-10 py-5 space-y-4">
        {p.summary && <Section title="Summary" accent="border-black" titleStyle="font-serif italic text-[12px] border-b border-black"><p className="text-[10.5px] leading-relaxed">{p.summary}</p></Section>}
        {resume.experience?.length > 0 && <Section title="Experience" accent="border-black" titleStyle="font-serif italic text-[12px] border-b border-black">{resume.experience.map((e, i) => <ExpItem key={i} item={e} />)}</Section>}
        {resume.education?.length > 0 && <Section title="Education" accent="border-black" titleStyle="font-serif italic text-[12px] border-b border-black">{resume.education.map((e, i) => <EduItem key={i} item={e} />)}</Section>}
        {resume.skills?.length > 0 && <Section title="Skills" accent="border-black" titleStyle="font-serif italic text-[12px] border-b border-black"><p className="text-[10.5px]">{resume.skills.join(' • ')}</p></Section>}
        {resume.projects?.length > 0 && <Section title="Projects" accent="border-black" titleStyle="font-serif italic text-[12px] border-b border-black">{resume.projects.map((pr, i) => <ProjItem key={i} item={pr} />)}</Section>}
        {resume.certifications?.length > 0 && <Section title="Certifications" accent="border-black" titleStyle="font-serif italic text-[12px] border-b border-black">{resume.certifications.map((c, i) => <CertItem key={i} item={c} />)}</Section>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TEMPLATE 3: ATS Classic (Basic) – pure ATS safe
// ─────────────────────────────────────────────
const AtsClassicTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-black w-full h-full font-['Calibri',sans-serif] text-[11px] leading-[1.4]">
      <div className="px-8 pt-6 pb-3 border-b border-gray-400">
        <h1 className="text-[20px] font-bold">{p.firstName} {p.lastName}</h1>
        <div className="flex flex-wrap gap-x-3 text-[9.5px] text-gray-700 mt-1">
          <ContactItem>{p.email}</ContactItem>
          <ContactItem>{p.phone && `| ${p.phone}`}</ContactItem>
          <ContactItem>{p.address && `| ${p.address}`}</ContactItem>
          <ContactItem>{p.linkedIn && `| ${p.linkedIn}`}</ContactItem>
        </div>
      </div>
      <div className="px-8 py-4 space-y-3">
        {p.targetRole && <p className="text-[10.5px] font-semibold text-gray-700">Position: {p.targetRole}</p>}
        {p.summary && <Section title="OBJECTIVE" titleStyle="font-bold text-[11px] uppercase border-b border-gray-400 w-full"><p className="text-[10.5px] mt-1 leading-relaxed">{p.summary}</p></Section>}
        {resume.experience?.length > 0 && <Section title="WORK EXPERIENCE" titleStyle="font-bold text-[11px] uppercase border-b border-gray-400 w-full">{resume.experience.map((e, i) => <ExpItem key={i} item={e} />)}</Section>}
        {resume.skills?.length > 0 && <Section title="SKILLS" titleStyle="font-bold text-[11px] uppercase border-b border-gray-400 w-full"><p className="text-[10.5px] mt-1">{resume.skills.join(', ')}</p></Section>}
        {resume.education?.length > 0 && <Section title="EDUCATION" titleStyle="font-bold text-[11px] uppercase border-b border-gray-400 w-full">{resume.education.map((e, i) => <EduItem key={i} item={e} />)}</Section>}
        {resume.projects?.length > 0 && <Section title="PROJECTS" titleStyle="font-bold text-[11px] uppercase border-b border-gray-400 w-full">{resume.projects.map((pr, i) => <ProjItem key={i} item={pr} />)}</Section>}
        {resume.certifications?.length > 0 && <Section title="CERTIFICATIONS" titleStyle="font-bold text-[11px] uppercase border-b border-gray-400 w-full">{resume.certifications.map((c, i) => <CertItem key={i} item={c} />)}</Section>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TEMPLATE 4: Executive (Premium) – dark slate sidebar
// ─────────────────────────────────────────────
const ExecutiveTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-black w-full h-full font-['Arial',sans-serif] text-[11px] leading-[1.4] flex">
      {/* Sidebar */}
      <div className="w-[30%] bg-slate-800 text-white px-4 py-6 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-[16px] font-bold uppercase tracking-wide leading-tight">{p.firstName}<br />{p.lastName}</h1>
          {p.targetRole && <p className="text-slate-300 text-[9px] mt-1 uppercase tracking-widest">{p.targetRole}</p>}
        </div>
        <div className="mb-5">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-600 pb-1">Contact</h2>
          <div className="space-y-1 text-[9.5px] text-slate-300">
            {p.email && <div>{p.email}</div>}
            {p.phone && <div>{p.phone}</div>}
            {p.address && <div>{p.address}</div>}
            {p.linkedIn && <div className="truncate">{p.linkedIn}</div>}
            {p.github && <div className="truncate">{p.github}</div>}
          </div>
        </div>
        {resume.skills?.length > 0 && (
          <div>
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-600 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {resume.skills.map((s, i) => <span key={i} className="bg-slate-700 text-slate-200 text-[8px] px-1.5 py-0.5 rounded">{s}</span>)}
            </div>
          </div>
        )}
        {resume.certifications?.length > 0 && (
          <div className="mt-5">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-600 pb-1">Certifications</h2>
            <div className="space-y-2">{resume.certifications.map((c, i) => <div key={i} className="text-[9px] text-slate-300"><div className="font-semibold">{c.name}</div><div className="text-slate-400">{c.issuer}</div></div>)}</div>
          </div>
        )}
      </div>
      {/* Main Content */}
      <div className="flex-1 px-6 py-6 space-y-4 overflow-hidden">
        {p.summary && <Section title="PROFILE" accent="border-slate-800"><p className="text-[10.5px] leading-relaxed">{p.summary}</p></Section>}
        {resume.experience?.length > 0 && <Section title="EXPERIENCE" accent="border-slate-800">{resume.experience.map((e, i) => <ExpItem key={i} item={e} />)}</Section>}
        {resume.education?.length > 0 && <Section title="EDUCATION" accent="border-slate-800">{resume.education.map((e, i) => <EduItem key={i} item={e} />)}</Section>}
        {resume.projects?.length > 0 && <Section title="PROJECTS" accent="border-slate-800">{resume.projects.map((pr, i) => <ProjItem key={i} item={pr} />)}</Section>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TEMPLATE 5: Creative (Premium) – purple gradient
// ─────────────────────────────────────────────
const CreativeTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-black w-full h-full font-['Arial',sans-serif] text-[11px] leading-[1.4]">
      <div className="bg-gradient-to-r from-purple-700 to-pink-600 px-8 py-6 text-white">
        <h1 className="text-[26px] font-black tracking-tight">{p.firstName} <span className="font-light">{p.lastName}</span></h1>
        {p.targetRole && <p className="text-pink-200 text-[11px] mt-0.5 font-light tracking-widest uppercase">{p.targetRole}</p>}
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-[9.5px] text-pink-100 mt-2">
          <ContactItem>{p.email}</ContactItem>
          <ContactItem>{p.phone}</ContactItem>
          <ContactItem>{p.address}</ContactItem>
          <ContactItem>{p.linkedIn}</ContactItem>
          <ContactItem>{p.github}</ContactItem>
        </div>
      </div>
      <div className="px-8 py-5 space-y-4">
        {p.summary && <Section title="ABOUT" accent="border-purple-600"><p className="text-[10.5px] leading-relaxed">{p.summary}</p></Section>}
        {resume.experience?.length > 0 && <Section title="EXPERIENCE" accent="border-purple-600">{resume.experience.map((e, i) => <ExpItem key={i} item={e} accent="text-purple-700" />)}</Section>}
        {resume.education?.length > 0 && <Section title="EDUCATION" accent="border-purple-600">{resume.education.map((e, i) => <EduItem key={i} item={e} />)}</Section>}
        {resume.skills?.length > 0 && <Section title="SKILLS" accent="border-purple-600"><div className="flex flex-wrap gap-1.5">{resume.skills.map((s, i) => <span key={i} className="bg-purple-50 border border-purple-200 text-purple-700 text-[9px] px-2 py-0.5 rounded-full">{s}</span>)}</div></Section>}
        {resume.projects?.length > 0 && <Section title="PROJECTS" accent="border-purple-600">{resume.projects.map((pr, i) => <ProjItem key={i} item={pr} accent="text-purple-700" />)}</Section>}
        {resume.certifications?.length > 0 && <Section title="CERTIFICATIONS" accent="border-purple-600">{resume.certifications.map((c, i) => <CertItem key={i} item={c} />)}</Section>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TEMPLATE 6: Corporate (Premium) – teal/green ATS
// ─────────────────────────────────────────────
const CorporateTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-black w-full h-full font-['Arial',sans-serif] text-[11px] leading-[1.4]">
      <div className="border-l-4 border-teal-600 pl-6 pr-8 pt-6 pb-4">
        <h1 className="text-[22px] font-bold text-slate-900">{p.firstName} {p.lastName}</h1>
        {p.targetRole && <p className="text-teal-600 font-semibold text-[11px] mt-0.5 uppercase tracking-wide">{p.targetRole}</p>}
        <div className="flex flex-wrap gap-x-4 text-[9.5px] text-gray-600 mt-2">
          <ContactItem>{p.email}</ContactItem>
          <ContactItem>{p.phone}</ContactItem>
          <ContactItem>{p.address}</ContactItem>
          <ContactItem>{p.linkedIn}</ContactItem>
          <ContactItem>{p.github}</ContactItem>
        </div>
      </div>
      <div className="px-8 py-5 space-y-4">
        {p.summary && <Section title="EXECUTIVE SUMMARY" accent="border-teal-600"><p className="text-[10.5px] leading-relaxed">{p.summary}</p></Section>}
        {resume.experience?.length > 0 && <Section title="PROFESSIONAL EXPERIENCE" accent="border-teal-600">{resume.experience.map((e, i) => <ExpItem key={i} item={e} accent="text-teal-700" />)}</Section>}
        {resume.education?.length > 0 && <Section title="EDUCATION" accent="border-teal-600">{resume.education.map((e, i) => <EduItem key={i} item={e} />)}</Section>}
        {resume.skills?.length > 0 && <Section title="KEY SKILLS" accent="border-teal-600"><div className="grid grid-cols-3 gap-1">{resume.skills.map((s, i) => <div key={i} className="flex items-center gap-1 text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />{s}</div>)}</div></Section>}
        {resume.projects?.length > 0 && <Section title="NOTABLE PROJECTS" accent="border-teal-600">{resume.projects.map((pr, i) => <ProjItem key={i} item={pr} />)}</Section>}
        {resume.certifications?.length > 0 && <Section title="CERTIFICATIONS" accent="border-teal-600">{resume.certifications.map((c, i) => <CertItem key={i} item={c} />)}</Section>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TEMPLATE 7: Developer (Premium) – dark terminal
// ─────────────────────────────────────────────
const DeveloperTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-gray-950 text-green-400 w-full h-full font-['Courier_New',monospace] text-[10.5px] leading-[1.5] px-8 py-6">
      <div className="border border-green-700 rounded p-4 mb-5">
        <p className="text-green-600 text-[9px]">// resume.config.json</p>
        <h1 className="text-[20px] font-bold text-white mt-1">{p.firstName} {p.lastName}</h1>
        {p.targetRole && <p className="text-green-400 text-[10px]">role: "{p.targetRole}"</p>}
        <div className="text-[9.5px] text-green-600 mt-2 space-y-0.5">
          {p.email && <div>email: <span className="text-green-300">"{p.email}"</span></div>}
          {p.phone && <div>phone: <span className="text-green-300">"{p.phone}"</span></div>}
          {p.github && <div>github: <span className="text-green-300">"{p.github}"</span></div>}
          {p.linkedIn && <div>linkedin: <span className="text-green-300">"{p.linkedIn}"</span></div>}
        </div>
      </div>
      {p.summary && <div className="mb-5"><p className="text-green-600 text-[9px] mb-1">// summary</p><p className="text-gray-300 text-[10.5px] leading-relaxed">{p.summary}</p></div>}
      {resume.experience?.length > 0 && <div className="mb-5"><p className="text-green-600 text-[9px] mb-2">// experience[]</p><div className="space-y-3">{resume.experience.map((e, i) => (<div key={i} className="border-l-2 border-green-800 pl-3"><div className="flex justify-between"><span className="text-white font-bold text-[10.5px]">{e.title}</span><span className="text-green-600 text-[9px]">{e.startDate}—{e.current ? 'now' : e.endDate}</span></div><div className="text-green-500 text-[9.5px]">{e.company}</div><p className="text-gray-400 text-[9.5px] mt-1 whitespace-pre-wrap">{e.description}</p></div>))}</div></div>}
      {resume.skills?.length > 0 && <div className="mb-5"><p className="text-green-600 text-[9px] mb-1">// skills = [</p><p className="text-green-300 text-[10px] pl-3">{resume.skills.map(s => `"${s}"`).join(', ')}</p><p className="text-green-600 text-[9px]">]</p></div>}
      {resume.education?.length > 0 && <div className="mb-5"><p className="text-green-600 text-[9px] mb-2">// education[]</p><div className="space-y-2">{resume.education.map((e, i) => (<div key={i} className="border-l-2 border-green-800 pl-3"><span className="text-white font-bold text-[10.5px]">{e.school}</span><div className="text-green-400 text-[9.5px]">{e.degree} {e.fieldOfStudy && `in ${e.fieldOfStudy}`}</div></div>))}</div></div>}
      {resume.projects?.length > 0 && <div className="mb-5"><p className="text-green-600 text-[9px] mb-2">// projects[]</p><div className="space-y-2">{resume.projects.map((pr, i) => (<div key={i} className="border-l-2 border-green-800 pl-3"><div className="text-white font-bold text-[10.5px]">{pr.name} {pr.link && <span className="text-green-500 text-[9px] font-normal">→ {pr.link}</span>}</div>{pr.technologies && <div className="text-green-500 text-[9px]">stack: [{pr.technologies}]</div>}<p className="text-gray-400 text-[9.5px] mt-0.5 whitespace-pre-wrap">{pr.description}</p></div>))}</div></div>}
    </div>
  );
};

// ─────────────────────────────────────────────
// TEMPLATE 8: Pro Premium – two-column elegant
// ─────────────────────────────────────────────
const ProElegantTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-black w-full h-full font-['Arial',sans-serif] text-[11px] leading-[1.4] flex">
      <div className="w-[35%] bg-indigo-900 text-white px-4 py-6 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-[17px] font-bold leading-tight">{p.firstName}<br /><span className="text-indigo-300">{p.lastName}</span></h1>
          {p.targetRole && <div className="mt-2 bg-indigo-700 text-indigo-200 text-[8.5px] px-2 py-0.5 rounded uppercase tracking-wider inline-block">{p.targetRole}</div>}
        </div>
        <div className="mb-5">
          <h2 className="text-[8px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Contact</h2>
          <div className="space-y-1 text-[9px] text-indigo-200">{p.email && <div>{p.email}</div>}{p.phone && <div>{p.phone}</div>}{p.address && <div>{p.address}</div>}{p.linkedIn && <div className="truncate">{p.linkedIn}</div>}{p.github && <div className="truncate">{p.github}</div>}</div>
        </div>
        {resume.skills?.length > 0 && (<div className="mb-5"><h2 className="text-[8px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Technical Skills</h2><div className="space-y-1">{resume.skills.map((s, i) => (<div key={i} className="flex items-center gap-2"><div className="flex-1 bg-indigo-800 rounded-full h-1"><div className="bg-indigo-400 h-1 rounded-full" style={{ width: `${60 + (i % 4) * 10}%` }} /></div><span className="text-[9px] text-indigo-200 w-16 shrink-0">{s}</span></div>))}</div></div>)}
        {resume.certifications?.length > 0 && (<div><h2 className="text-[8px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Certifications</h2><div className="space-y-2">{resume.certifications.map((c, i) => <div key={i} className="text-[9px] text-indigo-200"><div className="font-semibold">{c.name}</div><div className="text-indigo-400">{c.issuer}</div></div>)}</div></div>)}
      </div>
      <div className="flex-1 px-6 py-6 space-y-4 overflow-hidden">
        {p.summary && <Section title="PROFILE" accent="border-indigo-700"><p className="text-[10.5px] leading-relaxed">{p.summary}</p></Section>}
        {resume.experience?.length > 0 && <Section title="EXPERIENCE" accent="border-indigo-700">{resume.experience.map((e, i) => <ExpItem key={i} item={e} accent="text-indigo-700" />)}</Section>}
        {resume.education?.length > 0 && <Section title="EDUCATION" accent="border-indigo-700">{resume.education.map((e, i) => <EduItem key={i} item={e} />)}</Section>}
        {resume.projects?.length > 0 && <Section title="PROJECTS" accent="border-indigo-700">{resume.projects.map((pr, i) => <ProjItem key={i} item={pr} accent="text-indigo-700" />)}</Section>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TEMPLATE 9: Pro ATS Max – ultra ATS-safe
// ─────────────────────────────────────────────
const AtsMaxTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-black w-full h-full font-['Arial',sans-serif] text-[11px] leading-[1.5] px-10 py-8">
      <div className="text-center mb-4 pb-3 border-b-2 border-gray-800">
        <h1 className="text-[20px] font-bold uppercase tracking-[1px]">{p.firstName} {p.lastName}</h1>
        <div className="flex justify-center flex-wrap gap-x-3 text-[9.5px] text-gray-700 mt-1">
          <ContactItem>{p.email}</ContactItem>
          <ContactItem>{p.phone && `| ${p.phone}`}</ContactItem>
          <ContactItem>{p.address && `| ${p.address}`}</ContactItem>
          <ContactItem>{p.linkedIn && `| ${p.linkedIn}`}</ContactItem>
          <ContactItem>{p.github && `| ${p.github}`}</ContactItem>
        </div>
      </div>
      {p.summary && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase border-b border-gray-400 mb-1">Professional Summary</h2><p className="text-[10.5px] leading-relaxed">{p.summary}</p></div>}
      {resume.experience?.length > 0 && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase border-b border-gray-400 mb-2">Professional Experience</h2><div className="space-y-2">{resume.experience.map((e, i) => <ExpItem key={i} item={e} />)}</div></div>}
      {resume.skills?.length > 0 && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase border-b border-gray-400 mb-1">Core Competencies</h2><p className="text-[10.5px] mt-1">{resume.skills.join(' | ')}</p></div>}
      {resume.education?.length > 0 && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase border-b border-gray-400 mb-2">Education</h2><div className="space-y-2">{resume.education.map((e, i) => <EduItem key={i} item={e} />)}</div></div>}
      {resume.projects?.length > 0 && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase border-b border-gray-400 mb-2">Key Projects</h2><div className="space-y-2">{resume.projects.map((pr, i) => <ProjItem key={i} item={pr} />)}</div></div>}
      {resume.certifications?.length > 0 && <div className="mb-3"><h2 className="text-[11px] font-bold uppercase border-b border-gray-400 mb-2">Certifications & Awards</h2><div className="space-y-1">{resume.certifications.map((c, i) => <CertItem key={i} item={c} />)}</div></div>}
    </div>
  );
};

// ─────────────────────────────────────────────
// Shared Sub-components
// ─────────────────────────────────────────────
const Section = ({ title, children, accent = 'border-blue-700', titleStyle }) => (
  <div>
    <h2 className={titleStyle || `text-[11px] font-bold uppercase tracking-wide border-b-2 ${accent} pb-0.5 mb-2`}>{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const ExpItem = ({ item, accent = 'text-slate-800' }) => (
  <div>
    <div className="flex justify-between items-baseline">
      <span className={`font-bold text-[10.5px] ${accent}`}>{item.title}</span>
      <span className="text-[9px] text-gray-600 shrink-0 ml-2">{item.startDate}{item.startDate && ' — '}{item.current ? 'Present' : item.endDate}</span>
    </div>
    <div className="text-[9.5px] text-gray-600 font-medium">{item.company}{item.location && `, ${item.location}`}</div>
    {item.description && <p className="text-[9.5px] text-gray-700 mt-0.5 whitespace-pre-wrap leading-relaxed">{item.description}</p>}
  </div>
);

const EduItem = ({ item }) => (
  <div className="flex justify-between items-start">
    <div>
      <div className="font-bold text-[10.5px]">{item.school}</div>
      <div className="text-[9.5px] text-gray-600">{item.degree}{item.fieldOfStudy && ` in ${item.fieldOfStudy}`}{item.gpa && ` | GPA: ${item.gpa}`}</div>
    </div>
    <span className="text-[9px] text-gray-600 shrink-0 ml-2">{item.startDate}{item.startDate && ' — '}{item.endDate}</span>
  </div>
);

const ProjItem = ({ item, accent = 'text-slate-800' }) => (
  <div>
    <div className="flex items-baseline gap-2">
      <span className={`font-bold text-[10.5px] ${accent}`}>{item.name}</span>
      {item.technologies && <span className="text-[9px] text-gray-500">— {item.technologies}</span>}
    </div>
    {item.link && <div className="text-[9px] text-blue-600">{item.link}</div>}
    {item.description && <p className="text-[9.5px] text-gray-700 mt-0.5 whitespace-pre-wrap leading-relaxed">{item.description}</p>}
  </div>
);

const CertItem = ({ item }) => (
  <div className="text-[10px] flex justify-between items-baseline">
    <span className="font-semibold">{item.name} <span className="font-normal text-gray-600">— {item.issuer}</span></span>
    <span className="text-gray-500 text-[9px] shrink-0 ml-2">{item.date}</span>
  </div>
);

// ─────────────────────────────────────────────
// TEMPLATE: Nova Premium (Premium) – two-column elegant
// ─────────────────────────────────────────────
const NovaPremiumTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-black w-full h-full font-['Inter',sans-serif] flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[35%] bg-emerald-800 text-white p-6 h-full flex flex-col">
        <h1 className="text-[20px] font-bold leading-tight uppercase tracking-widest text-emerald-100">{p.firstName}</h1>
        <h1 className="text-[20px] font-bold leading-tight uppercase tracking-widest">{p.lastName}</h1>
        {p.targetRole && <p className="text-[10px] text-emerald-300 mt-2 font-medium tracking-wide uppercase">{p.targetRole}</p>}
        
        <div className="mt-8 space-y-2 text-[9.5px] text-emerald-100/90 font-light">
          {p.email && <div>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.address && <div>{p.address}</div>}
          {p.linkedIn && <div className="truncate">{p.linkedIn}</div>}
          {p.github && <div className="truncate">{p.github}</div>}
        </div>

        {resume.skills?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-[11px] font-bold tracking-widest uppercase border-b border-emerald-600 pb-1 mb-3 text-emerald-300">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((s, i) => (
                <span key={i} className="text-[9px] bg-emerald-700/50 px-2 py-0.5 rounded-sm">{s}</span>
              ))}
            </div>
          </div>
        )}

        {resume.certifications?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-[11px] font-bold tracking-widest uppercase border-b border-emerald-600 pb-1 mb-3 text-emerald-300">Certifications</h3>
            <div className="space-y-3">
              {resume.certifications.map((c, i) => (
                <div key={i} className="text-[9.5px]">
                  <div className="font-bold">{c.name}</div>
                  <div className="text-emerald-300 text-[8.5px] mt-0.5">{c.issuer} | {c.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[65%] p-6 bg-white h-full">
        <div className="space-y-5">
          {p.summary && (
            <Section title="PROFILE" titleStyle="font-bold text-[12px] uppercase text-emerald-800 tracking-wider mb-2">
              <p className="text-[10px] leading-relaxed text-gray-700">{p.summary}</p>
            </Section>
          )}

          {resume.experience?.length > 0 && (
            <Section title="EXPERIENCE" titleStyle="font-bold text-[12px] uppercase text-emerald-800 tracking-wider mb-2">
              <div className="space-y-4">
                {resume.experience.map((e, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[10.5px] text-gray-900">{e.title}</span>
                      <span className="text-[9px] text-emerald-700 font-medium shrink-0 ml-2">{e.startDate}{e.startDate && ' - '}{e.current ? 'Present' : e.endDate}</span>
                    </div>
                    <div className="text-[9.5px] text-gray-600 italic mb-1">{e.company}{e.location && `, ${e.location}`}</div>
                    {e.description && <p className="text-[9.5px] text-gray-700 whitespace-pre-wrap leading-relaxed">{e.description}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {resume.projects?.length > 0 && (
            <Section title="PROJECTS" titleStyle="font-bold text-[12px] uppercase text-emerald-800 tracking-wider mb-2">
              <div className="space-y-3">
                {resume.projects.map((pr, i) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-[10.5px] text-gray-900">{pr.name}</span>
                      {pr.link && <span className="text-[8.5px] text-emerald-600">{pr.link}</span>}
                    </div>
                    {pr.technologies && <div className="text-[8.5px] text-gray-500 italic mt-0.5">{pr.technologies}</div>}
                    {pr.description && <p className="text-[9.5px] text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">{pr.description}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {resume.education?.length > 0 && (
            <Section title="EDUCATION" titleStyle="font-bold text-[12px] uppercase text-emerald-800 tracking-wider mb-2">
              <div className="space-y-3">
                {resume.education.map((e, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-[10.5px] text-gray-900">{e.school}</div>
                      <div className="text-[9.5px] text-gray-700">{e.degree}{e.fieldOfStudy && ` in ${e.fieldOfStudy}`}</div>
                      {e.gpa && <div className="text-[8.5px] text-gray-500 mt-0.5">GPA: {e.gpa}</div>}
                    </div>
                    <span className="text-[9px] text-emerald-700 font-medium shrink-0 ml-2">{e.startDate}{e.startDate && ' - '}{e.endDate}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TEMPLATE: Nova Pro (Pro) – stunning header
// ─────────────────────────────────────────────
const NovaProTemplate = ({ resume }) => {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-amber-50 text-black w-full h-full font-['Outfit',sans-serif] text-[11px] leading-[1.4] overflow-hidden">
      {/* Heavy Header */}
      <div className="bg-amber-700 text-white px-8 pt-8 pb-10 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/30 rounded-bl-full pointer-events-none"></div>
        <h1 className="text-[28px] font-bold uppercase tracking-[2px] leading-none mb-1">{p.firstName} {p.lastName}</h1>
        {p.targetRole && <p className="text-[12px] text-amber-200 uppercase tracking-widest font-medium mb-3">{p.targetRole}</p>}
        
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[9px] text-white/90 font-light max-w-lg mt-4">
          <ContactItem>{p.email}</ContactItem>
          <ContactItem>{p.phone}</ContactItem>
          <ContactItem>{p.address}</ContactItem>
          <ContactItem>{p.linkedIn}</ContactItem>
          <ContactItem>{p.github}</ContactItem>
        </div>
      </div>

      <div className="px-8 py-6 -mt-4 bg-white mx-4 rounded-t-xl shadow-lg h-full space-y-4">
        {p.summary && (
          <Section title="Professional Summary" accent="border-amber-700" titleStyle="font-bold text-[13px] text-amber-800 border-b-2 border-amber-200 mb-2 pb-0.5 inline-block">
            <p className="text-[10px] leading-relaxed text-gray-700">{p.summary}</p>
          </Section>
        )}

        <div className="flex gap-6">
          <div className="w-[60%] space-y-4">
            {resume.experience?.length > 0 && (
              <Section title="Work Experience" accent="border-amber-700" titleStyle="font-bold text-[13px] text-amber-800 border-b-2 border-amber-200 mb-2 pb-0.5 inline-block">
                {resume.experience.map((e, i) => <ExpItem key={i} item={e} accent="text-amber-800" />)}
              </Section>
            )}
            
            {resume.projects?.length > 0 && (
              <Section title="Key Projects" accent="border-amber-700" titleStyle="font-bold text-[13px] text-amber-800 border-b-2 border-amber-200 mb-2 pb-0.5 inline-block">
                {resume.projects.map((pr, i) => <ProjItem key={i} item={pr} accent="text-amber-800" />)}
              </Section>
            )}
          </div>
          
          <div className="w-[40%] space-y-4">
            {resume.skills?.length > 0 && (
              <Section title="Core Competencies" accent="border-amber-700" titleStyle="font-bold text-[13px] text-amber-800 border-b-2 border-amber-200 mb-2 pb-0.5 inline-block">
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {resume.skills.map((s, i) => (
                    <span key={i} className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded shadow-sm">{s}</span>
                  ))}
                </div>
              </Section>
            )}

            {resume.education?.length > 0 && (
              <Section title="Education" accent="border-amber-700" titleStyle="font-bold text-[13px] text-amber-800 border-b-2 border-amber-200 mb-2 pb-0.5 inline-block">
                {resume.education.map((e, i) => (
                  <div key={i} className="mb-2 last:mb-0">
                    <div className="font-bold text-[10px] text-gray-900">{e.school}</div>
                    <div className="text-[9px] text-gray-700">{e.degree}{e.fieldOfStudy && ` in ${e.fieldOfStudy}`}</div>
                    <div className="text-[8px] text-amber-600 font-medium">{e.startDate}{e.startDate && ' - '}{e.endDate}</div>
                  </div>
                ))}
              </Section>
            )}

            {resume.certifications?.length > 0 && (
              <Section title="Certifications" accent="border-amber-700" titleStyle="font-bold text-[13px] text-amber-800 border-b-2 border-amber-200 mb-2 pb-0.5 inline-block">
                {resume.certifications.map((c, i) => <CertItem key={i} item={c} />)}
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────
const TEMPLATE_MAP = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  'ats-classic': AtsClassicTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  corporate: CorporateTemplate,
  developer: DeveloperTemplate,
  'pro-elegant': ProElegantTemplate,
  'ats-max': AtsMaxTemplate,
  'nova-premium': NovaPremiumTemplate,
  'nova-pro': NovaProTemplate,
};

const ResumePreview = ({ resume }) => {
  const templateId = resume?.templateId || 'modern';
  const Template = TEMPLATE_MAP[templateId] || ModernTemplate;

  const isEmpty = !resume?.personalInfo?.firstName && !resume?.experience?.length && !resume?.education?.length;

  if (isEmpty) {
    return (
      <div className="bg-white text-black w-full aspect-[1/1.414] shadow-2xl rounded-sm flex items-center justify-center">
        <div className="text-center text-gray-300">
          <div className="text-5xl mb-3">📄</div>
          <p className="font-semibold text-gray-400">Your resume preview will appear here</p>
          <p className="text-sm text-gray-300 mt-1">Start filling in your details on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full aspect-[1/1.414] shadow-2xl rounded-sm overflow-hidden">
      <Template resume={resume} />
    </div>
  );
};

export default ResumePreview;
