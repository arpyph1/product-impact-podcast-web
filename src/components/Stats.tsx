export default function Stats() {
  const stats = [
    { value: "Top 2%", label: "Most Shared Podcasts" },
    { value: "#1", label: "AI Strategy Podcast" },
    { value: "10,000+", label: "Followers" },
  ];

  return (
    <section className="bg-background" aria-label="Podcast statistics">
      <div className="container mx-auto px-6">
        <div className="py-20 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <span
                  className="font-display font-black text-primary leading-none"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
                >
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
