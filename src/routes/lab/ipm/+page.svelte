<script>
  let page = 'home';

  const hours = [
    ['Monday', 'Closed'],
    ['Tuesday', '12:00 PM – 7:00 PM'],
    ['Wednesday', '11:00 AM – 7:00 PM'],
    ['Thursday', '12:00 PM – 7:00 PM'],
    ['Friday', '11:00 AM – 7:00 PM'],
    ['Saturday', 'Closed'],
    ['Sunday', 'Closed'],
  ];

  const services = [
    {
      id: 'swedish',
      category: 'Bodywork',
      name: 'Swedish Massage',
      blurb:
        'Smooth, gliding strokes with firm but gentle pressure. The classic full-body massage for easing muscle tension, improving circulation, and settling a busy nervous system.',
      prices: [
        { length: '60 min', price: '$85' },
        { length: '90 min', price: '$115' },
      ],
    },
    {
      id: 'golden-age',
      category: 'Bodywork',
      name: 'Golden Age Massage',
      blurb:
        "Designed for clients in their mid-60s and up. Light, gentle technique with passive stretching that eases tension without excess friction on the skin.",
      prices: [
        { length: '60 min', price: '$50' },
        { length: '90 min', price: '$80' },
      ],
    },
    {
      id: 'chair',
      category: 'On the go',
      name: 'Chair Massage',
      blurb:
        'A clothes-on session in a specially designed chair — a quick recharge for busy days, or a booked block for corporate and business groups.',
      prices: [{ length: '30 min', price: '$30' }],
      note: 'Corporate & group rates available — contact directly.',
    },
  ];

  const testimonials = [
    {
      name: 'Tyler R.',
      quote:
        'Outstanding massage, knowledgeable about muscle anatomy and how to really work out knots. Great atmosphere and very kind. Highly recommend.',
    },
    {
      name: 'Lisa F.',
      quote:
        "I do tell friends about Alyia! She's really good about listening to what your body needs and what areas need extra pressure — deep tissue or more, right where it counts.",
    },
    {
      name: 'Karen S.',
      quote: 'This massage was just what I needed. I was so relaxed and felt so good when she was done.',
    },
  ];

  const bookingUrl = 'https://www.massagebook.com/business/15912554/select-product/services';
  const pulsePath =
    'M0,60 L18,60 L28,24 L38,98 L48,38 L58,82 L68,60 L88,60 L98,16 L108,104 L118,44 L128,76 L142,60 ' +
    'C190,60 210,18 254,18 C300,18 322,102 366,102 C408,102 428,38 468,38 ' +
    'C506,38 526,80 566,80 C604,80 624,54 662,54 C702,54 722,60 800,60';

  const navItems = [
    ['home', 'Home'],
    ['services', 'Services'],
    ['about', 'About'],
    ['contact', 'Contact'],
  ];

  function goTo(id) {
    page = id;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }

  let name = '';
  let email = '';
  let message = '';

  $: mailtoHref = (() => {
    const subject = encodeURIComponent(`Message from ${name || 'the website'}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` (${email})` : ''}`);
    return `mailto:interpulsemassage@gmail.com?subject=${subject}&body=${body}`;
  })();
</script>

<svelte:head>
  <title>interPulse Massage — Quincy, CA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="site">
  <header>
    <div class="wrap nav-row">
      <button class="logo-btn" on:click={() => goTo('home')}>
        <svg viewBox="0 0 60 30" class="logo-mark">
          <path
            d="M0,15 L8,15 L11,6 L15,24 L19,12 L23,18 L27,15 L34,15 C40,15 40,6 46,6 C52,6 52,24 58,15 L60,15"
            fill="none"
            stroke="#E8536B"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="logo-text">interPulse</span>
      </button>

      <nav class="nav-links">
        {#each navItems as [id, label]}
          <button class:active={page === id} on:click={() => goTo(id)}>{label}</button>
        {/each}
      </nav>

      <a class="btn-primary small" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book now</a>
    </div>
    <div class="nav-mobile">
      {#each navItems as [id, label]}
        <button class:active={page === id} on:click={() => goTo(id)}>{label}</button>
      {/each}
    </div>
  </header>

  {#if page === 'home'}
    <div class="page">
      <section class="hero">
        <div class="wrap hero-inner">
          <p class="eyebrow dark">Quincy, CA · Licensed Massage Therapist</p>
          <h1>Where a busy day settles into stillness.</h1>
          <p>
            One-on-one massage therapy — in my Main Street studio, at your home, or on-site at
            work. Serving Quincy and greater Plumas County.
          </p>
          <div class="hero-actions">
            <a class="btn-primary" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book a session →</a>
            <button class="btn-ghost dark" on:click={() => goTo('services')}>View services</button>
          </div>
        </div>
        {#key page}
          <svg viewBox="0 0 800 120" preserveAspectRatio="none" class="pulse-hero">
            <path
              class="pulse-draw"
              pathLength="1000"
              d={pulsePath}
              fill="none"
              stroke="rgba(255,255,255,0.75)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        {/key}
      </section>

      <section class="philosophy">
        <div class="wrap">
          <p class="eyebrow" style="text-align:center;">From Alyia</p>
          <blockquote>
            "I believe it's essential to step away from a busy schedule to disconnect, recharge,
            and truly relax — I'm here to help you get the most out of that time."
          </blockquote>
          <cite>— Alyia P., National Holistic Institute grad · 800 clinical hours</cite>
        </div>
      </section>

      <section class="mist-bg">
        <div class="wrap">
          <div class="section-head">
            <div>
              <p class="eyebrow">Popular services</p>
              <h2>A session for every kind of tired</h2>
            </div>
            <button class="btn-ghost" on:click={() => goTo('services')}>See full menu →</button>
          </div>
          <div class="grid-3">
            {#each services as s}
              <div class="card">
                <p class="cat">{s.category}</p>
                <h3>{s.name}</h3>
                <p>{s.blurb}</p>
                <div class="price-pills">
                  {#each s.prices as p}
                    <span class="price-pill">{p.length} · {p.price}</span>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </section>

      <section class="on-dark">
        <div class="wrap">
          <p class="eyebrow dark">What people are saying</p>
          <h2 style="margin-bottom:40px;">Sixteen five-star reviews, and counting</h2>
          <div class="grid-3">
            {#each testimonials as t}
              <div class="testimonial-card">
                <div class="stars">★★★★★</div>
                <p>"{t.quote}"</p>
                <div class="name">{t.name}</div>
              </div>
            {/each}
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="wrap">
          <h2>Ready to slow your pulse down?</h2>
          <a class="btn-primary" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book a session →</a>
        </div>
      </section>
    </div>
  {/if}

  {#if page === 'services'}
    <div class="page">
      <section class="page-header">
        <div class="wrap">
          <p class="eyebrow dark">Services & pricing</p>
          <h1>The menu</h1>
          <p>
            Studio pricing below. Prefer at-home or on-site instead? I travel within a 10-mile
            radius of Quincy — just ask for travel pricing when you book.
          </p>
        </div>
      </section>

      <section>
        <div class="wrap narrow">
          {#each services as s}
            <div class="service-row">
              <div class="service-row-top">
                <div>
                  <p class="cat">{s.category}</p>
                  <h3>{s.name}</h3>
                </div>
                <a class="btn-primary small" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book now</a>
              </div>
              <p class="blurb">{s.blurb}</p>
              <div class="price-pills">
                {#each s.prices as p}
                  <span class="price-pill">{p.length} · {p.price}</span>
                {/each}
              </div>
              {#if s.note}
                <p class="note">{s.note}</p>
              {/if}
            </div>
          {/each}

          <div class="callout-box">
            <h3>Private events, weddings &amp; corporate chair massage</h3>
            <p>For group bookings and custom rates, reach out directly rather than through online booking.</p>
            <div class="links">
              <a href="mailto:interpulsemassage@gmail.com">interpulsemassage@gmail.com</a>
              <a href="tel:5303940605">(530) 394-0605</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  {/if}

  {#if page === 'about'}
    <div class="page">
      <section class="page-header">
        <div class="wrap">
          <p class="eyebrow dark">About</p>
          <h1>Meet Alyia</h1>
        </div>
      </section>

      <section>
        <div class="wrap about-grid">
          <div class="about-photo">
            <div style="width:100%;">
              {#key page}
                <svg viewBox="0 0 800 120" preserveAspectRatio="none" class="pulse-about">
                  <path
                    class="pulse-draw"
                    pathLength="1000"
                    d={pulsePath}
                    fill="none"
                    stroke="rgba(255,255,255,0.9)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              {/key}
              <p class="caption">Photo of Alyia — placeholder</p>
            </div>
          </div>

          <div class="about-text">
            <p>
              Thank you for stopping by. I love helping clients get the most out of their
              self-care — I think it's essential for all of us to take time away from busy
              schedules to disconnect, recharge, and relax.
            </p>
            <p>
              I specialize in Swedish massage, and I offer flexibility during sessions — if you
              have little ones to attend to, we can take a pause. Whether you'd like me to come to
              you or you'd rather visit the studio, I travel up to a 10-mile radius within Plumas
              County.
            </p>
            <p>
              Every session starts with listening — assessing, customizing, and educating so the
              time is built around what your body actually needs.
            </p>

            <div class="credentials-box">
              <p class="label">Credentials</p>
              <ul>
                <li><span>—</span>Graduate of the National Holistic Institute Massage Therapy program</li>
                <li><span>—</span>800 hours of education, including clinic and externship</li>
                <li><span>—</span>Member of the American Massage Therapy Association (AMTA)</li>
                <li><span>—</span>Ongoing continuing education to stay current on techniques &amp; best practices</li>
              </ul>
            </div>

            <div style="margin-top:28px;">
              <a class="btn-primary" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book with Alyia →</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  {/if}

  {#if page === 'contact'}
    <div class="page">
      <section class="page-header">
        <div class="wrap">
          <p class="eyebrow dark">Contact</p>
          <h1>Get in touch</h1>
        </div>
      </section>

      <section>
        <div class="wrap contact-grid">
          <div>
            <div class="info-card">
              <p class="label">Hours</p>
              <table class="hours-table">
                <tbody>
                  {#each hours as [day, hrs]}
                    <tr><td>{day}</td><td>{hrs}</td></tr>
                  {/each}
                </tbody>
              </table>
            </div>

            <div class="info-card">
              <p class="label">Details</p>
              <p class="details-text">
                525 Main Street Ste 2<br />
                Quincy, CA 95971<br />
                <a href="tel:5303940605">(530) 394-0605</a><br />
                <a href="mailto:interpulsemassage@gmail.com">interpulsemassage@gmail.com</a>
              </p>
              <div style="margin-top:18px;">
                <a
                  class="map-link"
                  href="https://www.google.com/maps/search/?api=1&query=525+Main+Street+Ste+2+Quincy+CA+95971"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Map it →
                </a>
              </div>
            </div>
          </div>

          <div class="info-card" style="margin-bottom:0;">
            <p class="label">Send a message</p>
            <input class="form-field" placeholder="Your name" bind:value={name} />
            <input class="form-field" placeholder="Your email" bind:value={email} />
            <textarea class="form-field" placeholder="What can I help with?" rows="5" bind:value={message}></textarea>
            <a class="btn-primary" style="justify-content:center; width:100%;" href={mailtoHref}>Send message</a>
            <p class="form-note">
              Opens your email app with this pre-filled. For booking, use the Book now button — it
              goes straight to the MassageBook calendar.
            </p>
          </div>
        </div>
      </section>
    </div>
  {/if}

  <footer>
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">
            <svg viewBox="0 0 60 30" class="logo-mark small">
              <path
                d="M0,15 L8,15 L11,6 L15,24 L19,12 L23,18 L27,15 L34,15 C40,15 40,6 46,6 C52,6 52,24 58,15 L60,15"
                fill="none"
                stroke="#E8536B"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>interPulse Massage</span>
          </div>
          <p>Licensed massage therapy in Quincy, CA — in-studio, in-home, or on-site.</p>
        </div>

        <div>
          <p class="footer-label">Hours</p>
          <table>
            <tbody>
              {#each hours as [day, hrs]}
                <tr><td>{day}</td><td>{hrs}</td></tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="footer-contact">
          <p class="footer-label">Find me</p>
          <p>
            525 Main Street Ste 2<br />
            Quincy, CA 95971<br />
            <a href="tel:5303940605">(530) 394-0605</a><br />
            <a href="mailto:interpulsemassage@gmail.com">interpulsemassage@gmail.com</a>
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 interPulse Massage. Bookings &amp; payments handled securely via MassageBook.</span>
        <div class="footer-bottom-links">
          {#each navItems as [id, label]}
            <button on:click={() => goTo(id)}>{label}</button>
          {/each}
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    background: #fbfafd;
  }

  .site {
    --twilight: #2a0f4a;
    --twilight-deep: #1b0a2e;
    --amethyst: #7c3aed;
    --amethyst-deep: #5b21b6;
    --rose: #e8536b;
    --mist: #f1eafb;
    --paper: #fbfafd;
    --ink: #221434;
    --ink-soft: #5b4b72;

    font-family: 'Inter', sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
  }

  a { text-decoration: none; }
  ul { list-style: none; margin: 0; padding: 0; }
  table { border-collapse: collapse; }

  .wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
  @media (min-width: 768px) { .wrap { padding: 0 40px; } }
  .wrap.narrow { max-width: 860px; }

  .eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--amethyst);
    margin-bottom: 12px;
  }
  .eyebrow.dark { color: #c9a9f5; }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--rose);
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 15px;
    padding: 13px 26px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    transition: transform 0.15s ease;
  }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-primary.small { padding: 10px 20px; font-size: 14px; }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: var(--twilight);
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 15px;
    padding: 13px 24px;
    border-radius: 999px;
    border: 1.5px solid var(--twilight);
    cursor: pointer;
  }
  .btn-ghost.dark { color: #fff; border-color: rgba(255, 255, 255, 0.5); }

  header {
    background: var(--twilight);
    position: sticky;
    top: 0;
    z-index: 40;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .nav-row { display: flex; align-items: center; justify-content: space-between; height: 72px; }
  .logo-btn {
    background: none; border: none; cursor: pointer;
    display: flex; align-items: center; gap: 10px;
  }
  .logo-mark { width: 30px; height: 15px; }
  .logo-mark.small { width: 26px; height: 13px; }
  .logo-text { font-family: 'Fraunces', serif; font-size: 20px; color: #fff; }

  .nav-links { display: none; gap: 32px; }
  @media (min-width: 768px) { .nav-links { display: flex; } }
  .nav-links button {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 14.5px; font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    border-bottom: 2px solid transparent;
    padding-bottom: 6px;
  }
  .nav-links button.active { color: #fff; border-bottom-color: var(--rose); }

  .nav-mobile { display: flex; gap: 18px; padding: 0 24px 14px; overflow-x: auto; }
  @media (min-width: 768px) { .nav-mobile { display: none; } }
  .nav-mobile button {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 500;
    white-space: nowrap; color: rgba(255, 255, 255, 0.55);
  }
  .nav-mobile button.active { color: #fff; }

  section { padding: 64px 0; }

  .hero {
    background: linear-gradient(160deg, var(--twilight) 0%, var(--amethyst-deep) 65%, var(--amethyst) 100%);
    color: #fff;
    padding: 80px 0 0;
  }
  .hero-inner { padding-bottom: 40px; }
  .hero h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(34px, 5.4vw, 58px);
    line-height: 1.08;
    font-weight: 500;
    margin: 0 0 20px;
    max-width: 620px;
  }
  .hero p { font-size: 17px; line-height: 1.7; color: rgba(255, 255, 255, 0.82); margin: 0 0 32px; max-width: 480px; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }
  .pulse-hero { width: 100%; height: 70px; display: block; }
  .pulse-about { width: 100%; height: 60px; display: block; }

  .page-header { background: var(--twilight); color: #fff; padding: 56px 0; }
  .page-header h1 { font-family: 'Fraunces', serif; font-size: clamp(30px, 4.2vw, 44px); margin: 0; }
  .page-header p { margin-top: 14px; color: rgba(255, 255, 255, 0.75); max-width: 560px; line-height: 1.7; }

  .philosophy { text-align: center; }
  .philosophy blockquote {
    max-width: 720px; margin: 0 auto;
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: clamp(20px, 2.6vw, 28px); line-height: 1.5; color: var(--twilight);
  }
  .philosophy cite {
    display: block; margin-top: 20px; font-style: normal;
    font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--ink-soft);
  }

  .mist-bg { background: var(--mist); }
  .on-dark { background: var(--twilight); color: #fff; }

  .section-head { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 40px; }
  .section-head h2, h2 { font-family: 'Fraunces', serif; font-size: 30px; margin: 0; color: var(--twilight); }
  .on-dark h2 { color: #fff; }

  .grid-3 { display: grid; grid-template-columns: 1fr; gap: 24px; }
  @media (min-width: 768px) { .grid-3 { grid-template-columns: repeat(3, 1fr); } }

  .card { background: #fff; border-radius: 18px; padding: 28px; box-shadow: 0 12px 30px -18px rgba(42, 15, 74, 0.35); }
  .card .cat { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--amethyst); margin: 0 0 10px; }
  .card h3 { font-family: 'Fraunces', serif; font-size: 21px; margin: 0 0 10px; color: var(--ink); }
  .card p { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0 0 18px; }
  .price-pills { display: flex; gap: 10px; flex-wrap: wrap; }
  .price-pill { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; background: var(--mist); color: var(--twilight); border-radius: 999px; padding: 6px 12px; }

  .testimonial-card { background: rgba(255, 255, 255, 0.06); border-radius: 18px; padding: 26px; border: 1px solid rgba(255, 255, 255, 0.1); }
  .testimonial-card .stars { color: var(--rose); margin-bottom: 12px; font-size: 15px; letter-spacing: 2px; }
  .testimonial-card p { font-size: 14.5px; line-height: 1.7; color: rgba(255, 255, 255, 0.85); margin: 0 0 16px; }
  .testimonial-card .name { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: rgba(255, 255, 255, 0.5); }

  .cta-section { text-align: center; }
  .cta-section h2 { font-size: clamp(26px, 3.6vw, 36px); margin-bottom: 20px; }

  .service-row { background: #fff; border-radius: 18px; padding: 30px; box-shadow: 0 12px 30px -20px rgba(42, 15, 74, 0.3); border: 1px solid var(--mist); margin-bottom: 20px; }
  .service-row-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
  .service-row h3 { font-family: 'Fraunces', serif; font-size: 24px; margin: 0; color: var(--ink); }
  .service-row .cat { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--amethyst); margin: 0 0 8px; }
  .service-row .blurb { margin-top: 14px; font-size: 15px; line-height: 1.7; color: var(--ink-soft); max-width: 620px; }
  .service-row .price-pills { margin-top: 18px; }
  .service-row .price-pill { font-size: 13px; padding: 7px 14px; }
  .service-row .note { margin-top: 12px; font-size: 13px; color: var(--rose); font-style: italic; }

  .callout-box { background: var(--mist); border-radius: 18px; padding: 30px; }
  .callout-box h3 { font-family: 'Fraunces', serif; font-size: 20px; color: var(--twilight); margin: 0 0 8px; }
  .callout-box p { font-size: 14.5px; color: var(--ink-soft); line-height: 1.7; margin: 0 0 16px; }
  .callout-box .links { display: flex; gap: 14px; flex-wrap: wrap; }
  .callout-box a { font-family: 'IBM Plex Mono', monospace; font-size: 13.5px; color: var(--twilight); }

  .about-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: start; }
  @media (min-width: 768px) { .about-grid { grid-template-columns: 1fr 1fr; } }
  .about-photo {
    border-radius: 24px; overflow: hidden;
    background: linear-gradient(150deg, var(--amethyst), var(--rose));
    aspect-ratio: 4 / 5; display: flex; align-items: center; justify-content: center; padding: 32px;
  }
  .about-photo .caption { margin-top: 24px; text-align: center; color: rgba(255, 255, 255, 0.85); font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; }
  .about-text p { font-size: 16px; line-height: 1.8; margin: 0 0 22px; }
  .credentials-box { background: var(--mist); border-radius: 18px; padding: 26px; }
  .credentials-box .label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--amethyst); margin: 0 0 14px; }
  .credentials-box li { display: flex; gap: 10px; font-size: 14.5px; line-height: 1.5; margin-bottom: 12px; }
  .credentials-box li span { color: var(--rose); margin-top: 2px; }

  .contact-grid { display: grid; grid-template-columns: 1fr; gap: 48px; }
  @media (min-width: 768px) { .contact-grid { grid-template-columns: 1fr 1fr; } }
  .info-card { background: #fff; border-radius: 20px; padding: 30px; border: 1px solid var(--mist); margin-bottom: 24px; }
  .info-card .label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--amethyst); margin: 0 0 16px; }
  .hours-table { width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 14px; }
  .hours-table td { padding: 5px 0; }
  .hours-table td:first-child { color: var(--ink-soft); }
  .hours-table td:last-child { text-align: right; }
  .details-text { font-size: 15px; line-height: 1.9; margin: 0; }
  .details-text a { color: var(--twilight); font-weight: 600; }
  .map-link { font-size: 13.5px; font-weight: 600; color: var(--rose); }

  .form-field {
    width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--mist);
    font-family: 'Inter', sans-serif; font-size: 14px; outline: none; margin-bottom: 14px;
    box-sizing: border-box; resize: vertical;
  }
  .form-field:focus { border-color: var(--amethyst); }
  .form-note { font-size: 12.5px; color: var(--ink-soft); margin-top: 10px; }

  footer { background: var(--twilight-deep); color: #fff; }
  .footer-grid { display: grid; grid-template-columns: 1fr; gap: 40px; padding: 56px 0 0; }
  @media (min-width: 768px) { .footer-grid { grid-template-columns: repeat(3, 1fr); } }
  .footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .footer-logo span { font-family: 'Fraunces', serif; font-size: 19px; }
  .footer-grid p { color: rgba(255, 255, 255, 0.65); font-size: 14px; line-height: 1.7; max-width: 280px; }
  .footer-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin: 0 0 14px; }
  .footer-grid table { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: rgba(255, 255, 255, 0.85); }
  .footer-grid table td { padding: 3px 16px 3px 0; }
  .footer-grid table td:first-child { color: rgba(255, 255, 255, 0.55); }
  .footer-contact p { max-width: none; }
  .footer-contact a { color: #fff; }
  .footer-bottom {
    margin-top: 48px; padding: 24px 0; border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px;
    font-size: 12.5px; color: rgba(255, 255, 255, 0.45);
  }
  .footer-bottom-links { display: flex; gap: 18px; }
  .footer-bottom-links button {
    background: none; border: none; color: rgba(255, 255, 255, 0.55); cursor: pointer;
    font-size: 12.5px; text-transform: capitalize; font-family: 'Inter', sans-serif;
  }

  .pulse-draw { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: draw 2.4s ease-out forwards; }
  @keyframes draw { to { stroke-dashoffset: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .pulse-draw { animation: none; stroke-dashoffset: 0; }
  }
</style>