import { useState, useEffect, useCallback, useRef } from "react";

// ─── TEMA BRANEX ───────────────────────────────────────────────────────────────
const T = {
  bg:      '#060B18',
  bg2:     '#0D1525',
  bg3:     '#111B30',
  card:    'rgba(255,255,255,0.04)',
  border:  'rgba(0,212,170,0.15)',
  signal:  '#00D4AA',
  neural:  '#6C5CE7',
  text:    '#F0F0F5',
  muted:   '#8899AA',
  danger:  '#FF6B6B',
  gold:    '#FFB347',
  display: "'Space Grotesk', sans-serif",
  mono:    "'JetBrains Mono', monospace",
  body:    "'Inter', sans-serif",
};

const grad = `linear-gradient(135deg, ${T.signal}, ${T.neural})`;
const gradText = {
  background: grad,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// ─── DATOS DE SLIDES ───────────────────────────────────────────────────────────
const SLIDES = [
  { id: 1,  type: 'HERO' },
  { id: 2,  type: 'STAT' },
  { id: 3,  type: 'CYCLE' },
  { id: 4,  type: 'MANIFESTO' },
  { id: 5,  type: 'ECORADAR' },
  { id: 6,  type: 'TALENT' },
  { id: 7,  type: 'CULTURE' },
  { id: 8,  type: 'CHAIN' },
  { id: 9,  type: 'COMMUNITY' },
  { id: 10, type: 'CLOSING' },
];

// ─── UTILIDADES ────────────────────────────────────────────────────────────────
function useVisible(delay = 0) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setV(true), delay);
    return () => clearTimeout(t);
  }, []);
  return v;
}

function stagger(v, delay) {
  return {
    opacity: v ? 1 : 0,
    transform: v ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
  };
}

function staggerLeft(v, delay) {
  return {
    opacity: v ? 1 : 0,
    transform: v ? 'translateX(0)' : 'translateX(-40px)',
    transition: `opacity 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
  };
}

function staggerRight(v, delay) {
  return {
    opacity: v ? 1 : 0,
    transform: v ? 'translateX(0)' : 'translateX(40px)',
    transition: `opacity 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
  };
}

// ─── TYPEWRITER ────────────────────────────────────────────────────────────────
function Typewriter({ texts, speed = 70 }) {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = texts[idx];
    const t = setTimeout(() => {
      if (!deleting && chars < current.length) setChars(c => c + 1);
      else if (!deleting && chars === current.length) setTimeout(() => setDeleting(true), 2200);
      else if (deleting && chars > 0) setChars(c => c - 1);
      else { setDeleting(false); setIdx(i => (i + 1) % texts.length); }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [chars, deleting, idx, texts, speed]);
  return (
    <span style={{ fontFamily: T.mono, fontSize: 'inherit' }}>
      {texts[idx].slice(0, chars)}
      <span style={{ animation: 'blink 1s step-end infinite', color: T.signal }}>█</span>
    </span>
  );
}

// ─── ANIMATED COUNTER ──────────────────────────────────────────────────────────
function Counter({ to, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 4);
      setVal(Math.floor(ease * to));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── PARTICLES BG ──────────────────────────────────────────────────────────────
function Particles({ count = 30 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 8,
      dur: Math.random() * 6 + 6,
      color: i % 3 === 0 ? T.signal : i % 3 === 1 ? T.neural : 'rgba(255,255,255,0.3)',
    }))
  ).current;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: p.color,
          animation: `particle-drift ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
          opacity: 0.6,
        }} />
      ))}
    </div>
  );
}

// ─── GRID LINES BG ─────────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `
        linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }} />
  );
}

// ─── LABEL CHIP ────────────────────────────────────────────────────────────────
function Chip({ children, color = T.signal }) {
  return (
    <span style={{
      fontFamily: T.mono, fontSize: 11, letterSpacing: 2,
      color, border: `1px solid ${color}40`,
      padding: '4px 12px', borderRadius: 4,
      background: `${color}10`, textTransform: 'uppercase',
    }}>{children}</span>
  );
}

// ─── SLIDE WRAPPER ─────────────────────────────────────────────────────────────
function SlideWrap({ children, bg = T.bg, style = {} }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: bg, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 64px', overflow: 'hidden',
      ...style,
    }}>
      <GridBg />
      <Particles count={20} />
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDES
// ═══════════════════════════════════════════════════════════════════════════════

function SlideHero() {
  const v = useVisible(100);
  return (
    <SlideWrap>
      {/* Glow orbs */}
      <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:`radial-gradient(circle, ${T.signal}15 0%, transparent 70%)`, top:'-20%', left:'-10%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:`radial-gradient(circle, ${T.neural}15 0%, transparent 70%)`, bottom:'-20%', right:'-5%', pointerEvents:'none' }} />

      <div style={{ position:'relative', textAlign:'center', maxWidth:900, zIndex:1 }}>
        {/* Logo B */}
        <div style={{ ...stagger(v, 0), display:'flex', justifyContent:'center', marginBottom:32 }}>
          <div style={{
            width:80, height:80, borderRadius:20,
            background: grad,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily: T.display, fontWeight:700, fontSize:36, color:'#fff',
            boxShadow:`0 0 40px ${T.signal}50`,
            animation:'pulse-glow 3s ease-in-out infinite',
          }}>B</div>
        </div>

        <div style={{ ...stagger(v, 100), marginBottom:16 }}>
          <Chip>Propósito Organizacional · Branex S.A.S</Chip>
        </div>

        <h1 style={{
          ...stagger(v, 200),
          fontFamily: T.display, fontWeight:700,
          fontSize: 'clamp(40px, 6vw, 80px)',
          lineHeight: 1.1, marginBottom:24, marginTop:16,
          ...gradText,
        }}>
          Desde Medellín,<br />para el planeta.
        </h1>

        <p style={{
          ...stagger(v, 350),
          fontFamily: T.mono, fontSize: 'clamp(14px, 1.8vw, 20px)',
          color: T.muted, marginBottom:40, lineHeight:1.6,
        }}>
          <Typewriter texts={[
            'Donde los datos se convierten en decisiones.',
            'Una empresa más competitiva, una comunidad más fuerte.',
            'Colombia puede construir el futuro — no solo importarlo.',
          ]} />
        </p>

        <div style={{ ...stagger(v, 500), display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          {['Datos e IA', 'EcoRadar', 'Talento sin Barreras', 'Cultura Branex'].map((tag, i) => (
            <span key={i} style={{
              fontFamily:T.mono, fontSize:12, color:T.muted,
              border:`1px solid rgba(255,255,255,0.1)`,
              padding:'6px 16px', borderRadius:20,
              background:'rgba(255,255,255,0.03)',
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

function SlideStat() {
  const v = useVisible(100);
  return (
    <SlideWrap>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at center, ${T.neural}20 0%, transparent 60%)`, pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:1000, width:'100%' }}>
        <div style={{ ...stagger(v, 0), marginBottom:24 }}>
          <Chip color={T.neural}>El problema sistémico</Chip>
        </div>

        <div style={{ ...stagger(v, 150), display:'flex', alignItems:'baseline', justifyContent:'center', gap:8, marginBottom:16 }}>
          <span style={{
            fontFamily:T.display, fontWeight:700,
            fontSize:'clamp(80px,14vw,160px)', lineHeight:1,
            ...gradText,
          }}>
            <Counter to={96} suffix="%" duration={2500} />
          </span>
        </div>

        <h2 style={{
          ...stagger(v, 300),
          fontFamily:T.display, fontWeight:600,
          fontSize:'clamp(18px,3vw,36px)',
          color:T.text, marginBottom:24, lineHeight:1.3,
        }}>
          de las empresas en Colombia<br />son micro, pequeñas o medianas.
        </h2>

        <div style={{ ...stagger(v, 450), width:120, height:2, background:grad, margin:'0 auto 32px' }} />

        <p style={{
          ...stagger(v, 550),
          fontFamily:T.body, fontSize:'clamp(14px,1.8vw,20px)',
          color:T.muted, maxWidth:700, margin:'0 auto', lineHeight:1.8,
        }}>
          Y la mayoría toma decisiones <strong style={{color:T.text}}>a ciegas</strong> — porque la inteligencia de datos 
          siempre fue privilegio de los grandes. El problema no es solo empresarial.
          Es <strong style={{color:T.signal}}>sistémico, social y nacional.</strong>
        </p>

        {/* Stats row */}
        <div style={{ ...stagger(v, 700), display:'flex', gap:32, justifyContent:'center', marginTop:48, flexWrap:'wrap' }}>
          {[
            { n: 80, s: '%', label: 'del empleo generado por PyMEs' },
            { n: 2.7, s: 'M+', label: 'empresas en Colombia' },
            { n: 0, s: '', label: 'con acceso real a BI de clase mundial' },
          ].map((item, i) => (
            <div key={i} style={{
              background:T.card, border:`1px solid ${T.border}`,
              borderRadius:16, padding:'24px 32px', minWidth:180,
              backdropFilter:'blur(10px)',
            }}>
              <div style={{ fontFamily:T.display, fontWeight:700, fontSize:'clamp(28px,4vw,48px)', ...gradText }}>
                {item.n === 0 ? <span style={{color:T.danger}}>0%</span> : <Counter to={item.n} suffix={item.s} />}
              </div>
              <div style={{ fontFamily:T.body, fontSize:13, color:T.muted, marginTop:8 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

function SlideCycle() {
  const v = useVisible(100);
  const items = [
    { emoji:'☕', label:'Café', sub:'Lo que exportamos' },
    { emoji:'🌸', label:'Flores', sub:'Lo que exportamos' },
    { emoji:'⛽', label:'Petróleo', sub:'Lo que exportamos' },
    { emoji:'💻', label:'Tecnología', sub:'Lo que IMPORTAMOS' },
    { emoji:'🧠', label:'Inteligencia', sub:'Lo que IMPORTAMOS' },
    { emoji:'📊', label:'Plataformas', sub:'Lo que IMPORTAMOS' },
  ];
  return (
    <SlideWrap>
      <div style={{ position:'relative', zIndex:1, maxWidth:1100, width:'100%' }}>
        <div style={{ ...stagger(v, 0), marginBottom:12, textAlign:'center' }}>
          <Chip color={T.gold}>El ciclo que Branex rompe</Chip>
        </div>
        <h2 style={{
          ...stagger(v, 150),
          fontFamily:T.display, fontWeight:700,
          fontSize:'clamp(24px,4vw,52px)',
          textAlign:'center', marginBottom:12, lineHeight:1.2,
          color:T.text,
        }}>
          Colombia exporta lo que <span style={gradText}>su tierra produce.</span><br />
          El futuro siempre llegó de afuera.
        </h2>
        <p style={{ ...stagger(v, 250), textAlign:'center', color:T.muted, fontSize:'clamp(13px,1.5vw,18px)', marginBottom:48 }}>
          Hasta ahora.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {items.map((item, i) => {
            const isImport = i >= 3;
            return (
              <div key={i} style={{
                ...stagger(v, 350 + i * 80),
                background: isImport ? `${T.signal}10` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isImport ? T.signal + '40' : 'rgba(255,255,255,0.08)'}`,
                borderRadius:16, padding:'24px 20px', textAlign:'center',
                transition:'transform 0.3s ease',
                cursor:'default',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize:36, marginBottom:12 }}>{item.emoji}</div>
                <div style={{ fontFamily:T.display, fontWeight:600, fontSize:'clamp(16px,2vw,22px)', color: isImport ? T.signal : T.text }}>{item.label}</div>
                <div style={{ fontFamily:T.mono, fontSize:11, color: isImport ? T.signal : T.muted, marginTop:6, letterSpacing:1 }}>{item.sub}</div>
              </div>
            );
          })}
        </div>

        <div style={{ ...stagger(v, 900), marginTop:40, textAlign:'center' }}>
          <span style={{
            fontFamily:T.display, fontWeight:600,
            fontSize:'clamp(16px,2.5vw,28px)',
            ...gradText,
          }}>
            Branex existe para romper ese ciclo.
          </span>
        </div>
      </div>
    </SlideWrap>
  );
}

function SlideManifesto() {
  const v = useVisible(100);
  const lines = [
    { text: 'Las empresas son el rostro de un país.', delay: 0 },
    { text: 'Son donde las familias tienen ingresos.', delay: 120 },
    { text: 'Donde las comunidades tienen empleo.', delay: 240 },
    { text: 'Donde las ciudades construyen identidad.', delay: 360 },
    { text: 'Cuando una empresa es inteligente —', delay: 480 },
    { text: 'no solo crece ella. Crece Colombia.', delay: 600, highlight: true },
  ];
  return (
    <SlideWrap>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 30% 60%, ${T.signal}12 0%, transparent 50%)`, pointerEvents:'none' }} />
      <div style={{ position:'relative', zIndex:1, maxWidth:900, width:'100%' }}>
        <div style={{ ...stagger(v, 0), marginBottom:40, display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:40, height:3, background:grad, borderRadius:2 }} />
          <Chip>Manifiesto</Chip>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {lines.map((line, i) => (
            <div key={i} style={{
              ...stagger(v, 100 + line.delay),
              fontFamily:T.display, fontWeight: line.highlight ? 700 : 400,
              fontSize:'clamp(20px,3.2vw,44px)',
              lineHeight:1.3,
              color: line.highlight ? 'transparent' : T.text,
              ...(line.highlight ? gradText : {}),
            }}>
              {line.text}
            </div>
          ))}
        </div>

        <div style={{ ...stagger(v, 850), marginTop:48, padding:'24px 32px', background:T.card, border:`1px solid ${T.border}`, borderRadius:16, borderLeft:`4px solid ${T.signal}` }}>
          <p style={{ fontFamily:T.body, fontSize:'clamp(14px,1.6vw,19px)', color:T.muted, lineHeight:1.8, fontStyle:'italic' }}>
            "Cuando el 96% de las empresas son PyMEs y la mayoría compite a ciegas, 
            el problema no es solo empresarial. Es <strong style={{color:T.text}}>sistémico, social, nacional.</strong>"
          </p>
          <p style={{ fontFamily:T.mono, fontSize:12, color:T.signal, marginTop:12 }}>— Propósito Branex S.A.S</p>
        </div>
      </div>
    </SlideWrap>
  );
}

function SlideEcoRadar() {
  const v = useVisible(100);
  const features = [
    { icon:'🌿', title:'Prácticas sostenibles', desc:'Por industria, aplicadas a la realidad colombiana' },
    { icon:'📋', title:'Guías de implementación', desc:'Reales, paso a paso, no teoría' },
    { icon:'🤝', title:'Entidades aliadas', desc:'Organizaciones ambientales certificadas' },
    { icon:'🔬', title:'Expertos certificados', desc:'Acompañamiento personalizado para cada empresa' },
  ];
  return (
    <SlideWrap>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 70% 30%, rgba(0,200,100,0.12) 0%, transparent 60%)`, pointerEvents:'none' }} />
      <div style={{ position:'relative', zIndex:1, maxWidth:1100, width:'100%' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          <div>
            <div style={{ ...stagger(v, 0), marginBottom:16 }}>
              <Chip color='#00C864'>EcoRadar — Plataforma Ambiental</Chip>
            </div>
            <h2 style={{
              ...stagger(v, 150),
              fontFamily:T.display, fontWeight:700,
              fontSize:'clamp(24px,3.5vw,48px)',
              lineHeight:1.2, marginBottom:24, color:T.text,
            }}>
              Una empresa que crece con datos<br />
              <span style={{ color:'#00C864' }}>también puede crecer con consciencia.</span>
            </h2>
            <p style={{
              ...stagger(v, 300),
              fontFamily:T.body, fontSize:'clamp(13px,1.5vw,18px)',
              color:T.muted, lineHeight:1.8, marginBottom:32,
            }}>
              Creemos en el poder transformador de la tecnología sobre el medio ambiente. 
              EcoRadar es una plataforma abierta que conecta el conocimiento ambiental 
              con quienes más lo necesitan.
            </p>
            <div style={{ ...stagger(v, 450) }}>
              <span style={{
                fontFamily:T.mono, fontSize:13,
                color:'#00C864', border:'1px solid #00C86440',
                padding:'8px 20px', borderRadius:8,
                background:'rgba(0,200,100,0.08)',
              }}>branex.co/ecoradar</span>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                ...stagger(v, 400 + i * 100),
                background:T.card, border:'1px solid rgba(0,200,100,0.15)',
                borderRadius:16, padding:'20px',
                transition:'transform 0.3s ease, box-shadow 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,200,100,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div style={{ fontSize:28, marginBottom:12 }}>{f.icon}</div>
                <div style={{ fontFamily:T.display, fontWeight:600, fontSize:'clamp(13px,1.5vw,16px)', color:T.text, marginBottom:8 }}>{f.title}</div>
                <div style={{ fontFamily:T.body, fontSize:12, color:T.muted, lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

function SlideTalent() {
  const v = useVisible(100);
  const groups = [
    { icon:'♿', color:T.signal, title:'Personas con discapacidad física', desc:'Branex es 100% digital y remota. Las barreras físicas no definen el potencial.' },
    { icon:'🧑‍💻', color:T.neural, title:'Jóvenes de comunidades vulnerables', desc:'Los formamos en tecnología e inteligencia de datos — desde cero.' },
    { icon:'🌄', color:T.gold, title:'Talento de municipios apartados', desc:'El potencial colombiano está repartido en todos los territorios. Nosotros lo buscamos.' },
  ];
  return (
    <SlideWrap>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 80%, ${T.neural}12 0%, transparent 60%)`, pointerEvents:'none' }} />
      <div style={{ position:'relative', zIndex:1, maxWidth:1100, width:'100%' }}>
        <div style={{ ...stagger(v, 0), textAlign:'center', marginBottom:48 }}>
          <Chip color={T.neural}>Talento Sin Barreras</Chip>
          <h2 style={{
            fontFamily:T.display, fontWeight:700,
            fontSize:'clamp(24px,3.5vw,52px)',
            lineHeight:1.2, marginTop:16, color:T.text,
          }}>
            Lo que importa es el <span style={gradText}>potencial.</span><br />
            Y el potencial colombiano es universal.
          </h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {groups.map((g, i) => (
            <div key={i} style={{
              ...stagger(v, 200 + i * 150),
              background:T.card,
              border:`1px solid ${g.color}25`,
              borderRadius:20, padding:'32px 28px',
              borderTop:`3px solid ${g.color}`,
              transition:'transform 0.3s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
            >
              <div style={{ fontSize:48, marginBottom:20 }}>{g.icon}</div>
              <h3 style={{ fontFamily:T.display, fontWeight:600, fontSize:'clamp(15px,1.8vw,20px)', color:g.color, marginBottom:16, lineHeight:1.3 }}>{g.title}</h3>
              <p style={{ fontFamily:T.body, fontSize:'clamp(12px,1.4vw,16px)', color:T.muted, lineHeight:1.7 }}>{g.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ ...stagger(v, 700), textAlign:'center', marginTop:40 }}>
          <span style={{ fontFamily:T.mono, fontSize:'clamp(13px,1.5vw,18px)', color:T.signal }}>
            "En Branex, lo que importa es el potencial — y el potencial colombiano está esperando ser visto."
          </span>
        </div>
      </div>
    </SlideWrap>
  );
}

function SlideCulture() {
  const v = useVisible(100);
  const values = [
    { icon:'🎨', title:'Libre Albedrío Creativo', desc:'Las ideas de todos tienen espacio. La rutina rígida mata la imaginación.' },
    { icon:'💸', title:'Salarios Deliberadamente Altos', desc:'El desarrollo social empieza por el bienestar económico de quienes construyen.' },
    { icon:'🌱', title:'Co-creadores, No Ejecutores', desc:'Aquí las pasiones individuales tienen lugar. Eres parte de algo que importa.' },
    { icon:'🔊', title:'Voces que se Escuchan', desc:'Nada hace sentir más a una persona que saberse valorada y escuchada.' },
  ];
  return (
    <SlideWrap>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 20% 50%, ${T.signal}10 0%, transparent 50%)`, pointerEvents:'none' }} />
      <div style={{ position:'relative', zIndex:1, maxWidth:1100, width:'100%', display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:64, alignItems:'center' }}>
        <div>
          <div style={{ ...stagger(v, 0), marginBottom:16 }}>
            <Chip color={T.gold}>Cultura Branex</Chip>
          </div>
          <h2 style={{
            ...stagger(v, 100),
            fontFamily:T.display, fontWeight:700,
            fontSize:'clamp(24px,3.2vw,44px)',
            lineHeight:1.2, marginBottom:24, color:T.text,
          }}>
            Construimos hacia adentro<br />lo que queremos cambiar<br />
            <span style={gradText}>hacia afuera.</span>
          </h2>
          <p style={{
            ...stagger(v, 250),
            fontFamily:T.body, fontSize:'clamp(13px,1.4vw,17px)',
            color:T.muted, lineHeight:1.8,
          }}>
            Los empleos que encadenan a la gente a rutinas rígidas matan lo más valioso 
            que tiene un ser humano: su capacidad de imaginar.
          </p>

          <div style={{ ...stagger(v, 400), marginTop:32, display:'flex', gap:12, flexWrap:'wrap' }}>
            {['100% remota', 'Digital-first', 'Open culture'].map((tag, i) => (
              <span key={i} style={{ fontFamily:T.mono, fontSize:11, color:T.gold, border:`1px solid ${T.gold}40`, padding:'4px 12px', borderRadius:20, background:`${T.gold}10` }}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {values.map((val, i) => (
            <div key={i} style={{
              ...stagger(v, 300 + i * 100),
              background:T.card, border:`1px solid ${T.border}`,
              borderRadius:16, padding:'24px 20px',
              transition:'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor=T.signal+'60'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=T.border; }}
            >
              <div style={{ fontSize:32, marginBottom:12 }}>{val.icon}</div>
              <div style={{ fontFamily:T.display, fontWeight:600, fontSize:'clamp(12px,1.4vw,15px)', color:T.text, marginBottom:8 }}>{val.title}</div>
              <div style={{ fontFamily:T.body, fontSize:12, color:T.muted, lineHeight:1.6 }}>{val.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

function SlideChain() {
  const v = useVisible(100);
  const steps = [
    { label:'Empresa', icon:'🏢', color:T.signal, desc:'Compite con datos' },
    { label:'Comunidad', icon:'🏘️', color:'#00B894', desc:'Más empleos, más ingresos' },
    { label:'Ciudad', icon:'🏙️', color:T.neural, desc:'Identidad y crecimiento' },
    { label:'Colombia', icon:'🇨🇴', color:T.gold, desc:'País más visible al mundo' },
    { label:'Planeta', icon:'🌍', color:'#74B9FF', desc:'Tecnología con propósito' },
  ];
  return (
    <SlideWrap>
      <div style={{ position:'relative', zIndex:1, maxWidth:1100, width:'100%', textAlign:'center' }}>
        <div style={{ ...stagger(v, 0), marginBottom:16 }}>
          <Chip color={T.signal}>La cadena de impacto</Chip>
        </div>
        <h2 style={{
          ...stagger(v, 100),
          fontFamily:T.display, fontWeight:700,
          fontSize:'clamp(22px,3.5vw,48px)',
          lineHeight:1.2, marginBottom:12, color:T.text,
        }}>
          El propósito no termina en el dashboard.
        </h2>
        <p style={{
          ...stagger(v, 200),
          fontFamily:T.display, fontWeight:600,
          fontSize:'clamp(16px,2.5vw,32px)',
          ...gradText, marginBottom:64,
        }}>
          Empieza ahí.
        </p>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, flexWrap:'nowrap', overflow:'hidden' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center' }}>
              <div style={{
                ...stagger(v, 300 + i * 120),
                display:'flex', flexDirection:'column', alignItems:'center',
                padding:'20px 16px',
              }}>
                <div style={{
                  width:80, height:80, borderRadius:'50%',
                  background:`${step.color}15`,
                  border:`2px solid ${step.color}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:32, marginBottom:16,
                  boxShadow:`0 0 30px ${step.color}30`,
                  transition:'transform 0.3s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                >
                  {step.icon}
                </div>
                <div style={{ fontFamily:T.display, fontWeight:700, fontSize:16, color:step.color }}>{step.label}</div>
                <div style={{ fontFamily:T.body, fontSize:12, color:T.muted, marginTop:6, maxWidth:90, textAlign:'center' }}>{step.desc}</div>
              </div>

              {i < steps.length - 1 && (
                <div style={{
                  ...stagger(v, 350 + i * 120),
                  display:'flex', flexDirection:'column', alignItems:'center', margin:'0 4px',
                }}>
                  <div style={{ width:40, height:2, background:`linear-gradient(90deg, ${steps[i].color}, ${steps[i+1].color})`, position:'relative' }}>
                    <div style={{ position:'absolute', right:-4, top:-4, width:10, height:10, borderTop:`2px solid ${steps[i+1].color}`, borderRight:`2px solid ${steps[i+1].color}`, transform:'rotate(45deg)' }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ ...stagger(v, 950), marginTop:48, padding:'20px 40px', background:T.card, border:`1px solid ${T.border}`, borderRadius:16, display:'inline-block' }}>
          <span style={{ fontFamily:T.mono, fontSize:'clamp(13px,1.5vw,18px)', color:T.signal }}>
            "Branex usa datos, IA y automatización para cerrar la brecha."
          </span>
        </div>
      </div>
    </SlideWrap>
  );
}

function SlideCommunity() {
  const v = useVisible(100);
  return (
    <SlideWrap>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 80% 20%, ${T.neural}15 0%, transparent 50%)`, pointerEvents:'none' }} />
      <div style={{ position:'relative', zIndex:1, maxWidth:1100, width:'100%', display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:64, alignItems:'center' }}>
        <div>
          <div style={{ ...stagger(v, 0), marginBottom:16 }}>
            <Chip color={T.neural}>Branex Educa</Chip>
          </div>
          <h2 style={{
            ...stagger(v, 100),
            fontFamily:T.display, fontWeight:700,
            fontSize:'clamp(22px,3.2vw,44px)',
            lineHeight:1.2, marginBottom:24, color:T.text,
          }}>
            Llevamos la inteligencia de datos<br />
            <span style={gradText}>donde nunca ha llegado.</span>
          </h2>

          {[
            { icon:'🏪', text:'A la plaza de mercado' },
            { icon:'👨‍🌾', text:'A la asociación de productores' },
            { icon:'💡', text:'Al emprendedor que no sabe que sus datos tienen una historia' },
          ].map((item, i) => (
            <div key={i} style={{
              ...stagger(v, 250 + i * 100),
              display:'flex', alignItems:'center', gap:16,
              marginBottom:20, padding:'16px 24px',
              background:T.card, border:`1px solid ${T.border}`,
              borderRadius:12,
            }}>
              <span style={{ fontSize:28 }}>{item.icon}</span>
              <span style={{ fontFamily:T.body, fontSize:'clamp(13px,1.5vw,18px)', color:T.text }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ ...stagger(v, 200) }}>
            <Chip color={T.gold}>Alianzas estratégicas</Chip>
          </div>
          {[
            { icon:'🏛️', name:'Alcaldías', desc:'Acceso a comunidades municipales' },
            { icon:'🏪', name:'Cámaras de Comercio', desc:'Red empresarial establecida' },
            { icon:'🤝', name:'Agremiaciones', desc:'Sectores productivos organizados' },
          ].map((a, i) => (
            <div key={i} style={{
              ...stagger(v, 350 + i * 120),
              background:T.card, border:`1px solid ${T.border}`,
              borderRadius:16, padding:'24px',
              transition:'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=T.neural+'60'; e.currentTarget.style.transform='translateX(8px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform='translateX(0)'; }}
            >
              <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                <span style={{ fontSize:32 }}>{a.icon}</span>
                <div>
                  <div style={{ fontFamily:T.display, fontWeight:600, fontSize:'clamp(14px,1.6vw,18px)', color:T.text }}>{a.name}</div>
                  <div style={{ fontFamily:T.body, fontSize:13, color:T.muted }}>{a.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

function SlideClosing() {
  const v = useVisible(100);
  return (
    <SlideWrap>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at center, ${T.signal}18 0%, ${T.neural}10 40%, transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 20% 80%, ${T.neural}15 0%, transparent 50%)`, pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:900 }}>
        <div style={{ ...stagger(v, 0), display:'flex', justifyContent:'center', marginBottom:40 }}>
          <div style={{
            width:100, height:100, borderRadius:24,
            background: grad,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:T.display, fontWeight:700, fontSize:44, color:'#fff',
            boxShadow:`0 0 60px ${T.signal}60, 0 0 120px ${T.neural}40`,
            animation:'pulse-glow 3s ease-in-out infinite, float 4s ease-in-out infinite',
          }}>B</div>
        </div>

        <div style={{ ...stagger(v, 150), marginBottom:8 }}>
          <Chip>ADN Medellín · ADN Reinvención</Chip>
        </div>

        <h1 style={{
          ...stagger(v, 250),
          fontFamily:T.display, fontWeight:700,
          fontSize:'clamp(32px,6vw,80px)',
          lineHeight:1.1, marginTop:16, marginBottom:24,
          ...gradText,
        }}>
          Colombia puede dejar<br />de importar el futuro.
        </h1>

        <p style={{
          ...stagger(v, 400),
          fontFamily:T.display, fontWeight:500,
          fontSize:'clamp(16px,2.2vw,28px)',
          color:T.text, marginBottom:16, lineHeight:1.5,
        }}>
          Puede empezar a construirlo.
        </p>

        <p style={{
          ...stagger(v, 500),
          fontFamily:T.body, fontSize:'clamp(14px,1.6vw,20px)',
          color:T.muted, marginBottom:48, lineHeight:1.8, maxWidth:700, margin:'0 auto 48px',
        }}>
          Una empresa más competitiva, una comunidad más fuerte,<br />
          un país más visible ante el mundo.
        </p>

        <div style={{ ...stagger(v, 650) }}>
          <div style={{
            fontFamily:T.display, fontWeight:700,
            fontSize:'clamp(24px,4vw,52px)',
            ...gradText, marginBottom:8,
          }}>
            Desde Medellín, para el planeta.
          </div>
          <div style={{
            fontFamily:T.mono, fontSize:'clamp(12px,1.4vw,16px)',
            color:T.muted, letterSpacing:3,
          }}>
            BRANEX · branex.co
          </div>
        </div>

        <div style={{ ...stagger(v, 800), marginTop:48, display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          {['Datos + IA', 'EcoRadar', 'Talento Sin Barreras', 'Cultura', 'Comunidad'].map((tag, i) => (
            <span key={i} style={{
              fontFamily:T.mono, fontSize:11, color:T.signal,
              border:`1px solid ${T.signal}40`, padding:'6px 16px', borderRadius:20,
              background:`${T.signal}08`,
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

// ─── RENDERER ─────────────────────────────────────────────────────────────────
const SLIDE_MAP = {
  HERO: SlideHero,
  STAT: SlideStat,
  CYCLE: SlideCycle,
  MANIFESTO: SlideManifesto,
  ECORADAR: SlideEcoRadar,
  TALENT: SlideTalent,
  CULTURE: SlideCulture,
  CHAIN: SlideChain,
  COMMUNITY: SlideCommunity,
  CLOSING: SlideClosing,
};

const SLIDE_LABELS = ['Inicio','El Problema','El Ciclo','Manifiesto','EcoRadar','Talento','Cultura','Impacto','Comunidad','Cierre'];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [direction, setDirection] = useState(1);
  const [showNav, setShowNav] = useState(false);

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= SLIDES.length || idx === current) return;
    setDirection(idx > current ? 1 : -1);
    setVisible(false);
    setTimeout(() => { setCurrent(idx); setVisible(true); }, 400);
  }, [current]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  useEffect(() => {
    const handler = (e) => {
      if (['ArrowRight','ArrowDown','Space'].includes(e.code)) { e.preventDefault(); next(); }
      if (['ArrowLeft','ArrowUp'].includes(e.code)) { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  // Touch swipe
  const touchRef = useRef(null);
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  const SlideComponent = SLIDE_MAP[SLIDES[current].type];
  const progress = ((current + 1) / SLIDES.length) * 100;

  const transitionStyle = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'translateX(0) scale(1)'
      : direction > 0
        ? 'translateX(60px) scale(0.97)'
        : 'translateX(-60px) scale(0.97)',
    filter: visible ? 'blur(0)' : 'blur(4px)',
    transition: visible
      ? 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.6s ease'
      : 'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease',
  };

  return (
    <div
      ref={touchRef}
      style={{ width:'100vw', height:'100vh', background:T.bg, position:'relative', overflow:'hidden' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:3, zIndex:200, background:'rgba(255,255,255,0.05)' }}>
        <div style={{
          height:'100%', background:grad,
          width:`${progress}%`,
          transition:'width 0.6s cubic-bezier(0.4,0,0.2,1)',
          boxShadow:`0 0 8px ${T.signal}`,
        }} />
      </div>

      {/* Slide */}
      <div style={{ position:'absolute', inset:0, ...transitionStyle }}>
        <SlideComponent key={current} />
      </div>

      {/* Dot navigation */}
      <nav style={{
        position:'fixed', right:24, top:'50%', transform:'translateY(-50%)',
        display:'flex', flexDirection:'column', gap:10, zIndex:200,
      }}
        onMouseEnter={() => setShowNav(true)}
        onMouseLeave={() => setShowNav(false)}
      >
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            title={SLIDE_LABELS[i]}
            style={{
              width: i === current ? 10 : 6,
              height: i === current ? 10 : 6,
              borderRadius:'50%',
              background: i === current ? T.signal : i < current ? `${T.signal}60` : 'rgba(255,255,255,0.2)',
              cursor:'pointer',
              transition:'all 0.3s ease',
              boxShadow: i === current ? `0 0 12px ${T.signal}` : 'none',
              position:'relative',
            }}
          >
            {showNav && (
              <span style={{
                position:'absolute', right:20, top:'50%', transform:'translateY(-50%)',
                fontFamily:T.mono, fontSize:10, color:T.muted, whiteSpace:'nowrap',
                background:T.bg2, padding:'3px 8px', borderRadius:4,
                border:`1px solid ${T.border}`,
                opacity: showNav ? 1 : 0,
                transition:'opacity 0.2s ease',
              }}>{SLIDE_LABELS[i]}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Arrow buttons */}
      {current > 0 && (
        <button onClick={prev} style={{
          position:'fixed', left:24, top:'50%', transform:'translateY(-50%)',
          background:'rgba(255,255,255,0.05)', border:`1px solid ${T.border}`,
          borderRadius:'50%', width:48, height:48, cursor:'pointer',
          color:T.muted, fontSize:20, display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:200, backdropFilter:'blur(10px)',
          transition:'all 0.3s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.color=T.signal; e.currentTarget.style.borderColor=T.signal; }}
          onMouseLeave={e => { e.currentTarget.style.color=T.muted; e.currentTarget.style.borderColor=T.border; }}
        >←</button>
      )}
      {current < SLIDES.length - 1 && (
        <button onClick={next} style={{
          position:'fixed', right:64, bottom:32,
          background:grad, border:'none',
          borderRadius:12, padding:'12px 28px', cursor:'pointer',
          color:'#fff', fontFamily:T.display, fontWeight:600, fontSize:14,
          zIndex:200, boxShadow:`0 4px 20px ${T.signal}40`,
          transition:'all 0.3s ease',
          display:'flex', alignItems:'center', gap:8,
        }}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
        >
          Siguiente <span>→</span>
        </button>
      )}

      {/* Slide counter */}
      <div style={{
        position:'fixed', bottom:32, left:32, zIndex:200,
        fontFamily:T.mono, fontSize:12, color:T.muted,
        display:'flex', alignItems:'center', gap:8,
      }}>
        <span style={{ color:T.signal }}>{String(current + 1).padStart(2,'0')}</span>
        <span>/</span>
        <span>{String(SLIDES.length).padStart(2,'0')}</span>
        <span style={{ marginLeft:8, color:T.muted }}>· {SLIDE_LABELS[current]}</span>
      </div>

      {/* Keyboard hint */}
      {current === 0 && (
        <div style={{
          position:'fixed', bottom:32, left:'50%', transform:'translateX(-50%)',
          fontFamily:T.mono, fontSize:11, color:T.muted,
          display:'flex', gap:8, alignItems:'center', zIndex:200,
          animation:'float 3s ease-in-out infinite',
        }}>
          <span style={{ border:`1px solid rgba(255,255,255,0.2)`, borderRadius:4, padding:'2px 8px' }}>←</span>
          <span style={{ border:`1px solid rgba(255,255,255,0.2)`, borderRadius:4, padding:'2px 8px' }}>→</span>
          <span style={{ color:`rgba(255,255,255,0.3)` }}>o swipe para navegar</span>
        </div>
      )}
    </div>
  );
}
