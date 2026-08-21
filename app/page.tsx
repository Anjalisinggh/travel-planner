"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell, Camera, Landmark, MapPin, Moon, Mountain,
  Palette, Plane, ShoppingBag, Snowflake, Sun,
  Trees, Utensils, Compass, MessageCircle, Menu, X,
} from "lucide-react";
import { useMotion } from "./useMotion";

const baseDays = [
  { n: "01", city: "Tokyo", title: "Neon alleys & first bites", detail: "Land in Haneda · Check in · Omoide Yokocho", cost: "₹8,400" },
  { n: "02", city: "Tokyo", title: "Anime, arcades & old Tokyo", detail: "Senso-ji · Akihabara · teamLab Borderless", cost: "₹6,200" },
  { n: "03", city: "Fuji", title: "Lakeside slow morning", detail: "Chureito Pagoda · Oshino Hakkai · Ryokan", cost: "₹11,800" },
  { n: "04", city: "Kyoto", title: "Through the torii gates", detail: "Shinkansen · Fushimi Inari · Gion walk", cost: "₹9,600" },
  { n: "05", city: "Kyoto", title: "Bamboo & quiet temples", detail: "Arashiyama · Kinkaku-ji · Tea ceremony", cost: "₹7,100" },
  { n: "06", city: "Osaka", title: "Castles & street food", detail: "Osaka Castle · Shinsekai · Dotonbori", cost: "₹7,800" },
  { n: "07", city: "Tokyo", title: "Last light over Shibuya", detail: "Daikanyama · Shibuya Sky · Fly home", cost: "₹5,900" },
];

const nav = ["Overview", "Itinerary", "Moments", "Route", "Stays", "Budget"];
const dayIcons = [Plane, Landmark, Mountain, MapPin, Trees, Utensils, Camera];
const interestOptions = ["Culture", "Food", "Nature", "Art", "Nightlife", "Shopping"];
const interestMoments: Record<string, string[]> = {
  Culture: ["Old-town landmarks", "Local history walk", "Living heritage experience"],
  Food: ["Market breakfast", "Chef-led tasting", "Neighbourhood food crawl"],
  Nature: ["Scenic morning trail", "Botanical escape", "Golden-hour viewpoint"],
  Art: ["Independent galleries", "Design district walk", "Immersive art experience"],
  Nightlife: ["Rooftop at dusk", "Live music hideaway", "Late-night local favourite"],
  Shopping: ["Artisan studios", "Curated design stores", "Local market finds"],
};

// Each plate is a real photograph chosen for its caption, then graded into the
// palette with a duotone so the set reads as one printed series.
// All images are CC0 / public domain (Wikimedia Commons, rawpixel) — see public/journey/CREDITS.md
const galleryFrames = [
  { title: "First light", meta: "Dawn", src: "canal-dusk", alt: "Lanterns reflected in the Shirakawa canal at first light", tone: "tone-clay", pos: "50% 44%", zoom: 1.05 },
  { title: "The long walk", meta: "Afternoon", src: "arcade-walk", alt: "Covered shopping arcade busy with afternoon walkers", tone: "tone-terracotta", pos: "50% 56%", zoom: 1.12 },
  { title: "Mountain quiet", meta: "Sunrise", src: "fuji-lake", alt: "Snow-capped Mount Fuji seen across the lake", tone: "tone-clay", pos: "20% 40%", zoom: 1.55 },
  { title: "Through the gates", meta: "Golden hour", src: "gates-sky", alt: "A vermilion torii gate against open sky", tone: "tone-ember", pos: "46% 46%", zoom: 1.15 },
  { title: "Bamboo hush", meta: "Midday", src: "bamboo-hush", alt: "Bamboo stems in a dim grove", tone: "tone-olive", pos: "46% 50%", zoom: 1.1 },
  { title: "Lantern street", meta: "Night", src: "ryokan-night", alt: "Wooden inns lit by lanterns along a canal at night", tone: "tone-ember", pos: "58% 52%", zoom: 1.15 },
  { title: "Last skyline", meta: "Dusk", src: "tokyo-lights", alt: "City tower glowing over the skyline after dark", tone: "tone-ink", pos: "50% 58%", zoom: 1.2 },
];

const stays = [
  { badge: "Our pick", place: "Shinjuku", city: "Tokyo", name: "Onsen Ryokan Yuen", copy: "A calm, modern ryokan floating above the city lights.", price: "₹11,200", rating: "4.8", src: "tokyo-lights", tone: "tone-ink", pos: "50% 54%", zoom: 1.25 },
  { badge: "Quiet luxury", place: "Gion", city: "Kyoto", name: "Sowaka", copy: "Heritage craft and considered Japanese hospitality.", price: "₹13,600", rating: "4.9", src: "canal-dusk", tone: "tone-clay", pos: "40% 38%", zoom: 1.35 },
  { badge: "Fuji view", place: "Kawaguchiko", city: "Fuji", name: "Konansou", copy: "Private onsen mornings facing the mountain.", price: "₹15,900", rating: "4.8", src: "fuji-lake", tone: "tone-olive", pos: "18% 38%", zoom: 1.6 },
];

const packingItems = ["Passport & visa", "Light rain jacket", "Universal adapter", "Comfortable shoes", "Rail pass"];

type WeatherData = {
  temperature: number;
  condition: string;
  latitude: number;
  longitude: number;
  daily: { day: string; max: number; min: number }[];
  place: string;
  country: string;
};

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const scrollTo = useMotion(pageRef);

  const [active, setActive] = useState("Overview");
  const [docked, setDocked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [savedStay, setSavedStay] = useState<number | null>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [query, setQuery] = useState("Japan for 7 days under ₹80,000 with anime places and cherry blossoms");
  const [toast, setToast] = useState("");
  const [packing, setPacking] = useState([true, true, false, false, true]);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [destination, setDestination] = useState("Tokyo");
  const [draftDestination, setDraftDestination] = useState("Tokyo");
  const [startDate, setStartDate] = useState("2027-04-03");
  const [duration, setDuration] = useState(7);
  const [travellers, setTravellers] = useState(2);
  const [budget, setBudget] = useState(80000);
  const [interests, setInterests] = useState(["Culture", "Food", "Nature"]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [dataUpdated, setDataUpdated] = useState("");

  const days = useMemo(() => Array.from({ length: duration }, (_, index) => {
    const source = baseDays[index % baseDays.length];
    const interest = interests[index % interests.length] || "Culture";
    const moments = interestMoments[interest] || interestMoments.Culture;
    const costValue = Math.round((budget * .68 / duration) * (.84 + (index % 3) * .08));
    return {
      ...source,
      n: String(index + 1).padStart(2, "0"),
      city: destination,
      title: moments[index % moments.length],
      detail: `${interest} · ${moments[(index + 1) % moments.length]} · Flexible evening`,
      cost: `₹${costValue.toLocaleString("en-IN")}`,
    };
  }), [budget, destination, duration, interests]);

  const spent = useMemo(() => Math.round(budget * .68), [budget]);
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + duration - 1);
  const dateLabel = `${start.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase()} — ${end.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()}`;

  const budgetRows = useMemo(() => [
    ["Flights", Math.round(budget * .30)],
    ["Stays", Math.round(budget * .36)],
    ["Food", Math.round(budget * .15)],
    ["Transport", Math.round(budget * .09)],
    ["Experiences", Math.round(budget * .07)],
  ] as [string, number][], [budget]);

  const packedCount = packing.filter(Boolean).length;
  const day = days[Math.min(selectedDay, days.length - 1)];

  useEffect(() => {
    void loadWeather(destination);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dock the nav once the dark hero has scrolled away, and keep the active nav
  // item in step with whichever section is currently under the header.
  useEffect(() => {
    const ids = nav.map((item) => (item === "Overview" ? "top" : item.toLowerCase()));

    const onScroll = () => {
      setDocked(window.scrollY > window.innerHeight * .82);

      // The section whose top has most recently passed the header line wins.
      const line = 120;
      let current = nav[0];
      for (let i = 0; i < ids.length; i++) {
        const node = document.getElementById(ids[i]);
        if (node && node.getBoundingClientRect().top <= line) current = nav[i];
      }
      // Bottom of the page always resolves to the last section.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = nav[nav.length - 1];
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  async function loadWeather(city: string) {
    setWeatherLoading(true);
    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      const geo = await geoResponse.json();
      const location = geo.results?.[0];
      if (!location) throw new Error("Location not found");
      const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
      const forecast = await forecastResponse.json();
      setWeather({
        temperature: Math.round(forecast.current.temperature_2m),
        condition: weatherLabel(forecast.current.weather_code),
        latitude: location.latitude,
        longitude: location.longitude,
        place: location.name,
        country: location.country,
        daily: forecast.daily.time.slice(0, 5).map((date: string, index: number) => ({
          day: new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
          max: Math.round(forecast.daily.temperature_2m_max[index]),
          min: Math.round(forecast.daily.temperature_2m_min[index]),
        })),
      });
      setDataUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDraftDestination(location.name);
      return location.name as string;
    } catch {
      notify("Couldn’t find that destination. Try a nearby city.");
      return null;
    } finally {
      setWeatherLoading(false);
    }
  }

  function weatherLabel(code: number) {
    if (code === 0) return "Clear";
    if (code <= 3) return "Partly cloudy";
    if (code <= 48) return "Misty";
    if (code <= 67) return "Rain";
    if (code <= 77) return "Snow";
    return "Stormy";
  }

  function interestIcon(interest: string) {
    const Icon = interest === "Food" ? Utensils
      : interest === "Nature" ? Trees
      : interest === "Art" ? Palette
      : interest === "Nightlife" ? Moon
      : interest === "Shopping" ? ShoppingBag
      : Landmark;
    return <Icon size={18} strokeWidth={1.6} aria-hidden="true" />;
  }

  async function generateTrip() {
    setIsGenerating(true);
    const matched = await loadWeather(draftDestination);
    window.setTimeout(() => {
      if (matched) {
        setDestination(matched);
        setQuery(`${matched} for ${duration} days, ${travellers} travellers, under ₹${budget.toLocaleString("en-IN")} — ${interests.join(", ")}`);
        setSelectedDay(0);
        setPlannerOpen(false);
        notify("A fresh journey has been composed from live data");
      }
      setIsGenerating(false);
    }, 1250);
  }

  const mapLatitude = weather?.latitude ?? 35.6762;
  const mapLongitude = weather?.longitude ?? 139.6503;
  const mapSpan = .16;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLongitude - mapSpan}%2C${mapLatitude - mapSpan * .6}%2C${mapLongitude + mapSpan}%2C${mapLatitude + mapSpan * .6}&layer=mapnik&marker=${mapLatitude}%2C${mapLongitude}`;
  const mapLink = `https://www.openstreetmap.org/?mlat=${mapLatitude}&mlon=${mapLongitude}#map=13/${mapLatitude}/${mapLongitude}`;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function jumpTo(section: string) {
    setActive(section);
    setMenuOpen(false);
    scrollTo(section === "Overview" ? "top" : section.toLowerCase());
  }

  // Hold the page still while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const marqueeWords = [destination, ...interests, `${duration} days`, `${travellers} travellers`];
  const marqueeTrack = (
    <div className="marquee-track" aria-hidden="true">
      {marqueeWords.map((word, index) => (
        <span key={`${word}-${index}`}>
          {word}
          <i> / {String(index + 1).padStart(2, "0")}</i>
          <b> —</b>
        </span>
      ))}
    </div>
  );

  return (
    <main id="top" ref={pageRef}>
      <div className="curtain">
        <div className="curtain-inner">
          <p>Voyage</p>
          <small>Composing your journey</small>
          <div className="curtain-bar"><i /></div>
        </div>
      </div>
      <div className="cursor-dot" aria-hidden="true" />

      <header className={`topbar ${docked ? "docked" : ""}`}>
        <button className="brand" onClick={() => jumpTo("Overview")} aria-label="Voyage home">
          <span className="brand-mark">V</span><span>VOYAGE</span>
        </button>
        <nav aria-label="Primary navigation">
          {nav.map((item) => (
            <button key={item} onClick={() => jumpTo(item)} className={active === item ? "active" : ""}>{item}</button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Notifications" onClick={() => notify("You’re all caught up")}>
            <Bell size={15} strokeWidth={1.7} /><span className="ping" />
          </button>
          <button className="profile" onClick={() => notify("Profile ready for Akira")}>A</button>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* full-screen navigation for small screens */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {nav.map((item, index) => (
            <button
              key={item}
              tabIndex={menuOpen ? 0 : -1}
              className={active === item ? "active" : ""}
              onClick={() => jumpTo(item)}
            >
              <i>{String(index + 1).padStart(2, "0")}</i>
              <span>{item}</span>
            </button>
          ))}
        </nav>
        <footer>
          <small>{destination} · {duration} days</small>
          <small>{dateLabel}</small>
        </footer>
      </div>

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <span className="hero-ghost" aria-hidden="true">{String(duration).padStart(2, "0")}</span>

        <div className="hero-frame tone tone-ember">
          <img
            src="/journey/gates-path.jpg"
            alt="A path of vermilion torii gates climbing through the trees"
            style={{ objectPosition: "50% 52%" }}
          />
          <div className="scrim" />
        </div>

        <p className="hero-rail" aria-hidden="true">
          <i />
          {mapLatitude.toFixed(4)}°N / {mapLongitude.toFixed(4)}°E
          <i />
        </p>

        <div className="hero-body">
          <p className="hero-eyebrow kicker">Journeys, composed by hand</p>
          <h1>{destination},<br />made <span className="accent">unforgettable</span>.</h1>
          <p className="hero-copy">
            {duration} days shaped around {interests.slice(0, 3).join(", ").toLowerCase()} — with live
            conditions, a route that breathes, and a budget that stays in step.
          </p>
        </div>

        <div className="scroll-cue"><i />Scroll</div>
      </section>

      <div className="hero-prompt">
        <span className="spark"><Compass size={20} strokeWidth={1.6} /></span>
        <div>
          <small>Your trip, in your words</small>
          <input aria-label="Trip prompt" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button data-magnetic onClick={() => setPlannerOpen(true)}><span>Refine trip</span><span>→</span></button>
      </div>

      <section className="marquee" aria-label="Trip highlights">
        {marqueeTrack}
        {marqueeTrack}
      </section>

      {/* ---------------- ITINERARY ---------------- */}
      <section className="content itinerary" id="itinerary">
        <div className="section-heading">
          <div>
            <p className="kicker">Your itinerary</p>
            <h2 data-split>{duration} days,<br /><em>beautifully paced.</em></h2>
          </div>
          <p data-reveal>A responsive plan for {destination}, rebuilt around your dates, your pace and the things you actually care about.</p>
        </div>

        <div className="itinerary-grid">
          <div className="days-list" data-stagger>
            {days.map((entry, index) => {
              const DayIcon = dayIcons[index % dayIcons.length];
              return (
                <button
                  key={entry.n}
                  className={`day-row ${selectedDay === index ? "selected" : ""}`}
                  onClick={() => setSelectedDay(index)}
                >
                  <span className="day-number">{entry.n}</span>
                  <span className="day-icon"><DayIcon size={22} strokeWidth={1.4} aria-hidden="true" /></span>
                  <span className="day-copy">
                    <small>{entry.city}</small>
                    <strong>{entry.title}</strong>
                    <em>{entry.detail}</em>
                  </span>
                  <span className="day-cost"><small>Est. day</small>{entry.cost}</span>
                  <span className="arrow">↗</span>
                </button>
              );
            })}
          </div>

          <aside className="detail-card" data-reveal>
            <div className={`detail-photo tone ${galleryFrames[selectedDay % galleryFrames.length].tone}`} data-mask>
              <img
                src={`/journey/${galleryFrames[selectedDay % galleryFrames.length].src}.jpg`}
                alt=""
                style={{
                  objectPosition: galleryFrames[selectedDay % galleryFrames.length].pos,
                  "--zoom": galleryFrames[selectedDay % galleryFrames.length].zoom,
                } as React.CSSProperties}
              />
              <span>Day {selectedDay + 1} · {day.city}</span>
            </div>
            <div className="detail-body">
              <p className="kicker">Today’s story</p>
              <h3>{day.title}</h3>
              <div className="timeline">
                <div><time>09:00</time><span /><p><strong>Slow morning start</strong><small>Breakfast and a neighbourhood walk</small></p></div>
                <div><time>13:00</time><span /><p><strong>Signature experience</strong><small>{day.detail.split(" · ")[1] || "Explore at your own pace"}</small></p></div>
                <div><time>18:30</time><span /><p><strong>Golden-hour favourite</strong><small>Local dinner chosen around your taste</small></p></div>
              </div>
              <button className="text-link" onClick={() => notify(`Day ${selectedDay + 1} opened in the planner`)}>
                View full day <span>→</span>
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------------- HORIZONTAL GALLERY ---------------- */}
      <section className="gallery" id="moments">
        <div className="gallery-head">
          <div>
            <p className="kicker">Moments</p>
            <h2 data-split>The trip,<br /><em>frame by frame.</em></h2>
          </div>
          <p>Seven plates from the journey ahead — scroll sideways to move through the days.</p>
        </div>
        <div className="gallery-viewport">
          <div className="gallery-track">
            {galleryFrames.slice(0, duration).map((frame, index) => (
              <article className="gallery-item" key={frame.title}>
                <div className={`frame tone ${frame.tone}`}>
                  <span className="idx">{String(index + 1).padStart(2, "0")}</span>
                  <img
                    src={`/journey/${frame.src}.jpg`}
                    alt={frame.alt}
                    loading="lazy"
                    style={{ objectPosition: frame.pos, "--zoom": frame.zoom } as React.CSSProperties}
                  />
                </div>
                <footer>
                  <h3>{frame.title}</h3>
                  <span>Day {String(index + 1).padStart(2, "0")} · {frame.meta}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ROUTE ---------------- */}
      <section className="route-section" id="route">
        <div className="route-copy">
          <p className="kicker">Your route</p>
          <h2 data-split>A journey that<br /><em>flows naturally.</em></h2>
          <p data-reveal>The route reshapes itself as the trip changes, balancing the highlights with enough open space to actually enjoy them.</p>
          <div className="route-stats">
            <div><strong data-count={duration * 18}>0</strong><small>Kilometres</small></div>
            <div><strong data-count={Math.min(4, Math.max(1, interests.length))}>0</strong><small>Areas</small></div>
            <div><strong data-count={duration * 3}>0</strong><small>Experiences</small></div>
          </div>
          <button className="outline-button" data-magnetic onClick={() => notify("Interactive map is ready")}>
            <span>Explore interactive map</span><span>↗</span>
          </button>
        </div>
        <div className="map-card" data-mask>
          <iframe
            key={`${mapLatitude}-${mapLongitude}`}
            title={`Interactive map of ${destination}`}
            src={mapEmbedUrl}
            loading="lazy"
          />
          <div className="map-status">
            <span><MapPin size={15} />{weather?.place || destination}, {weather?.country || "Japan"}</span>
            <small>{mapLatitude.toFixed(4)}°, {mapLongitude.toFixed(4)}°</small>
          </div>
          <a className="map-open" href={mapLink} target="_blank" rel="noreferrer">Open full map <span>↗</span></a>
        </div>
      </section>

      {/* ---------------- STAYS ---------------- */}
      <section className="content recommendations" id="stays">
        <div className="section-heading compact">
          <div>
            <p className="kicker">Handpicked for you</p>
            <h2 data-split>Stay somewhere<br /><em>worth remembering.</em></h2>
          </div>
          <button className="text-link" onClick={() => notify("Showing 12 curated stays")}>View all stays <span>→</span></button>
        </div>
        <div className="stay-grid" data-stagger>
          {stays.map((stay, index) => (
            <article className="stay-card" key={stay.name}>
              <div className={`stay-image tone ${stay.tone}`}>
                <img
                  src={`/journey/${stay.src}.jpg`}
                  alt={`${stay.name} in ${stay.place}, ${stay.city}`}
                  loading="lazy"
                  style={{ objectPosition: stay.pos, "--zoom": stay.zoom } as React.CSSProperties}
                />
                <span>{stay.badge}</span>
                <button
                  aria-label={`Save ${stay.name}`}
                  aria-pressed={savedStay === index}
                  onClick={() => setSavedStay(savedStay === index ? null : index)}
                >
                  {savedStay === index ? "♥" : "♡"}
                </button>
              </div>
              <div className="stay-body">
                <small>{stay.city} · {stay.place}</small>
                <h3>{stay.name}</h3>
                <p>{stay.copy}</p>
                <footer>
                  <strong>{stay.price} <small>/ night</small></strong>
                  <span>{stay.rating} ★</span>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- BUDGET ---------------- */}
      <section className="utility-section" id="budget">
        <article className="budget-card" data-reveal>
          <p className="kicker">Budget at a glance</p>
          <h2 data-split>Comfortably<br /><em>within reach.</em></h2>
          <div className="budget-layout">
            <div className="donut" style={{ "--spent": `${spent / budget * 100}%` } as React.CSSProperties}>
              <div>
                <small>Remaining</small>
                <strong>₹{(budget - spent).toLocaleString("en-IN")}</strong>
                <span>of ₹{budget.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="budget-list">
              {budgetRows.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>₹{value.toLocaleString("en-IN")}</strong>
                  <em>{Math.round(value / budget * 100)}%</em>
                </div>
              ))}
            </div>
          </div>
          <button className="outline-button" data-magnetic onClick={() => notify("Budget dashboard opened")}>
            <span>Open budget dashboard</span><span>→</span>
          </button>
        </article>

        <div className="side-stack">
          <article className={`weather-card ${weatherLoading ? "loading" : ""}`} data-reveal>
            <p className="kicker">Live weather {dataUpdated && `· ${dataUpdated}`}</p>
            <div className="weather-main">
              <span className="weather-icon">{weather?.condition === "Snow" ? <Snowflake /> : <Sun />}</span>
              <strong>{weatherLoading ? "—" : `${weather?.temperature ?? 18}°`}</strong>
              <small>{weather ? `${weather.place}, ${weather.country} · ${weather.condition}` : `${destination} · Loading`}</small>
            </div>
            <footer>
              {(weather?.daily || []).map((item) => (
                <span key={item.day}><small>{item.day}</small>{item.max}°<em>{item.min}°</em></span>
              ))}
            </footer>
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather by Open-Meteo ↗</a>
          </article>

          <article className="packing-card" data-reveal>
            <div className="packing-head">
              <p className="kicker">Packing list</p>
              <h3>{packedCount} of {packing.length} ready</h3>
              <span className="progress">{Math.round(packedCount / packing.length * 100)}%</span>
            </div>
            {packingItems.map((item, index) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={packing[index]}
                  onChange={() => setPacking((current) => current.map((value, n) => (n === index ? !value : value)))}
                />
                <span>{item}</span>
              </label>
            ))}
          </article>
        </div>
      </section>

      {/* ---------------- CTA + FOOTER ---------------- */}
      <section className="footer-cta">
        <p className="japanese">旅は、ここから。</p>
        <h2 data-split>Your journey starts<br /><em>before you leave.</em></h2>
        <p>Everything is planned. All that’s left is to look forward to it.</p>
        <button data-magnetic onClick={() => notify("Your journey is ready to share")}>
          <span>Share this journey</span><span>↗</span>
        </button>
      </section>

      <footer className="footer">
        <div className="brand"><span className="brand-mark">V</span><span>VOYAGE</span></div>
        <p>Thoughtful journeys, beautifully planned.</p>
        <div className="footer-links">
          <button>Privacy</button><button>Terms</button><span>© 2026 Voyage</span>
        </div>
      </footer>

      {/* ---------------- PLANNER ---------------- */}
      {plannerOpen && (
        <div className="planner-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setPlannerOpen(false)}>
          <section className="planner-sheet" role="dialog" aria-modal="true" aria-labelledby="planner-title">
            <header>
              <div><p className="kicker">Live trip builder</p><h2 id="planner-title">Where next?</h2></div>
              <button aria-label="Close trip builder" onClick={() => setPlannerOpen(false)}>×</button>
            </header>
            <p className="planner-intro">Change anything. Weather is fetched live, and the route, daily plan, dates and budget recalculate instantly.</p>
            <div className="planner-grid">
              <label className="wide">
                <span>Destination city</span>
                <input value={draftDestination} onChange={(event) => setDraftDestination(event.target.value)} placeholder="Try Paris, Bali or New York" />
              </label>
              <label>
                <span>Start date</span>
                <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </label>
              <label>
                <span>Trip length</span>
                <div className="stepper">
                  <button onClick={() => setDuration(Math.max(2, duration - 1))} aria-label="Fewer days">−</button>
                  <strong>{duration} days</strong>
                  <button onClick={() => setDuration(Math.min(14, duration + 1))} aria-label="More days">+</button>
                </div>
              </label>
              <label>
                <span>Travellers</span>
                <div className="stepper">
                  <button onClick={() => setTravellers(Math.max(1, travellers - 1))} aria-label="Fewer travellers">−</button>
                  <strong>{travellers}</strong>
                  <button onClick={() => setTravellers(Math.min(12, travellers + 1))} aria-label="More travellers">+</button>
                </div>
              </label>
              <label>
                <span>Total budget (₹)</span>
                <input type="number" min="10000" step="5000" value={budget} onChange={(event) => setBudget(Math.max(10000, Number(event.target.value)))} />
              </label>
            </div>
            <fieldset>
              <legend>What are you into?</legend>
              <div className="interest-grid">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    className={interests.includes(interest) ? "chosen" : ""}
                    onClick={() => setInterests((current) => (
                      current.includes(interest)
                        ? (current.length > 1 ? current.filter((item) => item !== interest) : current)
                        : [...current, interest]
                    ))}
                  >
                    {interestIcon(interest)}{interest}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              className={`generate-button ${isGenerating ? "generating" : ""}`}
              disabled={isGenerating || !draftDestination.trim()}
              onClick={() => void generateTrip()}
            >
              <span>{isGenerating ? "Composing your journey" : "Generate my journey"}</span>
              <i>{isGenerating ? "·  ·  ·" : "→"}</i>
            </button>
            <small className="data-note">Live destination and forecast data from Open-Meteo. Cost estimates update from your chosen budget.</small>
          </section>
        </div>
      )}

      <button className={`ai-fab ${chatOpen ? "open" : ""}`} aria-label="Open concierge" onClick={() => setChatOpen(!chatOpen)}>
        {chatOpen ? <X size={20} /> : <MessageCircle size={20} strokeWidth={1.7} />}
      </button>

      {chatOpen && (
        <aside className="chat-panel">
          <header>
            <div>
              <span><Compass size={16} strokeWidth={1.7} /></span>
              <p><strong>Voyage concierge</strong><small>Online · ready to help</small></p>
            </div>
            <button onClick={() => setChatOpen(false)} aria-label="Close concierge">×</button>
          </header>
          <div className="chat-body">
            <p className="assistant-message">I’ve got your {destination} journey. Want to slow down a city, swap a restaurant, or make room for something new?</p>
            <div className="chips">
              <button onClick={() => notify("That city now has more breathing room")}>Slow it down</button>
              <button onClick={() => notify("Finding the best local food")}>Find better food</button>
            </div>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); notify("I’m updating your journey"); }}>
            <input aria-label="Message concierge" placeholder="Ask about your trip…" />
            <button aria-label="Send">↑</button>
          </form>
        </aside>
      )}

      {toast && <div className="toast"><i className="toast-dot" />{toast}</div>}
    </main>
  );
}
