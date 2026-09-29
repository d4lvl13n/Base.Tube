import styles from './visuals.module.css';

// Illustrative example of what a channel audit reads like.
// Deliberately no score and no numbers: the audit is a written critique with evidence.

const findings = [
  {
    title: 'The title repeats the thumbnail',
    text: 'Both say "5 tools". The title has room to add what the image cannot: who it is for, or what they will get.',
    evidence: '"5 tools every developer needs in 2026"',
  },
  {
    title: 'The text is too small for a phone',
    text: 'At feed size the last words fade into the background. Fewer words in larger type will read at a glance.',
    evidence: '"How I edit a full video in 30 minutes"',
  },
  {
    title: 'Recent uploads all look the same',
    text: 'A recognisable style helps viewers find you. When the layout never changes, videos blur together in the feed.',
    evidence: 'Pattern across the last uploads',
  },
];

export default function AuditPreview() {
  return (
    <figure className={styles.frame} aria-label="Illustrative example of a channel audit">
      <div className={styles.bar}>
        <span className={styles.barLabel}>Channel audit · Packaging</span>
        <span className={styles.chip}>Illustrative example</span>
      </div>

      <ol className={styles.findings}>
        {findings.map((f, i) => (
          <li key={f.title} className={styles.finding}>
            <span className={styles.findingNum}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div className={styles.findingTitle}>{f.title}</div>
              <p className={styles.findingText}>{f.text}</p>
              <p className={styles.evidence}>
                <span className={styles.evidenceLabel}>Evidence</span>
                {f.evidence}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.connected}>
        <span className={styles.dot} aria-hidden />
        <span>
          <strong>With YouTube connected:</strong> your real impressions and real click-through
          rate, so you can measure the same video before and after a change.
        </span>
      </div>
    </figure>
  );
}
