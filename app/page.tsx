"use client";

import { useMemo, useState } from "react";

const days = [
  { n: "01", city: "Tokyo", title: "Neon alleys & first bites", detail: "Land in Haneda · Check in · Omoide Yokocho", cost: "₹8,400", icon: "⌁" },
  { n: "02", city: "Tokyo", title: "Anime, arcades & old Tokyo", detail: "Senso-ji · Akihabara · teamLab Borderless", cost: "₹6,200", icon: "◫" },
  { n: "03", city: "Fuji", title: "Lakeside slow morning", detail: "Chureito Pagoda · Oshino Hakkai · Ryokan", cost: "₹11,800", icon: "△" },
  { n: "04", city: "Kyoto", title: "Through the torii gates", detail: "Shinkansen · Fushimi Inari · Gion walk", cost: "₹9,600", icon: "门" },
  { n: "05", city: "Kyoto", title: "Bamboo & quiet temples", detail: "Arashiyama · Kinkaku-ji · Tea ceremony", cost: "₹7,100", icon: "竹" },
  { n: "06", city: "Osaka", title: "Castles & street food", detail: "Osaka Castle · Shinsekai · Dotonbori", cost: "₹7,800", icon: "◆" },
  { n: "07", city: "Tokyo", title: "Last light over Shibuya", detail: "Daikanyama · Shibuya Sky · Fly home", cost: "₹5,900", icon: "✦" },
];

const nav = ["Overview", "Itinerary", "Explore", "Stays", "Budget"];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [selectedDay, setSelectedDay] = useState(0);
  const [saved, setSaved] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [query, setQuery] = useState("Japan for 7 days under ₹80,000 with anime places and cherry blossoms");
  const [toast, setToast] = useState("");
  const [packing, setPacking] = useState([true, true, false, false, true]);

  const spent = useMemo(() => 28400 + selectedDay * 1800, [selectedDay]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function jumpTo(section: string) {
    setActive(section);
    const id = section === "Overview" ? "top" : section.toLowerCase();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main id="top">
      <header className="topbar">
        <button className="brand" onClick={() => jumpTo("Overview")} aria-label="Voyage home">
          <span className="brand-mark">V</span><span>VOYAGE</span>
        </button>
        <nav aria-label="Primary navigation">
          {nav.map((item) => (
            <button key={item} onClick={() => jumpTo(item)} className={active === item ? "active" : ""}>{item}</button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Notifications" onClick={() => notify("You’re all caught up")}>♧<span className="ping" /></button>
          <button className="profile" onClick={() => notify("Profile ready for Akira")}>A</button>
        </div>
      </header>

      <section className="hero">
        <img src="/japan-hero.png" alt="Mount Fuji, Kyoto and Tokyo at blue hour" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow"><span>✦</span> YOUR JOURNEY, CURATED</div>
          <p className="japanese">日本、待っている。</p>
          <h1>Japan, made<br />unforgettable.</h1>
          <p className="hero-copy">Seven days. Three cities. One seamless journey crafted around the things you love.</p>
          <div className="trip-meta">
            <div><small>APR 03 — 09, 2027</small><strong>7 days</strong></div>
            <div><small>TRAVELLERS</small><strong>2 people</strong></div>
            <div><small>TOTAL BUDGET</small><strong>₹80,000</strong></div>
          </div>
        </div>
        <div className="hero-prompt">
          <span className="spark">✦</span>
          <div><small>YOUR TRIP, IN YOUR WORDS</small><input aria-label="Trip prompt" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
          <button onClick={() => notify("Your itinerary has been refreshed")}>Refine trip <span>→</span></button>
        </div>
      </section>

      <section className="marquee" aria-label="Trip highlights">
        <span>Tokyo</span><i>01</i><b>—</b><span>Mount Fuji</span><i>03</i><b>—</b><span>Kyoto</span><i>04</i><b>—</b><span>Osaka</span><i>06</i>
      </section>

      <section className="content itinerary" id="itinerary">
        <div className="section-heading">
          <div><p className="kicker">YOUR ITINERARY</p><h2>Seven days,<br /><em>beautifully paced.</em></h2></div>
          <p>From Tokyo’s electric energy to Kyoto’s quiet temples—every moment has room to breathe.</p>
        </div>
        <div className="itinerary-grid">
          <div className="days-list">
            {days.map((day, index) => (
              <button key={day.n} className={`day-row ${selectedDay === index ? "selected" : ""}`} onClick={() => setSelectedDay(index)}>
                <span className="day-number">{day.n}</span><span className="day-icon">{day.icon}</span>
                <span className="day-copy"><small>{day.city}</small><strong>{day.title}</strong><em>{day.detail}</em></span>
                <span className="day-cost"><small>EST. DAY</small>{day.cost}</span><span className="arrow">↗</span>
              </button>
            ))}
          </div>
          <aside className="detail-card">
            <div className="detail-photo"><img src="/japan-hero.png" alt="" /><span>DAY {selectedDay + 1} · {days[selectedDay].city.toUpperCase()}</span></div>
            <div className="detail-body">
              <p className="kicker">TODAY’S STORY</p>
              <h3>{days[selectedDay].title}</h3>
              <div className="timeline">
                <div><time>09:00</time><span /><p><strong>Slow morning start</strong><small>Breakfast and a neighbourhood walk</small></p></div>
                <div><time>13:00</time><span /><p><strong>Signature experience</strong><small>{days[selectedDay].detail.split(" · ")[1] || "Explore at your own pace"}</small></p></div>
                <div><time>18:30</time><span /><p><strong>Golden-hour favourite</strong><small>Local dinner selected around your taste</small></p></div>
              </div>
              <button className="text-link" onClick={() => notify(`Day ${selectedDay + 1} opened in the planner`)}>View full day <span>→</span></button>
            </div>
          </aside>
        </div>
      </section>

      <section className="route-section" id="explore">
        <div className="route-copy">
          <p className="kicker">YOUR ROUTE</p>
          <h2>A journey that<br /><em>flows naturally.</em></h2>
          <p>We’ve balanced iconic moments with unhurried discoveries—and mapped every connection.</p>
          <div className="route-stats"><div><strong>1,086</strong><small>KILOMETRES</small></div><div><strong>4</strong><small>CITIES</small></div><div><strong>18</strong><small>EXPERIENCES</small></div></div>
          <button className="outline-button" onClick={() => notify("Interactive map is ready")}>Explore interactive map <span>↗</span></button>
        </div>
        <div className="map-card" role="img" aria-label="Stylized route map from Tokyo to Fuji, Kyoto and Osaka">
          <span className="map-label sea">Pacific<br />Ocean</span><span className="map-label tokyo">TOKYO<small>DAY 1—2 · 7</small></span><span className="map-label fuji">MT. FUJI<small>DAY 3</small></span><span className="map-label kyoto">KYOTO<small>DAY 4—5</small></span><span className="map-label osaka">OSAKA<small>DAY 6</small></span>
          <div className="route-line" /><i className="pin p1" /><i className="pin p2" /><i className="pin p3" /><i className="pin p4" />
        </div>
      </section>

      <section className="content recommendations" id="stays">
        <div className="section-heading compact">
          <div><p className="kicker">HANDPICKED FOR YOU</p><h2>Stay somewhere<br /><em>worth remembering.</em></h2></div>
          <button className="text-link" onClick={() => notify("Showing 12 curated stays")}>View all stays <span>→</span></button>
        </div>
        <div className="stay-grid">
          <article className="stay-card featured"><div className="stay-image tokyo-hotel"><span>OUR PICK</span><button aria-label="Save hotel" onClick={() => setSaved(!saved)}>{saved ? "♥" : "♡"}</button></div><div><small>TOKYO · SHINJUKU</small><h3>Onsen Ryokan Yuen</h3><p>A calm, modern ryokan above the city lights.</p><footer><strong>₹11,200 <small>/ night</small></strong><span>4.8 ★</span></footer></div></article>
          <article className="stay-card"><div className="stay-image kyoto-hotel"><span>QUIET LUXURY</span><button aria-label="Save hotel">♡</button></div><div><small>KYOTO · GION</small><h3>Sowaka</h3><p>Heritage craft and considered Japanese hospitality.</p><footer><strong>₹13,600 <small>/ night</small></strong><span>4.9 ★</span></footer></div></article>
          <article className="stay-card"><div className="stay-image fuji-hotel"><span>FUJI VIEW</span><button aria-label="Save hotel">♡</button></div><div><small>KAWAGUCHIKO</small><h3>Konansou</h3><p>Private onsen mornings facing Mount Fuji.</p><footer><strong>₹15,900 <small>/ night</small></strong><span>4.8 ★</span></footer></div></article>
        </div>
      </section>

      <section className="utility-section" id="budget">
        <article className="budget-card">
          <p className="kicker">BUDGET AT A GLANCE</p><h2>Comfortably<br /><em>within reach.</em></h2>
          <div className="budget-layout">
            <div className="donut" style={{"--spent": `${spent / 800}%`} as React.CSSProperties}><div><small>REMAINING</small><strong>₹{(80000-spent).toLocaleString("en-IN")}</strong><span>of ₹80,000</span></div></div>
            <div className="budget-list">{[["Flights","₹24,000","30%"],["Stays","₹28,400","36%"],["Food","₹11,800","15%"],["Transport","₹7,200","9%"],["Experiences","₹5,600","7%"]].map(([a,b,c])=><div key={a}><span>{a}</span><strong>{b}</strong><em>{c}</em></div>)}</div>
          </div>
          <button className="outline-button" onClick={() => notify("Budget dashboard opened")}>Open budget dashboard <span>→</span></button>
        </article>
        <div className="side-stack">
          <article className="weather-card"><p className="kicker">APRIL FORECAST</p><div><span className="weather-icon">☼</span><strong>18°</strong><small>Tokyo · Clear</small></div><footer>{["FRI|18°","SAT|17°","SUN|15°","MON|19°","TUE|20°"].map(x=>{const [d,t]=x.split("|");return <span key={d}><small>{d}</small>{t}</span>})}</footer></article>
          <article className="packing-card"><div><p className="kicker">PACKING LIST</p><h3>12 of 18 ready</h3></div><span className="progress">67%</span>{["Passport & visa","Light rain jacket","Universal adapter","Comfortable shoes","JR Pass"].map((x,i)=><label key={x}><input type="checkbox" checked={packing[i]} onChange={()=>setPacking(p=>p.map((v,n)=>n===i?!v:v))}/><span>{x}</span></label>)}</article>
        </div>
      </section>

      <section className="footer-cta">
        <p className="japanese">旅は、ここから。</p><h2>Your journey starts<br /><em>before you leave.</em></h2><p>Everything is planned. All that’s left is to look forward to it.</p>
        <button onClick={() => notify("Your journey is ready to share")}>Share this journey <span>↗</span></button>
      </section>

      <footer className="footer"><div className="brand"><span className="brand-mark">V</span><span>VOYAGE</span></div><p>Thoughtful journeys, beautifully planned.</p><div><button>Privacy</button><button>Terms</button><span>© 2026 Voyage</span></div></footer>

      <button className={`ai-fab ${chatOpen ? "open" : ""}`} aria-label="Open AI concierge" onClick={() => setChatOpen(!chatOpen)}>✦</button>
      {chatOpen && <aside className="chat-panel"><header><div><span>✦</span><p><strong>Voyage concierge</strong><small>Online · ready to help</small></p></div><button onClick={()=>setChatOpen(false)}>×</button></header><div className="chat-body"><p className="assistant-message">I’ve got your Japan journey. Want to slow down Kyoto, swap a restaurant, or make room for Disneyland?</p><div className="chips"><button onClick={()=>notify("Kyoto now has more breathing room")}>Slow down Kyoto</button><button onClick={()=>notify("Finding the best ramen spots")}>Find better ramen</button></div></div><form onSubmit={(e)=>{e.preventDefault();notify("I’m updating your journey");}}><input aria-label="Message concierge" placeholder="Ask about your trip…" /><button>↑</button></form></aside>}
      {toast && <div className="toast">✦ {toast}</div>}
    </main>
  );
}
