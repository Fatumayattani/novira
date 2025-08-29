import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Sparkles, Image as ImageIcon, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { StoryGallery } from "./StoryGallery";
import heroImage from "@/assets/hero-storytelling.jpg";


interface StoryScene {
  id: string;
  text: string;
  imageUrl?: string;
  timestamp: number;
  volume: number;
  tone: 'calm' | 'excited' | 'mysterious' | 'dramatic';
}

export const StorytellingStudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [currentVolume, setCurrentVolume] = useState(0);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            setCurrentText(transcript);
          }
        }
        
        if (finalTranscript) {
          processStorySegment(finalTranscript);
          setCurrentText('');
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Speech recognition error. Please try again.');
        setIsRecording(false);
      };
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getToneFromVolume = (volume: number): StoryScene['tone'] => {
    if (volume > 0.8) return 'excited';
    if (volume > 0.6) return 'dramatic';
    if (volume > 0.3) return 'mysterious';
    return 'calm';
  };

  const processStorySegment = async (text: string) => {
    const tone = getToneFromVolume(currentVolume);
    const newScene: StoryScene = {
      id: crypto.randomUUID(),
      text: text.trim(),
      timestamp: Date.now(),
      volume: currentVolume,
      tone
    };

    setScenes(prev => [...prev, newScene]);
    
    // Generate image based on the story segment
    if (text.trim().length > 10) {
      generateSceneImage(newScene);
    }
  };

  const generateSceneImage = async (scene: StoryScene) => {
    setIsProcessing(true);
    try {
      // This would integrate with the image generation API
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockImageUrl = `https://picsum.photos/800/600?random=${scene.id}`;
      
      setScenes(prev => prev.map(s => 
        s.id === scene.id 
          ? { ...s, imageUrl: mockImageUrl }
          : s
      ));
      
      toast.success("Scene visualized! ✨");
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Couldn't visualize that scene. Try again!");
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio analysis for volume detection
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start volume monitoring
      monitorVolume();

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success("Start telling your story! 🎤");
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Couldn't access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
    setCurrentVolume(0);
    toast.info("Recording stopped. Your story is ready! 📖");
  };

  const monitorVolume = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const volume = average / 255;
    setCurrentVolume(volume);

    animationFrameRef.current = requestAnimationFrame(monitorVolume);
  };

  const clearStory = () => {
    setScenes([]);
    setCurrentText("");
    toast.info("Story cleared. Ready for a new adventure!");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="relative overflow-hidden rounded-3xl">
            <img 
              src={heroImage} 
              alt="Magical storytelling illustration" 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-2 animate-float">
                Story
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Transform your voice into living visual stories
              </p>
            </div>
          </div>
        </div>

        {/* Recording Controls */}
        <Card className="p-6 gradient-magic glow-magic">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                {isRecording ? "Recording Your Story..." : "Ready to Create Magic?"}
              </h2>
              <p className="text-primary-foreground/80">
                {isRecording 
                  ? "Speak clearly and let your imagination flow" 
                  : "Click record and start telling your story"
                }
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {isProcessing && (
                <div className="flex items-center gap-2 text-primary-foreground">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Creating magic...</span>
                </div>
              )}
              
              <VoiceVisualizer 
                isRecording={isRecording} 
                volume={currentVolume}
                className="hidden md:block"
              />
              
              <Button
                variant={isRecording ? "record" : "dream"}
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className="relative"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </>
                )}
              </Button>
              
              {scenes.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearStory}
                  disabled={isRecording || isProcessing}
                >
                  Clear Story
                </Button>
              )}
            </div>
          </div>

          {/* Current Speech Display */}
          {isRecording && (
            <div className="mt-6 p-4 bg-primary-foreground/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm text-primary-foreground/80">Live transcription:</span>
              </div>
              <p className="text-primary-foreground text-lg min-h-[1.5rem]">
                {currentText || "Listening..."}
              </p>
            </div>
          )}
        </Card>

        {/* Story Gallery */}
        {scenes.length > 0 && (
          <StoryGallery scenes={scenes} isProcessing={isProcessing} />
        )}

        {/* Getting Started */}
        {scenes.length === 0 && !isRecording && (
          <Card className="p-8 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 mx-auto gradient-dream rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">How to Create Story Magic</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h4 className="font-semibold">Press Record</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the record button and grant microphone permission
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h4 className="font-semibold">Tell Your Story</h4>
                  <p className="text-sm text-muted-foreground">
                    Speak naturally - your tone and volume shape the visuals
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h4 className="font-semibold">Watch Magic Happen</h4>
                  <p className="text-sm text-muted-foreground">
                    See your words transform into beautiful visual scenes
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};