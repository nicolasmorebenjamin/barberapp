<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Dark Level Barber Studio: barbería, tienda y academia.">
  <meta name="theme-color" content="#111210">
  <title>Dark Level — Barber Studio</title>
  <style>
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; padding: 28px 18px; min-height: 100vh; background: #0b0c0a; }
    
    #dark-level-home{--dl-bg:#111210;--dl-panel:#1b1c19;--dl-ink:#f2f0e9;--dl-muted:#a4a49d;--dl-gold:#c7a56a;--dl-line:#35352f;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--dl-ink);background:var(--dl-bg);border-radius:18px;overflow:hidden;max-width:1100px;margin:auto;box-shadow:0 24px 70px rgba(0,0,0,.26)}
    #dark-level-home *{box-sizing:border-box}
    #dark-level-home .dl-nav{height:76px;display:flex;align-items:center;justify-content:space-between;padding:0 5.5%;border-bottom:1px solid var(--dl-line)}
    #dark-level-home .dl-brand{font-size:17px;font-weight:700;letter-spacing:.17em;line-height:1.05}.dl-brand span{display:block;color:var(--dl-gold);font-size:10px;letter-spacing:.38em;margin-top:5px}
    #dark-level-home nav{display:flex;gap:30px;align-items:center}#dark-level-home nav a{color:#d1d0c9;text-decoration:none;font-size:13px}#dark-level-home nav a:first-child{color:var(--dl-gold)}
    #dark-level-home .dl-book{border:1px solid var(--dl-gold);padding:12px 17px;color:var(--dl-gold);text-decoration:none;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
    #dark-level-home .dl-hero{min-height:442px;display:grid;grid-template-columns:1.02fr .98fr;padding:55px 5.5% 50px;gap:30px;align-items:center;background:radial-gradient(ellipse at 77% 44%,rgba(147,119,76,.11),transparent 38%),linear-gradient(110deg,#111210 50%,#171713)}
    #dark-level-home .dl-kicker{color:var(--dl-gold);font-size:10px;letter-spacing:.27em;text-transform:uppercase;margin:0 0 18px}#dark-level-home h1{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-size:clamp(45px,6vw,75px);line-height:.99;letter-spacing:-.035em;margin:0 0 20px}#dark-level-home h1 em{font-weight:400;color:var(--dl-gold)}
    #dark-level-home .dl-lead{max-width:385px;color:#aaa9a2;font-size:14px;line-height:1.75;margin:0 0 25px}#dark-level-home .dl-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.dl-primary{display:inline-block;background:var(--dl-gold);color:#171611;text-decoration:none;padding:14px 20px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:700}.dl-secondary{display:inline-block;border:1px solid #4b4a42;color:#eee9dc;text-decoration:none;padding:13px 18px;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
    #dark-level-home .dl-visual{height:330px;position:relative;overflow:hidden;background:linear-gradient(140deg,#36352f,#171815 58%,#24221b);border:1px solid #494438}
    #dark-level-home .dl-visual:before{content:"";position:absolute;width:250px;height:250px;border:1px solid rgba(199,165,106,.34);border-radius:50%;left:50%;top:48%;transform:translate(-50%,-50%);box-shadow:0 0 0 25px rgba(199,165,106,.035),0 0 0 52px rgba(199,165,106,.025)}
    #dark-level-home .dl-figure{position:absolute;bottom:-46px;left:50%;transform:translateX(-50%);width:205px;height:290px;background:linear-gradient(110deg,#272824,#090a09 62%);clip-path:polygon(35% 0,65% 0,71% 10%,85% 16%,91% 32%,100% 100%,0 100%,9% 32%,15% 16%,29% 10%);border-top:2px solid #9c8156}
    #dark-level-home .dl-head{position:absolute;bottom:167px;left:50%;transform:translateX(-50%);width:96px;height:128px;border-radius:45% 45% 42% 42%;background:linear-gradient(100deg,#7c6b56,#c1a47f 53%,#77634f);box-shadow:inset -13px -3px 0 rgba(26,24,20,.26)}
    #dark-level-home .dl-hair{position:absolute;bottom:272px;left:50%;transform:translateX(-50%);width:101px;height:60px;border-radius:55% 53% 15% 14%;background:linear-gradient(110deg,#131411,#282822 55%,#111210);clip-path:polygon(0 44%,8% 17%,22% 11%,28% 0,39% 12%,53% 0,65% 12%,82% 8%,100% 31%,96% 71%,87% 61%,80% 82%,70% 61%,58% 83%,48% 61%,35% 79%,22% 61%,12% 85%,7% 66%,2% 76%)}
    #dark-level-home .dl-stamp{position:absolute;right:18px;bottom:16px;color:rgba(238,231,214,.74);font-family:Georgia,serif;font-size:12px;letter-spacing:.2em}
    #dark-level-home .dl-strip{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--dl-line);border-bottom:1px solid var(--dl-line);padding:19px 5.5%;gap:20px}.dl-feature{display:flex;gap:13px;align-items:center}.dl-index{color:var(--dl-gold);font-family:Georgia,serif;font-size:22px}.dl-feature strong{display:block;font-size:12px;font-weight:500;letter-spacing:.06em}.dl-feature small{display:block;color:var(--dl-muted);font-size:11px;margin-top:4px}
    #dark-level-home .dl-sections{padding:35px 5.5% 40px}.dl-section-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:18px}.dl-section-head h2{font-family:Georgia,serif;font-size:25px;font-weight:400;margin:0}.dl-section-head p{font-size:11px;color:var(--dl-muted);margin:0}
    #dark-level-home .dl-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.dl-card{min-height:115px;border:1px solid var(--dl-line);padding:18px;background:linear-gradient(135deg,#1a1b18,#151613);display:flex;flex-direction:column;justify-content:space-between}.dl-card span{color:var(--dl-gold);font-size:10px;letter-spacing:.16em;text-transform:uppercase}.dl-card strong{font-family:Georgia,serif;font-size:19px;font-weight:400}.dl-card a{color:#d2c4a8;text-decoration:none;font-size:11px}.dl-foot{border-top:1px solid var(--dl-line);padding:15px 5.5%;color:#8c8b83;font-size:10px;letter-spacing:.09em;display:flex;justify-content:space-between}
    @media(max-width:700px){#dark-level-home{border-radius:12px}#dark-level-home .dl-nav{height:auto;min-height:68px;padding:15px 5%;}#dark-level-home nav{display:none}#dark-level-home .dl-book{padding:10px 11px;font-size:9px}#dark-level-home .dl-hero{grid-template-columns:1fr;padding:39px 6% 28px;gap:25px}#dark-level-home .dl-visual{height:245px}.dl-figure{transform:translateX(-50%) scale(.8);transform-origin:bottom}.dl-head{transform:translateX(-50%) scale(.8);transform-origin:bottom}.dl-hair{transform:translateX(-50%) scale(.8);transform-origin:bottom}#dark-level-home .dl-strip{padding:15px 6%;gap:8px}.dl-feature{gap:7px}.dl-feature strong{font-size:10px}.dl-feature small{font-size:9px}#dark-level-home .dl-sections{padding:28px 6%}.dl-section-head{display:block}.dl-section-head p{margin-top:7px}.dl-cards{grid-template-columns:1fr!important}.dl-card{min-height:96px}.dl-foot{padding:13px 6%;font-size:9px}}
  
    @media(max-width:700px) { body { padding: 10px; } }
  </style>
</head>
<body>
<div id="dark-level-home">
  <header class="dl-nav">
    <div class="dl-brand">DARK LEVEL<span>BARBER STUDIO</span></div>
    <nav aria-label="Navegación principal"><a href="#inicio">Inicio</a><a href="#turnos">Turnos</a><a href="#tienda">Tienda</a><a href="#academia">Academia</a></nav>
    <a class="dl-book" href="#turnos">Reservar turno&nbsp; ↗</a>
  </header>
  <main id="inicio">
    <section class="dl-hero" aria-label="Presentación de Dark Level">
      <div><p class="dl-kicker">Estilo. Técnica. Identidad.</p><h1>Tu mejor<br>versión, <em>al detalle.</em></h1><p class="dl-lead">Un espacio para renovar tu estilo, descubrir piezas con carácter y aprender el oficio de la barbería.</p><div class="dl-actions"><a class="dl-primary" href="#turnos">Elegí tu barbero&nbsp; ↗</a><a class="dl-secondary" href="#academia">Conocé la academia</a></div></div>
      <div class="dl-visual" aria-label="Ilustración editorial de un barbero"><div class="dl-figure"></div><div class="dl-head"></div><div class="dl-hair"></div><span class="dl-stamp">D / L&nbsp; — &nbsp;EST. 2024</span></div>
    </section>
    <section class="dl-strip" aria-label="Servicios destacados"><div class="dl-feature"><span class="dl-index">01</span><div><strong>Barbería a tu medida</strong><small>Elegí quién te corta y cuándo</small></div></div><div class="dl-feature"><span class="dl-index">02</span><div><strong>Ropa con identidad</strong><small>La selección Dark Level</small></div></div><div class="dl-feature"><span class="dl-index">03</span><div><strong>Aprendé el oficio</strong><small>Formación para cada nivel</small></div></div></section>
    <section class="dl-sections" aria-label="Explorá Dark Level"><div class="dl-section-head"><h2>Todo en un mismo lugar</h2><p>Elegí por dónde querés empezar.</p></div><div class="dl-cards"><article class="dl-card" id="turnos"><span>01 / Barbería</span><strong>Encontrá tu próximo corte.</strong><a href="#turnos">Ver barberos y horarios&nbsp; →</a></article><article class="dl-card" id="tienda"><span>02 / Tienda</span><strong>Vestí tu propio estilo.</strong><a href="#tienda">Explorar colección&nbsp; →</a></article><article class="dl-card" id="academia"><span>03 / Academia</span><strong>Convertí técnica en oficio.</strong><a href="#academia">Descubrir los cursos&nbsp; →</a></article></div></section>
    <footer class="dl-foot"><span>DARK LEVEL BARBER STUDIO</span><span>BUENOS AIRES · TURNOS / TIENDA / ACADEMIA</span></footer>
  </main>
</div>

</body>
</html>
