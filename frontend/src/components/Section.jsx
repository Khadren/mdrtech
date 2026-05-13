export default function Section({ id, title, children, as: Heading = "h1" }) {
  return (
    <section id={id} className="section">
      <Heading className="sectionTitle">{title}</Heading>
      <div className="sectionBody">{children}</div>
    </section>
  );
}
