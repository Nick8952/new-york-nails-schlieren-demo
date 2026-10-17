import { RichText } from "@/components/RichText";
import { Seitenkopf } from "@/components/Seitenkopf";
import { inhaltsquelle } from "@/lib/content";

/** Impressum und Datenschutzerklärung: Fliesstext aus dem Blockmodell; das Impressum zeigt zusätzlich den Bildnachweis. */
export async function RechtSeite({ slug }: { slug: "impressum" | "datenschutz" }) {
  const q = await inhaltsquelle();
  const [seite, nachweise] = await Promise.all([q.getRechtSeite(slug), slug === "impressum" ? q.getBildnachweise() : Promise.resolve([])]);
  return (
    <>
      <Seitenkopf titel={seite.titel} einleitung={seite.einleitung} />
      <div className="behaelter">
        <p className="klein text-grau">Stand: {seite.stand}</p>
        <div className="mt-6">
          <RichText bloecke={seite.bloecke} />
        </div>
        {slug === "impressum" ? (
          <div className="richtext mt-6">
            <h3>Bildquellen</h3>
            <ul>
              {nachweise.map((n) => (
                <li key={n.quelle}><strong>{n.titel}</strong>: {n.urheber}. Quelle: {n.quelle}. {n.lizenz}.</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
}
