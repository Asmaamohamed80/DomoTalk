interface Spec {
  label: string;
  value: string;
}

const DataPanel = ({ specs = [], side }: { specs: Spec[]; side: "left" | "right" }) => {
  const align = side === "left" ? "text-left" : "text-right";

  return (
    <div className={`flex flex-col gap-6 ${align}`}>
      {specs.map((item, i) => (
        <div
          key={item.label}
          className="animate-flicker-in"
          style={{ animationDelay: `${0.8 + i * 0.2}s`, opacity: 0 }}
        >
          <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-1">
            {item.label}
          </div>
          <div className="font-display text-xs tracking-widest text-foreground">
            {item.value}
          </div>
          <div className="mt-2 h-px bg-border w-full" />
        </div>
      ))}
    </div>
  );
};

export default DataPanel;
