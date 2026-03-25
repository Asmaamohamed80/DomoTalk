import { useEffect, useState } from "react";

const HudOverlay = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Crosshair corners */}
      <div className="crosshair-corner crosshair-corner--tl top-4 left-4 animate-crosshair-pulse" />
      <div className="crosshair-corner crosshair-corner--tr top-4 right-4 animate-crosshair-pulse" />
      <div className="crosshair-corner crosshair-corner--bl bottom-4 left-4 animate-crosshair-pulse" />
      <div className="crosshair-corner crosshair-corner--br bottom-4 right-4 animate-crosshair-pulse" />

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 h-px bg-primary/20 animate-scan-line" />
      </div>

      {/* Top left data */}
      <div className="absolute top-8 left-8 font-mono text-[10px] text-muted-foreground tracking-widest uppercase space-y-1">
        <div className="animate-flicker-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
          SYS.STATUS: <span className="text-primary">ONLINE</span>
        </div>
        <div className="animate-flicker-in" style={{ animationDelay: "0.4s", opacity: 0 }}>
          {timestamp}
        </div>
        <div className="animate-flicker-in" style={{ animationDelay: "0.6s", opacity: 0 }}>
          FRAME: {String(tick).padStart(6, "0")}
        </div>
      </div>

      {/* Top right data */}
      <div className="absolute top-8 right-8 font-mono text-[10px] text-muted-foreground tracking-widest uppercase text-right space-y-1">
        <div className="animate-flicker-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
          NEURAL.LINK: <span className="text-primary">ACTIVE</span>
        </div>
        <div className="animate-flicker-in" style={{ animationDelay: "0.5s", opacity: 0 }}>
          BANDWIDTH: 847.3 TB/s
        </div>
        <div className="animate-flicker-in" style={{ animationDelay: "0.7s", opacity: 0 }}>
          LATENCY: 0.003ms
        </div>
      </div>

      {/* Bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase text-center">
        <div className="animate-flicker-in" style={{ animationDelay: "1s", opacity: 0 }}>
          ▸ SUBJECT PROFILE ▸ CLASSIFICATION: RESTRICTED ▸
        </div>
      </div>
    </div>
  );
};

export default HudOverlay;
