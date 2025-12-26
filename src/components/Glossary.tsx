import React from "react";
import type { GlossaryEntry } from "../logic/i18n";

const Glossary: React.FC<{ title: string; intro: string; entries: GlossaryEntry[] }> = ({
  title,
  intro,
  entries,
}) => {
  return (
    <section className="card">
      <h2>{title}</h2>
      <p>{intro}</p>
      <div className="glossary">
        {entries.map((entry) => (
          <div key={entry.term} className="glossary-item">
            <h3>{entry.term}</h3>
            <p>{entry.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Glossary;
