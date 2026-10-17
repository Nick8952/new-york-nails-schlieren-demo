/** Kopf einer Unterseite: Titel und Vorspann, darunter beginnt der Inhalt. */
export function Seitenkopf({ titel, einleitung }: { titel: string; einleitung?: string }) {
  return (
    <div className="behaelter pb-8 pt-12 lg:pb-12 lg:pt-20">
      <h1 className="titel-1 max-w-[18ch]">{titel}</h1>
      {einleitung ? <p className="vorspann mt-5">{einleitung}</p> : null}
    </div>
  );
}
