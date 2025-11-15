
export interface TranscriptionEvent {
  id: number;
  speaker: 'You' | 'AI' | 'ASL';
  text: string;
  timestamp: string;
}

export interface FairnessMetrics {
    name: string;
    metrics: {
        accuracy: number;
        verification: number;
        fnr: number;
        fairness: number;
    }
}

export interface SessionData {
    transcriptionEvents: TranscriptionEvent[];
    finalMetrics: FairnessMetrics;
    durationInSeconds: number;
    aslModeEnabled: boolean;
}