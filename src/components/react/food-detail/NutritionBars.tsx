import { useState, useEffect } from 'react';

interface Props {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    servingSize: string;
  };
}

export default function NutritionBars({ nutrition }: Props) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // AKG / RDI (Recommended Daily Intake) values based on Indonesian standard (AKG Rata-rata 2150 kkal)
  const AKG = {
    protein: 60, // 60 grams
    fat: 65,     // 65 grams
    carbs: 300,  // 300 grams
  };

  const macros = [
    {
      label: 'Protein',
      value: nutrition.protein,
      unit: 'g',
      target: AKG.protein,
      color: 'var(--c-brand-mocha)',
      desc: 'Membangun & memperbaiki jaringan tubuh'
    },
    {
      label: 'Karbohidrat',
      value: nutrition.carbs,
      unit: 'g',
      target: AKG.carbs,
      color: 'var(--c-accent)',
      desc: 'Sumber energi utama aktivitas harian'
    },
    {
      label: 'Lemak',
      value: nutrition.fat,
      unit: 'g',
      target: AKG.fat,
      color: 'var(--c-brand-caramel)',
      desc: 'Pelindung organ & penyerapan vitamin'
    },
  ];

  return (
    <div className="nutrition-bars" role="list" aria-label="Informasi gizi">
      {nutrition.servingSize && (
        <p className="nutrition-serving">Porsi: {nutrition.servingSize}</p>
      )}
      <div className="nutrition-bars-grid">
        {/* Prominent Calories Card (Highlight, no progress bar track) */}
        <div className="nutrition-item nutrition-item--highlight" role="listitem">
          <div className="nutrition-header">
            <span className="nutrition-label" style={{ color: 'var(--c-accent)' }}>🔥 Energi Utama</span>
            <span className="nutrition-value" style={{ fontSize: 'var(--fs-2xl)' }}>
              {nutrition.calories} <span style={{ fontSize: 'var(--fs-base)', fontWeight: 600 }}>kkal</span>
            </span>
          </div>
          <p className="nutrition-desc" style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-3)', margin: 0, lineHeight: 1.4 }}>
            Memenuhi sekitar {Math.round((nutrition.calories / 2150) * 100)}% dari rata-rata kebutuhan energi harian (2150 kkal).
          </p>
        </div>

        {/* Macro Nutrient Cards scaled realistically relative to RDI */}
        {macros.map((item, i) => {
          const pct = Math.min(100, Math.round((item.value / item.target) * 100));
          return (
            <div key={i} className="nutrition-item" role="listitem">
              <div className="nutrition-header">
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
                  <span className="nutrition-label" style={{ flexGrow: 1 }}>{item.label}</span>
                  <span className="nutrition-akg-tag" style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 'var(--r-sm)',
                    background: 'var(--c-surface-2)',
                    color: 'var(--c-text-2)',
                    border: '1px solid var(--c-border-soft)'
                  }}>
                    {pct}% AKG
                  </span>
                </div>
                <span className="nutrition-value">{item.value} {item.unit}</span>
              </div>
              <div className="nutrition-bar-track">
                <div
                  className="nutrition-bar-fill"
                  style={{
                    width: animate ? `${pct}%` : '0%',
                    backgroundColor: item.color
                  }}
                  title={`${pct}% AKG`}
                />
              </div>
              <p className="nutrition-desc" style={{ fontSize: 'var(--fs-tiny)', color: 'var(--c-text-3)', margin: 0, lineHeight: 1.3 }}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
