import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/audioUtils';

let nextStartTime = 0;
let outputAudioContext: AudioContext | null = null;
let inputAudioContext: AudioContext | null = null;
const sources = new Set<AudioBufferSourceNode>();

const OUTPUT_SAMPLE_RATE = 24000;
const INPUT_SAMPLE_RATE = 16000;
const SCRIPT_PROCESSOR_BUFFER_SIZE = 4096;

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,
  };
}

export const startLiveSession = async (
  mediaStream: MediaStream,
  isAslEnabled: boolean,
  onMessage: (message: LiveServerMessage) => Promise<void>,
  onError: (e: ErrorEvent) => void,
  onClose: (e: CloseEvent) => void,
  onOpen: () => void,
) => {

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });
  const outputNode = outputAudioContext.createGain();
  outputNode.connect(outputAudioContext.destination);

  const wrappedOnMessage = async (message: LiveServerMessage) => {
    const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
    if (base64EncodedAudioString && outputAudioContext) {
      nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
      const audioBuffer = await decodeAudioData(
        decode(base64EncodedAudioString),
        outputAudioContext,
        OUTPUT_SAMPLE_RATE,
        1,
      );
      const source = outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputNode);
      source.addEventListener('ended', () => {
        sources.delete(source);
      });

      source.start(nextStartTime);
      nextStartTime = nextStartTime + audioBuffer.duration;
      sources.add(source);
    }

    if (message.serverContent?.interrupted) {
      for (const source of sources.values()) {
        source.stop();
        sources.delete(source);
      }
      nextStartTime = 0;
    }

    await onMessage(message);
  };

  const baseSystemInstruction = 'You are Connect Flow, an advanced AI assistant specializing in seamless communication and accessibility. You are receiving a video and audio feed from the user. Be helpful, concise, and empathetic.';
  const aslSystemInstruction = 'Additionally, you must analyze the video feed for American Sign Language (ASL) gestures. When you recognize ASL, transcribe it as user input and preface the transcription with the marker "[ASL]: ".';
  
  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: () => {
        try {
          inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: INPUT_SAMPLE_RATE });
          
          const source = inputAudioContext.createMediaStreamSource(mediaStream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(SCRIPT_PROCESSOR_BUFFER_SIZE, 1, 1);

          scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
          onOpen();
        } catch (err) {
            console.error('Error setting up audio source:', err);
            onError(new ErrorEvent('audiosourceerror', { error: err as Error }));
        }
      },
      onmessage: wrappedOnMessage,
      onerror: onError,
      onclose: onClose,
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: isAslEnabled ? `${baseSystemInstruction} ${aslSystemInstruction}` : baseSystemInstruction,
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
  });

  return sessionPromise;
};

export const cleanupSession = () => {
  if (inputAudioContext) {
    inputAudioContext.close();
    inputAudioContext = null;
  }
  if (outputAudioContext) {
    outputAudioContext.close();
    outputAudioContext = null;
  }
  sources.forEach(source => source.stop());
  sources.clear();
  nextStartTime = 0;
};