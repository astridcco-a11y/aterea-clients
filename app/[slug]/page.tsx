'use client'

import { db } from '../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useEffect } from 'react'

interface Client {
  client_name: string
  brand_name: string
  package_name: string
  services?: any
}

export default function ClientPage({ params }: { params: Promise<{ slug: string }> }) {
  useEffect(() => {
    async function loadPage() {
      const { slug } = await params

      try {
        const q = query(collection(db, 'clients'), where('slug', '==', slug))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          document.body.innerHTML = '<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">Cliente no encontrado</div>'
          return
        }

        const client = querySnapshot.docs[0].data() as Client

        // Inyectar datos en el HTML
        const welcomeClient = document.getElementById('welcome-client')
        const officialBrand = document.getElementById('official-brand')
        const submissionName = document.getElementById('submission-name')
        const serviceList = document.getElementById('service-list')

        if (welcomeClient) welcomeClient.textContent = client.client_name
        if (officialBrand) officialBrand.textContent = client.brand_name
        if (submissionName) submissionName.textContent = `${client.client_name}, AHORA NOS TOCA A NOSOTROS.`

        if (serviceList && client.services?.length > 0) {
          serviceList.innerHTML = client.services
            .map((service: any, i: number) => `
              <article class="service-item">
                <span class="service-number">${String(i + 1).padStart(2, '0')}</span>
                <h3 class="service-name">${service.name || ''}</h3>
                <p class="service-detail">${service.detail || ''}</p>
              </article>
            `)
            .join('')
        }

        // Agregar timeline stages
        const processGrid = document.getElementById('process-grid')
        if (processGrid) {
          const existingFill = processGrid.querySelector('.process-fill')
          processGrid.innerHTML = ''
          if (existingFill) processGrid.appendChild(existingFill)

          const stages = ['DISCOVERY', 'STRATEGY', 'CREATION', 'REVIEW', 'LAUNCH', 'OPTIMIZE']
          stages.forEach((stage, index) => {
            const stageEl = document.createElement('article')
            stageEl.className = 'stage-item'
            stageEl.innerHTML = `
              <span class="stage-index micro">${String(index + 1).padStart(2, '0')}</span>
              <h3 class="stage-name">${stage}</h3>
            `
            processGrid.appendChild(stageEl)
          })
        }

        // Ejecutar evento para abrir invitación (opcional)
        const envelopeTrigger = document.getElementById('envelope-trigger')
        if (envelopeTrigger) {
          envelopeTrigger.addEventListener('click', function() {
            const layer = document.getElementById('invitation-layer')
            if (layer) {
              this.classList.add('is-opening')
              setTimeout(() => {
                layer.classList.add('is-open')
                const siteShell = document.getElementById('site-shell')
                if (siteShell) {
                  siteShell.hidden = false
                  requestAnimationFrame(() => siteShell.classList.add('ready'))
                }
              }, 1850)
            }
          })
        }

        const skipIntro = document.getElementById('skip-intro')
        if (skipIntro) {
          skipIntro.addEventListener('click', function() {
            const envelope = document.getElementById('envelope-trigger') as HTMLButtonElement
            if (envelope) envelope.disabled = true
            const layer = document.getElementById('invitation-layer')
            if (layer) {
              layer.classList.add('is-open')
              const siteShell = document.getElementById('site-shell')
              if (siteShell) {
                siteShell.hidden = false
                requestAnimationFrame(() => siteShell.classList.add('ready'))
              }
            }
          })
        }

        const startBrief = document.getElementById('start-brief')
        if (startBrief) {
          startBrief.addEventListener('click', function() {
            const storyView = document.getElementById('story-view')
            const briefView = document.getElementById('brief-view')
            const brandNav = document.querySelector('.brand-nav')
            if (storyView) storyView.hidden = true
            if (briefView) briefView.hidden = false
            if (brandNav) (brandNav as HTMLElement).hidden = true
            window.scrollTo({ top: 0, behavior: 'smooth' })
          })
        }

        const bridgeStartBrief = document.getElementById('bridge-start-brief')
        if (bridgeStartBrief) {
          bridgeStartBrief.addEventListener('click', function() {
            const storyView = document.getElementById('story-view')
            const briefView = document.getElementById('brief-view')
            if (storyView) storyView.hidden = true
            if (briefView) briefView.hidden = false
            window.scrollTo({ top: 0, behavior: 'smooth' })
          })
        }

        // Inicializar observers
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible')
          })
        }, { threshold: 0.18 })

        document.querySelectorAll('.observe').forEach(element => observer.observe(element))

      } catch (err) {
        console.error('Error loading client:', err)
      }
    }

    loadPage()
  }, [params])

  return (
    <>
      <style>{`
        :root {
          --ink: #0A0A0C;
          --ink-soft: #272329;
          --cream: #FFFBF2;
          --cream-deep: #F4EFE7;
          --pink: #B44170;
          --violet: #6A5695;
          --orange: #EF5227;
          --line: rgba(10,10,12,.18);
          --ease-expo: cubic-bezier(.16,1,.3,1);
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; background: var(--cream); }
        body {
          width: 100%;
          margin: 0;
          overflow-x: hidden;
          color: var(--ink);
          background: var(--cream);
          font-family: Versailles, serif;
        }
        button, input, textarea { font: inherit; }
        button { cursor: pointer; }
        .display { font-family: "HK Grotesk", sans-serif; letter-spacing: -.075em; }
        .ui { font-family: "DM Sans", sans-serif; letter-spacing: .015em; }
        .micro { font-family: "DM Sans", sans-serif; font-size: .7rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
        .screen-reader { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        :focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }
        #custom-cursor {
          position: fixed; z-index: 100; pointer-events: none; width: 18px; height: 18px;
          border: 1px solid var(--pink); border-radius: 50%; transform: translate(-50%,-50%);
          transition: width .2s ease, height .2s ease, background .2s ease;
          mix-blend-mode: multiply;
        }
        #custom-cursor.active { width: 42px; height: 42px; background: rgba(180,65,112,.12); }
        .invitation-layer {
          position: fixed; z-index: 70; inset: 0; display: grid; place-items: center;
          background: var(--cream); transition: opacity .8s var(--ease-expo), visibility .8s;
        }
        .invitation-layer.is-open { opacity: 0; visibility: hidden; pointer-events: none; }
        .invitation-inner { width: min(90vw, 530px); text-align: center; }
        .envelope-stage { perspective: 1300px; min-height: 355px; display: grid; place-items: center; }
        .envelope-trigger {
          position: relative; width: min(80vw, 450px); aspect-ratio: 1.48 / 1; border: 0;
          padding: 0; background: transparent; transform-style: preserve-3d;
          transition: transform 1.1s var(--ease-expo);
        }
        .envelope-trigger:hover { transform: translateY(-8px) rotateX(2deg); }
        .envelope-trigger:active { transform: translateY(-3px) scale(.99); }
        .envelope-trigger:focus-visible { outline: 2px solid var(--orange); outline-offset: 8px; }
        .invitation-copy [role="button"] { cursor: pointer; }
        .invitation-copy [role="button"]:focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }
        .envelope-paper {
          position: absolute; inset: 0; overflow: hidden; border-radius: 3px;
          background: linear-gradient(125deg, #fffdf7 0%, #eee8dc 100%);
          box-shadow: 0 26px 55px rgba(10,10,12,.20), inset 0 0 0 1px rgba(10,10,12,.09);
        }
        .envelope-paper::before {
          content: ""; position: absolute; inset: 0; opacity: .34;
          background-image: repeating-linear-gradient(0deg, transparent 0, transparent 4px, rgba(10,10,12,.03) 5px);
        }
        .envelope-back { clip-path: polygon(0 0,100% 0,100% 100%,0 100%); }
        .envelope-fold-left,.envelope-fold-right,.envelope-fold-bottom {
          position: absolute; inset: 0; background: #f8f2e8; border: 1px solid rgba(10,10,12,.06);
        }
        .envelope-fold-left { clip-path: polygon(0 0, 52% 52%, 0 100%); }
        .envelope-fold-right { clip-path: polygon(100% 0,48% 52%,100% 100%); }
        .envelope-fold-bottom { clip-path: polygon(0 100%,50% 47%,100% 100%); background: #f0eadf; }
        .letter {
          position: absolute; z-index: 1; left: 8%; right: 8%; bottom: 7%; height: 76%;
          display: grid; place-items: center; padding: 24px; background: #fffdf7;
          box-shadow: 0 8px 14px rgba(10,10,12,.09); transform: translateY(12px); transition: transform 1.3s var(--ease-expo);
        }
        .letter-mark { color: var(--ink); font-size: clamp(1.7rem,5vw,2.6rem); font-weight: 700; }
        .letter-line { width: 75%; height: 1px; margin-top: 12px; background: var(--pink); }
        .envelope-flap {
          position: absolute; z-index: 4; inset: 0; transform-origin: top center;
          background: #f7f0e5; clip-path: polygon(0 0,100% 0,50% 54%);
          filter: drop-shadow(0 1px 0 rgba(10,10,12,.1)); transition: transform 1.2s var(--ease-expo);
          backface-visibility: hidden;
        }
        .seal {
          position: absolute; z-index: 6; left: 50%; top: 43%; width: 58px; height: 58px;
          display: grid; place-items: center; border-radius: 50%; background: var(--pink); color: var(--cream);
          box-shadow: 0 4px 10px rgba(10,10,12,.18); transform: translate(-50%,-50%); transition: opacity .4s ease;
        }
        .envelope-trigger.is-opening { transform: translateY(-28px) scale(1.04); box-shadow: 0 34px 70px rgba(10,10,12,.24); }
        .envelope-trigger.is-opening .envelope-flap { transform: rotateX(178deg); }
        .envelope-trigger.is-opening .letter { transform: translateY(-130px) scale(1.04); }
        .envelope-trigger.is-opening .seal { opacity: 0; }
        .invitation-copy { margin-top: 26px; }
        .skip-button { margin-top: 18px; border: 0; background: transparent; color: var(--ink); text-decoration: underline; text-underline-offset: 4px; font-size: .78rem; }
        .site-shell { opacity: 0; transition: opacity .7s ease; }
        .site-shell.ready { opacity: 1; }
        .site-shell[hidden], .brief-view[hidden], .submission-view[hidden] { display: none !important; }
        .brand-nav {
          position: fixed; z-index: 40; top: 0; left: 0; width: 100%; display: flex; align-items: center;
          justify-content: space-between; padding: 22px clamp(18px,4vw,58px); mix-blend-mode: multiply;
        }
        .brand-nav img { width: 108px; height: auto; }
        .nav-state { border: 0; background: transparent; color: var(--ink); }
        .editorial-section { position: relative; width: 100%; padding: clamp(100px,15vw,210px) clamp(20px,7vw,110px); }
        .welcome-section { min-height: calc(100 * min(var(--vh, 1vh), 1vh)); display: flex; align-items: flex-end; background: var(--cream); }
        .welcome-copy { max-width: 1170px; }
        .eyebrow-line { display: flex; gap: 12px; align-items: center; margin-bottom: 28px; }
        .eyebrow-line::before { content: ""; width: 42px; height: 1px; background: currentColor; }
        .hero-title { max-width: 1140px; margin: 0; font-size: clamp(4.2rem,12vw,12rem); line-height: .79; font-weight: 600; }
        .hero-title .client-inline { color: var(--pink); }
        .welcome-body { max-width: 550px; margin: 55px 0 0 auto; font-size: clamp(1.05rem,1.8vw,1.38rem); line-height: 1.55; }
        .reveal-word { display: inline-block; clip-path: inset(0 0 100% 0); transform: translateY(18px); transition: clip-path .85s var(--ease-expo), transform .85s var(--ease-expo); }
        .is-visible .reveal-word { clip-path: inset(0 0 0 0); transform: translateY(0); }
        .dark-section { color: var(--cream); background: var(--ink); }
        .official-section { min-height: calc(100 * min(var(--vh, 1vh), 1vh)); display: flex; flex-direction: column; justify-content: center; }
        .official-title { max-width: 1100px; margin: 0; font-size: clamp(5rem,15vw,14rem); line-height: .72; font-weight: 600; }
        .official-note { margin-top: 50px; max-width: 380px; margin-left: auto; color: rgba(255,251,242,.72); line-height: 1.55; }
        .collaboration-x { color: var(--orange); font-size: 1.8em; vertical-align: -.03em; }
        .section-title { max-width: 900px; margin: 0; font-size: clamp(3.8rem,10vw,10rem); line-height: .79; font-weight: 600; }
        .package-kicker { margin: 34px 0 80px; font-size: 1rem; }
        .service-list { border-top: 1px solid var(--line); }
        .service-item { display: grid; grid-template-columns: minmax(80px,.35fr) 1fr minmax(150px,.7fr); gap: 22px; align-items: baseline; padding: 35px 0; border-bottom: 1px solid var(--line); transition: opacity .35s ease, transform .35s ease; }
        .service-item:hover { transform: translateX(9px); }
        .service-number { color: var(--pink); font-family: "DM Sans", sans-serif; font-size: .78rem; }
        .service-name { margin: 0; font-family: "HK Grotesk", sans-serif; font-size: clamp(2.25rem,5vw,5.8rem); line-height: .85; letter-spacing: -.07em; }
        .service-detail { margin: 0; max-width: 250px; font-size: .95rem; line-height: 1.5; }
        .process-grid { max-width: 1050px; margin: 85px auto 0; position: relative; padding-left: clamp(30px,8vw,100px); }
        .process-grid::before { content:""; position:absolute; left: 10px; top: 0; width: 1px; height: 100%; background: rgba(255,251,242,.23); }
        .process-fill { position:absolute; left: 10px; top:0; width:1px; height:0; background: var(--orange); transition: height .8s var(--ease-expo); }
        .stage-item { position: relative; padding: 0 0 56px; opacity: .4; transform: translateX(-10px); transition: .55s var(--ease-expo); }
        .stage-item::before { content:""; position:absolute; left: -96px; top: 10px; width: 9px; height: 9px; border: 1px solid var(--cream); border-radius: 50%; background: var(--ink); }
        .stage-item.active { opacity: 1; transform: translateX(0); }
        .stage-item.active::before { background: var(--orange); border-color: var(--orange); transform: scale(1.35); }
        .stage-index { color: var(--orange); }
        .stage-name { margin: 7px 0 0; font-family: "HK Grotesk"; letter-spacing: -.05em; font-size: clamp(2.4rem,5vw,5rem); }
        .next-section { min-height: calc(92 * min(var(--vh, 1vh), 1vh)); display:flex; flex-direction:column; justify-content:center; }
        .next-lead { max-width: 900px; margin: 58px 0 0; color: var(--pink); font-size: clamp(3.2rem, 8vw, 8.5rem); line-height: .82; }
        .next-copy { max-width: 510px; margin: 42px 0 0 auto; font-size: clamp(1.2rem, 2vw, 1.55rem); line-height: 1.45; }
        .next-brief-button { margin-top: 54px; width: min(100%, 620px); min-height: 86px; justify-content: center; padding: 24px 30px; font-size: clamp(1rem, 1.5vw, 1.25rem); }
        .next-brief-button:hover { transform: translateY(-5px) scale(1.01); }
        .bridge { min-height: calc(92 * min(var(--vh, 1vh), 1vh)); display:flex; flex-direction:column; justify-content:center; }
        .bridge-copy { margin: 38px 0; max-width: 450px; font-size: 1.18rem; line-height: 1.5; }
        .contact-block { max-width: 450px; margin: 0 0 54px; padding-top: 22px; border-top: 1px solid var(--line); }
        .contact-block-title { margin: 0 0 20px; color: var(--ink); font-family: "DM Sans", sans-serif; font-size: .72rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
        .contact-details { display: flex; flex-direction: column; gap: 8px; color: var(--ink); font-family: "DM Sans", sans-serif; font-size: .82rem; letter-spacing: .04em; line-height: 1.45; }
        .contact-label { color: var(--pink); font-size: .68rem; font-weight: 700; letter-spacing: .14em; }
        .contact-link { width: fit-content; color: inherit; text-decoration: none; text-underline-offset: 4px; transition: color .2s ease, text-decoration-color .2s ease; }
        .contact-link:hover { color: var(--pink); text-decoration: underline; }
        .primary-action {
          display: inline-flex; align-items: center; gap: 14px; width: fit-content; border: 1px solid var(--ink);
          padding: 16px 22px; color: var(--cream); background: var(--ink); font-family: "DM Sans"; font-size: .77rem; font-weight: 700;
          letter-spacing: .11em; text-transform: uppercase; transition: transform .25s ease, background .25s ease, color .25s ease;
        }
        .primary-action:hover { transform: translateY(-3px); color: var(--ink); background: var(--orange); border-color: var(--orange); }
        .primary-action:disabled { opacity: .5; cursor: wait; transform: none; }
        .secondary-action { border: 0; border-bottom: 1px solid currentColor; padding: 4px 0; color: inherit; background: transparent; font-family: "DM Sans"; font-size: .75rem; letter-spacing: .1em; text-transform: uppercase; }
        .brief-view { min-height: calc(100 * min(var(--vh, 1vh), 1vh)); background: var(--cream); }
        .brief-header { position: sticky; top: 0; z-index: 20; display: flex; justify-content: space-between; align-items:center; padding: 20px clamp(18px,4vw,58px); background: rgba(255,251,242,.94); border-bottom: 1px solid var(--line); backdrop-filter: blur(8px); }
        .brief-header img { width: 97px; }
        .progress-wrap { display: flex; gap: 14px; align-items:center; }
        .progress-track { width: min(20vw,160px); height: 1px; overflow:hidden; background: rgba(10,10,12,.18); }
        .progress-bar { width: 0; height: 100%; background: var(--pink); transition: width .35s var(--ease-expo); }
        .brief-stage { min-height: calc(100 * min(var(--vh, 1vh), 1vh) - 70px); display: grid; grid-template-columns: minmax(0,1fr); align-content: center; padding: clamp(45px,7vw,105px) clamp(20px,12vw,180px); }
        .question-shell { width: 100%; max-width: 960px; margin: auto; }
        .question-num { color: var(--pink); }
        .question-title { margin: 18px 0 19px; font-size: clamp(3rem,7vw,7.2rem); line-height: .8; font-weight: 600; white-space: pre-line; }
        .question-copy { max-width: 610px; margin: 0 0 42px; font-size: 1.05rem; line-height: 1.55; }
        .submission-view { min-height: calc(100 * min(var(--vh, 1vh), 1vh)); display:grid; place-items:center; padding:40px 8vw; text-align:center; background:var(--ink); color:var(--cream); }
        .submission-view img { width:min(170px,45vw); margin:0 auto 55px; }
        .submission-title { margin:0; font-size:clamp(4.5rem,12vw,11rem); line-height:.75; font-weight:600; }
        .submission-copy { max-width:560px; margin:38px auto; font-size:1.1rem; line-height:1.6; color:rgba(255,251,242,.74); }
        @media(max-width:700px) {
          #custom-cursor { display:none; }
          .brand-nav { position:absolute; padding:17px 20px; }
          .welcome-section { min-height: calc(80 * min(var(--vh, 1vh), 1vh)); }
          .service-item { grid-template-columns: 38px 1fr; gap: 12px; }
          .service-detail { grid-column:2; max-width: none; }
          .process-grid { margin-top:55px; padding-left:47px; }
          .stage-item::before { left:-41px; }
          .question-title { font-size: clamp(3rem,15vw,5rem); }
          .envelope-stage { min-height:310px; }
        }
      `}</style>
      <div id="custom-cursor" aria-hidden="true"></div>
      <section id="invitation-layer" className="invitation-layer" aria-label="Invitación privada Aterea">
        <div className="invitation-inner">
          <div className="envelope-stage">
            <button id="envelope-trigger" className="envelope-trigger" type="button" aria-describedby="invitation-instruction">
              <span className="screen-reader">Abrir invitación privada de Aterea</span>
              <span className="envelope-paper envelope-back"></span>
              <span className="letter"><span><span className="letter-mark display">ATEREA</span><span className="letter-line"></span></span></span>
              <span className="envelope-paper envelope-fold-left"></span>
              <span className="envelope-paper envelope-fold-right"></span>
              <span className="envelope-paper envelope-fold-bottom"></span>
              <span className="envelope-flap"></span>
              <span className="seal micro">A</span>
            </button>
          </div>
          <div className="invitation-copy">
            <p className="canva-text micro" style={{color: 'rgb(10, 10, 12)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15rem'}}>PRIVATE INVITATION</p>
            <p id="invitation-instruction" className="canva-text ui mt-3 text-sm font-semibold tracking-wide" role="button" tabIndex={0} style={{color: 'rgb(10, 10, 12)', fontWeight: '600', fontSize: '14px'}}>CLICK TO OPEN YOUR SURPRISE ↗</p>
          </div>
          <button id="skip-intro" className="canva-button skip-button" type="button" style={{color: 'rgb(10, 10, 12)', fontWeight: '500', fontSize: '12px'}}>SALTAR ANIMACIÓN</button>
        </div>
      </section>
      <div id="site-shell" className="site-shell" hidden>
        <header className="brand-nav" aria-label="Navegación Aterea">
          <div style={{fontSize: '32px', fontWeight: 'bold', color: 'rgb(10, 10, 12)'}}>ATEREA</div>
          <button id="resume-brief-button" className="nav-state micro" type="button" hidden="">RETOMAR BRIEF</button>
        </header>
        <main id="story-view">
          <section className="editorial-section welcome-section observe">
            <div className="welcome-copy">
              <div className="eyebrow-line"><span className="canva-text micro" style={{color: 'rgb(180, 65, 112)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15rem'}}>WELCOME TO ATEREA</span></div>
              <h1 className="hero-title display"><span className="reveal-word">HOLA,</span><br/><span id="welcome-client" className="reveal-word client-inline"></span><span className="reveal-word">.</span></h1>
              <p className="canva-text ui mt-7 text-lg" style={{color: 'rgb(10, 10, 12)', fontWeight: '500', fontSize: '20px'}}>Qué bueno tenerte de este lado.</p>
              <p className="canva-text welcome-body" style={{color: 'rgb(10, 10, 12)', fontWeight: '400', fontSize: '18px', lineHeight: '1.55'}}>Tu proyecto con Aterea comienza aquí. Antes de crear, queremos entender tu negocio, tu visión y hacia dónde quieres llevarlo. Porque antes de diseñar, necesitamos entender.</p>
            </div>
          </section>
          <section className="editorial-section dark-section official-section observe">
            <p className="canva-text micro mb-9" style={{color: 'rgb(239, 82, 39)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15rem'}}>PRIVATE COLLABORATION</p>
            <h2 className="official-title display"><span className="reveal-word">YOU'RE</span><br/><span className="reveal-word">OFFICIALLY</span><br/><span className="reveal-word">IN.</span></h2>
            <p className="official-note"><span id="official-brand"></span><span className="collaboration-x">×</span> ATEREA</p>
          </section>
          <section className="editorial-section">
            <p className="canva-text micro" style={{color: 'rgb(180, 65, 112)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15rem'}}>TU PAQUETE ATEREA</p>
            <h2 className="canva-text section-title display" style={{color: 'rgb(10, 10, 12)', fontWeight: '600', fontSize: '26px', letterSpacing: '-0.07rem', lineHeight: '0.79'}}>THIS IS WHAT WE'RE BUILDING.</h2>
            <p className="canva-text package-kicker" style={{color: 'rgb(10, 10, 12)', fontWeight: '400', fontSize: '17px'}}>El alcance de tu proyecto:</p>
            <div id="service-list" className="service-list" aria-live="polite"></div>
          </section>
          <section className="editorial-section dark-section">
            <p className="canva-text micro" style={{color: 'rgb(239, 82, 39)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15rem'}}>ASÍ TRABAJAREMOS</p>
            <h2 className="canva-text section-title display mt-7" style={{color: 'rgb(255, 251, 242)', fontWeight: '600', fontSize: '26px', letterSpacing: '-0.07rem', lineHeight: '0.79'}}>FROM HERE TO THERE.</h2>
            <div id="process-grid" className="process-grid"><div id="process-fill" className="process-fill"></div></div>
          </section>
          <section className="editorial-section next-section observe">
            <p className="canva-text micro" style={{color: 'rgb(180, 65, 112)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15rem'}}>WHAT HAPPENS NOW?</p>
            <h2 className="canva-text section-title display mt-7" style={{color: 'rgb(10, 10, 12)', fontWeight: '600', fontSize: '26px', letterSpacing: '-0.07rem', lineHeight: '0.79'}}>OK. ¿Y AHORA QUÉ?</h2>
            <p className="canva-text next-lead display" style={{color: 'rgb(180, 65, 112)', fontWeight: '600', fontSize: '64px', letterSpacing: '-0.07rem', lineHeight: '0.82'}}>CUÉNTANOS TODO DE TI.</p>
            <p className="canva-text next-copy" style={{color: 'rgb(10, 10, 12)', fontWeight: '400', fontSize: '20px', lineHeight: '1.45'}}>Completa tu Brand Brief y cuéntanos lo que hace diferente a tu marca.</p>
            <button id="start-brief" className="canva-button primary-action next-brief-button" type="button" style={{background: 'rgb(10, 10, 12)', color: 'rgb(255, 251, 242)', fontWeight: '700', fontSize: '16px', letterSpacing: '0.1rem'}}>START MY BRAND BRIEF →</button>
          </section>
          <section className="editorial-section bridge observe">
            <h2 className="canva-text section-title display" style={{color: 'rgb(10, 10, 12)', fontWeight: '600', fontSize: '26px', letterSpacing: '-0.07rem', lineHeight: '0.79'}}>ENOUGH ABOUT US.</h2>
            <h2 className="canva-text section-title display mt-3" style={{color: 'rgb(180, 65, 112)', fontWeight: '600', fontSize: '26px', letterSpacing: '-0.07rem', lineHeight: '0.79'}}>LET'S TALK ABOUT YOU.</h2>
            <p className="canva-text bridge-copy" style={{color: 'rgb(10, 10, 12)', fontWeight: '400', fontSize: '18px', lineHeight: '1.5'}}>Queremos conocer lo que hace diferente a tu marca.</p>
            <div className="contact-block" aria-labelledby="contact-block-title">
              <p className="canva-text contact-block-title" id="contact-block-title" style={{color: 'rgb(10, 10, 12)', fontWeight: '700', fontSize: '12px', letterSpacing: '0.16rem'}}>DESCUBRE MÁS SOBRE NOSOTROS</p>
              <div className="contact-details" aria-label="Contacto">
                <span className="canva-text contact-label" style={{color: 'rgb(180, 65, 112)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.14rem'}}>CONTACTO</span>
                <a className="canva-link contact-link" href="https://aterea.agency/" target="_blank" rel="noopener noreferrer" style={{color: 'rgb(10, 10, 12)', fontWeight: '400', fontSize: '13px'}}>www.aterea.agency</a>
                <a className="canva-link contact-link" href="https://www.instagram.com/aterea.agency/" target="_blank" rel="noopener noreferrer" style={{color: 'rgb(10, 10, 12)', fontWeight: '400', fontSize: '13px'}}>IG: @aterea.agency</a>
                <a className="canva-link contact-link" href="tel:2311386494" style={{color: 'rgb(10, 10, 12)', fontWeight: '400', fontSize: '13px'}}>TEL. 2311386494</a>
              </div>
            </div>
            <button id="bridge-start-brief" className="canva-button primary-action" type="button" style={{background: 'rgb(10, 10, 12)', color: 'rgb(255, 251, 242)', fontWeight: '700', fontSize: '16px', letterSpacing: '0.1rem'}}>START MY BRAND BRIEF →</button>
          </section>
        </main>
        <section id="brief-view" className="brief-view" hidden="">
          <header className="brief-header">
            <div style={{fontSize: '28px', fontWeight: 'bold', color: 'rgb(10, 10, 12)'}}>ATEREA</div>
            <div className="progress-wrap">
              <span id="progress-count" className="micro" aria-live="polite">01 / 12</span>
              <div className="progress-track" aria-hidden="true"><div id="progress-bar" className="progress-bar"></div></div>
            </div>
          </header>
          <div className="brief-stage">
            <form id="brief-form" className="question-shell" noValidate="">
              <div id="question-content"></div>
              <p id="brief-status" className="status-message" role="status" aria-live="polite"></p>
              <div className="brief-controls">
                <button id="previous-question" className="secondary-action" type="button">← VOLVER</button>
                <button id="next-question" className="primary-action" type="submit">CONTINUAR →</button>
              </div>
              <p className="draft-note">Tus respuestas se guardan temporalmente en este dispositivo.</p>
            </form>
          </div>
        </section>
        <section id="submission-view" className="submission-view" hidden="">
          <div>
            <p className="canva-text micro mb-8" style={{color: 'rgb(239, 82, 39)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.15rem'}}>PRIVATE WELCOME</p>
            <h2 className="submission-title display">WE GOT IT.</h2>
            <h3 id="submission-name" className="submission-title display mt-10"></h3>
            <p className="canva-text submission-copy" style={{color: 'rgb(255, 251, 242)', fontWeight: '400', fontSize: '18px', lineHeight: '1.6'}}>Gracias por confiar en Aterea. Vamos a construir algo que se sienta tuyo.</p>
            <p className="canva-text display text-3xl font-semibold" style={{color: 'rgb(180, 65, 112)', fontWeight: '600', fontSize: '32px', letterSpacing: '-0.05rem'}}>WELCOME TO ATEREA.</p>
          </div>
        </section>
      </div>
    </>
  )
}
