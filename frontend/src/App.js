import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
// 🧠 Keeps the separate BIE analytics logic
import { calculateWUE, checkDataHealth } from './utils/analytics';

const SUGGESTIONS = ["Agumbe", "Mangaluru", "Mysuru", "Tumakuru", "Kadur", "Ballari", "Vijayapura", "Hassan", "Raichur"];

function AppContent() {
  const { t, i18n } = useTranslation(); 
  const [predictions, setPredictions] = useState([]);
  const [city, setCity] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("Ragi");
  const [stage, setStage] = useState("Vegetative");
  const [soil, setSoil] = useState("Red");
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:5000";

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/predictions`);
      if (res.data && res.data.data) setPredictions(res.data.data);
    } catch (e) { console.error("Database fetch failed:", e); }
  };

  useEffect(() => { fetchData(); }, []);

  // 📍 RESTORED: Live GPS Tracking
  const handleLiveLocation = () => {
    if (!navigator.geolocation) return alert("GPS not supported.");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        setCity(`${latitude.toFixed(2)},${longitude.toFixed(2)}`);
      } catch (e) { console.error(e); }
      setLoading(false);
    }, () => setLoading(false));
  };

  const handlePredict = async () => {
    if (!city) return alert("Enter location");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/weather-predict`, { 
        city, crop_type: selectedCrop, growth_stage: stage, soil_type: soil 
      });
      setCity("");
      setFilteredSuggestions([]);
      fetchData();
    } catch (e) { alert("Check Node and FastAPI servers!"); } //
    setLoading(false);
  };

  const getTheme = (status) => {
    if (status === "DANGER") return { color: "#e74c3c", accent: "#c0392b", bg: "#fdf2f2" };
    if (status === "WARNING") return { color: "#f39c12", accent: "#d35400", bg: "#fffaf0" };
    return { color: "#27ae60", accent: "#1e8449", bg: "#f0fff4" };
  };

  const currentTheme = predictions[0] ? getTheme(predictions[0].status) : { color: "#2c3e50", accent: "#34495e", bg: "#f4f7f6" };

  return (
    <div style={{...styles.container, backgroundColor: currentTheme.bg}}>
      {/* 🌤️ RESTORED: Full Weather Widget */}
      {predictions[0] && (
        <div style={styles.weatherWidget}>
          <div style={styles.widgetHeader}>{t('live_weather')}: {predictions[0].city.toUpperCase()}</div>
          <div style={styles.weatherItem}>🌡️ {predictions[0].temperature}°C</div>
          <div style={styles.weatherItem}>💧 {predictions[0].humidity}%</div>
          <div style={styles.weatherItem}>🌬️ {predictions[0].wind_speed || '2.16'} km/h</div>
        </div>
      )}

      <div style={styles.contentWrapper}>
        <header style={styles.header}>
          <div style={styles.logoBadge}>AQ</div>
          <h1 style={styles.title}>AquaSmart Pro</h1>
          <div style={styles.langContainer}>
            <select style={styles.langSelect} onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </div>
        </header>

        <div style={styles.glassCard}>
          <div style={styles.formGrid}>
            {/* 📍 RESTORED: Location with Suggestions & GPS Button */}
            <div style={{...styles.inputBox, position: 'relative'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <label style={styles.label}>{t('loc_label')}</label>
                <button onClick={handleLiveLocation} style={styles.gpsBtn}>📍 GPS</button>
              </div>
              <input style={styles.input} placeholder="Village name..." value={city} onChange={e => {
                setCity(e.target.value);
                setFilteredSuggestions(e.target.value.length > 1 ? SUGGESTIONS.filter(s => s.toLowerCase().includes(e.target.value.toLowerCase())) : []);
              }} />
              {filteredSuggestions.length > 0 && (
                <div style={styles.suggestionBox}>
                  {filteredSuggestions.map((s, i) => (
                    <div key={i} style={styles.suggestionItem} onClick={() => {setCity(s); setFilteredSuggestions([]);}}>{s}</div>
                  ))}
                </div>
              )}
            </div>

            {/* 🚜 RESTORED: All Crop Options */}
            <div style={styles.inputBox}>
              <label style={styles.label}>{t('crop_label')}</label>
              <select style={styles.select} value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
                <option value="Ragi">Ragi</option><option value="Sugarcane">Sugarcane</option>
                <option value="Maize">Maize</option><option value="Groundnut">Groundnut</option>
              </select>
            </div>

            {/* 🌱 RESTORED: All Growth Stages */}
            <div style={styles.inputBox}>
              <label style={styles.label}>{t('stage_label')}</label>
              <select style={styles.select} value={stage} onChange={e => setStage(e.target.value)}>
                <option value="Seedling">Seedling</option><option value="Vegetative">Vegetative</option>
                <option value="Reproductive">Reproductive</option><option value="Maturity">Maturity</option>
              </select>
            </div>

            {/* 🪨 RESTORED: All Soil Types */}
            <div style={styles.inputBox}>
              <label style={styles.label}>{t('soil_label')}</label>
              <select style={styles.select} value={soil} onChange={e => setSoil(e.target.value)}>
                <option value="Red">Red</option><option value="Black">Black</option><option value="Laterite">Laterite</option>
              </select>
            </div>
          </div>
          <button onClick={handlePredict} style={{...styles.mainButton, backgroundColor: currentTheme.accent}}>
            {t('analyze_btn')}
          </button>
        </div>

        {predictions[0] && (
          <div style={{...styles.statusHero, borderColor: currentTheme.accent}}>
            {/* 🛡️ Guardrail Alert */}
            {!checkDataHealth(predictions[0].temperature, predictions[0].humidity).isHealthy && (
              <div style={styles.healthAlert}>
                ⚠️ Data Integrity Warning: {checkDataHealth(predictions[0].temperature, predictions[0].humidity).message}
              </div>
            )}
            <h2 style={{color: currentTheme.color}}>{predictions[0].status}: {predictions[0].city}</h2>
            <p>{predictions[0].advice}</p>
            <div style={styles.statsRow}>
              <div><span style={styles.statVal}>{predictions[0].predicted_water_level}m</span><br/><small>Water Table</small></div>
              <div><span style={styles.statVal}>{predictions[0].dynamic_need}mm</span><br/><small>Daily Need</small></div>
              {/* 📈 BIE Metric: WUE */}
              <div>
                <span style={{...styles.statVal, color: '#9b59b6'}}>
                  {calculateWUE(predictions[0].dynamic_need, predictions[0].predicted_water_level)}%
                </span><br/><small>Efficiency (WUE)</small>
              </div>
            </div>
          </div>
        )}

        {/* 📚 RESTORED: Historical Advisories List */}
        <div style={styles.historySection}>
          <h4 style={styles.sectionHeading}>HISTORICAL ADVISORIES</h4>
          {predictions.map((p, i) => (
            <div key={i} style={styles.historyRow}>
              <div><b>{p.city}</b><br/><small>{p.crop} • {p.rainfall}mm Rainfall</small></div>
              <div style={{fontWeight: 'bold', color: getTheme(p.status).color}}>{p.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <Suspense fallback={<div>Loading...</div>}><AppContent /></Suspense>;
}

const styles = {
  container: { transition: "0.5s ease all", minHeight: "100vh", padding: "40px", position: "relative", fontFamily: 'sans-serif' },
  weatherWidget: { position: "absolute", top: "40px", right: "40px", background: "rgba(255,255,255,0.9)", padding: "15px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", width: "220px" },
  widgetHeader: { fontSize: "0.7rem", fontWeight: "bold", color: "#95a5a6", marginBottom: "10px", borderBottom: "1px solid #eee" },
  weatherItem: { fontSize: "0.9rem", color: "#2c3e50", fontWeight: "600" },
  contentWrapper: { maxWidth: "850px", margin: "0 auto" },
  header: { textAlign: "center", marginBottom: "30px" },
  logoBadge: { background: "#2ecc71", color: "#fff", width: "45px", height: "45px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", fontWeight: "bold", margin: "0 auto 10px auto" },
  title: { fontSize: "2.2rem", color: "#2c3e50", margin: 0 },
  glassCard: { background: "#fff", padding: "25px", borderRadius: "20px", boxShadow: "0 15px 35px rgba(0,0,0,0.03)", marginBottom: "30px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "20px" },
  inputBox: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "0.75rem", fontWeight: "bold", color: "#95a5a6", textTransform: "uppercase" },
  gpsBtn: { fontSize: "0.65rem", background: "none", border: "none", color: "#3498db", cursor: "pointer", fontWeight: "bold" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9" },
  select: { padding: "12px", borderRadius: "8px", border: "1px solid #dfe6e9", background: "#fff" },
  mainButton: { width: "100%", padding: "16px", borderRadius: "12px", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" },
  suggestionBox: { position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #dfe6e9", borderRadius: "8px", zIndex: 10 },
  suggestionItem: { padding: "10px", cursor: "pointer", borderBottom: "1px solid #f1f2f6" },
  statusHero: { background: "#fff", padding: "30px", borderRadius: "20px", borderLeft: "10px solid", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "30px" },
  statsRow: { display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f2f6", paddingTop: "20px", marginTop: "20px" },
  statVal: { fontSize: "1.5rem", fontWeight: "bold", color: "#2c3e50" },
  historySection: { marginTop: "30px" },
  sectionHeading: { fontSize: "0.8rem", color: "#95a5a6", letterSpacing: "1px", marginBottom: "15px" },
  historyRow: { background: "#fff", padding: "15px 25px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  healthAlert: { background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '8px', marginBottom: '15px' },
  langContainer: { marginTop: '10px' },
  langSelect: { padding: '5px 10px', borderRadius: '8px', border: '1px solid #ddd' }
};