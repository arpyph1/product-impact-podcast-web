import { useState } from "react";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { useLatestShort } from "@/hooks/useLatestShort";

interface LatestShortCardProps {
  channelId: string | undefined;
}

export default function LatestShortCard({ channelId }: LatestShortCardProps) {
  const { data, loading, error } = useLatestShort(channelId);
  const [playing, setPlaying] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div
        className="relative rounded-xl overflow-hidden bg-card border border-border shadow-xl flex items-center justify-center"
        style={{ aspectRatio: "9/16" }}
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs font-medium">Finding latest Short…</span>
        </div>
      </div>
    );
  }

  // Error / not found state
  if (error || !data) {
    return (
      <div
        className="relative rounded-xl overflow-hidden bg-card border border-border shadow-xl flex items-center justify-center"
        style={{ aspectRatio: "9/16" }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground px-4 text-center">
          <AlertCircle className="w-6 h-6 text-destructive" />
          <span className="text-xs">
            {error || "No Shorts found"}
          </span>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${data.videoId}?autoplay=1&loop=1&playlist=${data.videoId}`;

  return (
    <div className="relative rounded-xl overflow-hidden bg-card border border-border group shadow-xl" style={{ aspectRatio: "9/16" }}>
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          title={data.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={data.thumbnail}
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-all duration-500" />

          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-black ml-0.5" />
            </div>
          </button>

          {/* Label */}
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <span className="text-xs font-medium text-white/90 line-clamp-2">{data.title}</span>
          </div>
        </>
      )}
    </div>
  );
}
