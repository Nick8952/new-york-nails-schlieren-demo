/**
 * Zeitmass: die Dauer einer Position als Goldlinie auf einer gemeinsamen Skala (0 bis `skala` Minuten).
 * Rein visuell (aria-hidden); der Text daneben nennt die Minuten.
 */
export function Zeitmass({ minuten, skala }: { minuten: number; skala: number }) {
  const anteil = Math.max(4, Math.min(100, Math.round((minuten / skala) * 100)));
  return (
    <span className="zeitmass block" aria-hidden="true">
      <span style={{ width: `${anteil}%` }} />
    </span>
  );
}
