import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VoiceVisualizerProps {
  isRecording: boolean;
  volume: number;
  className?: string;
}

export const VoiceVisualizer = ({ isRecording, volume, className }: VoiceVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isRecording) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const bars = 32;
    const barWidth = width / bars;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Create gradient based on volume
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `hsl(260, 80%, ${65 + volume * 20}%)`);
      gradient.addColorStop(0.5, `hsl(320, 60%, ${75 + volume * 15}%)`);
      gradient.addColorStop(1, `hsl(200, 80%, ${70 + volume * 20}%)`);

      ctx.fillStyle = gradient;

      // Draw bars with animated heights based on volume
      for (let i = 0; i < bars; i++) {
        const barHeight = (Math.sin(Date.now() * 0.01 + i * 0.5) * 0.5 + 0.5) * volume * height * 0.8 + 10;
        const x = i * barWidth + barWidth * 0.2;
        const y = centerY - barHeight / 2;
        
        ctx.fillRect(x, y, barWidth * 0.6, barHeight);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, volume]);

  if (!isRecording) {
    return (
      <div className={cn("w-32 h-16 rounded-lg bg-primary/10 flex items-center justify-center", className)}>
        <div className="text-xs text-muted-foreground">Voice Visualizer</div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        width={128}
        height={64}
        className="rounded-lg bg-primary-foreground/10 backdrop-blur-sm"
      />
      <div className="absolute inset-0 rounded-lg border border-primary-foreground/20" />
    </div>
  );
};