import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Download, Share } from "lucide-react";
import { toast } from "sonner";

interface StoryScene {
  id: string;
  text: string;
  imageUrl?: string;
  timestamp: number;
  volume: number;
  tone: 'calm' | 'excited' | 'mysterious' | 'dramatic';
}

interface StoryGalleryProps {
  scenes: StoryScene[];
  isProcessing: boolean;
}

const toneColors = {
  calm: "bg-blue-100 text-blue-800 border-blue-200",
  excited: "bg-orange-100 text-orange-800 border-orange-200", 
  mysterious: "bg-purple-100 text-purple-800 border-purple-200",
  dramatic: "bg-red-100 text-red-800 border-red-200"
};

const toneEmojis = {
  calm: "🌙",
  excited: "⚡",
  mysterious: "🔮",
  dramatic: "🎭"
};

export const StoryGallery = ({ scenes, isProcessing }: StoryGalleryProps) => {
  const downloadStory = () => {
    const storyText = scenes.map((scene, index) => 
      `Scene ${index + 1} (${scene.tone}):\n${scene.text}\n`
    ).join('\n');
    
    const blob = new Blob([storyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `story-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Story downloaded! 📖");
  };

  const shareStory = async () => {
    const storyText = scenes.map(scene => scene.text).join(' ');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Story Magic Creation',
          text: storyText,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(storyText);
      toast.success("Story copied to clipboard! 📋");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Story Gallery</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadStory}>
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={shareStory}>
            <Share className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scenes.map((scene, index) => (
          <Card 
            key={scene.id} 
            className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-float"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animationDuration: `${3 + index * 0.2}s`
            }}
          >
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative flex items-center justify-center">
              {scene.imageUrl ? (
                <img 
                  src={scene.imageUrl} 
                  alt={`Scene ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-pulse-glow">
                    <ImageIcon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isProcessing ? "Creating visual magic..." : "Visual coming soon..."}
                  </p>
                </div>
              )}
              
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  Scene {index + 1}
                </Badge>
              </div>
              
              <div className="absolute top-3 right-3">
                <Badge 
                  className={`${toneColors[scene.tone]} backdrop-blur-sm border`}
                >
                  {toneEmojis[scene.tone]} {scene.tone}
                </Badge>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <p className="text-sm leading-relaxed">
                {scene.text}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Volume: {Math.round(scene.volume * 100)}%
                </span>
                <span>
                  {new Date(scene.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {/* Volume bar visualization */}
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-magic transition-all duration-300"
                  style={{ width: `${scene.volume * 100}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {scenes.length > 0 && (
        <Card className="p-6 gradient-dream glow-dream">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-primary-foreground">
              ✨ Story Complete! ✨
            </h3>
            <p className="text-primary-foreground/80 max-w-md mx-auto">
              You've created {scenes.length} magical scene{scenes.length !== 1 ? 's' : ''}! 
              Each one shaped by your unique voice and emotions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/60">
              <span>📖 Total words: {scenes.reduce((acc, scene) => acc + scene.text.split(' ').length, 0)}</span>
              <span>🎭 Tones used: {new Set(scenes.map(s => s.tone)).size}</span>
              <span>⏱️ Duration: {Math.round((scenes[scenes.length - 1]?.timestamp - scenes[0]?.timestamp) / 1000)}s</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};