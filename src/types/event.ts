export interface EventEffect {
  goldChange?: number;
  goldRange?: [number, number];
  healPercent?: number;
  damagePercent?: number;
  addCard?: string;       // card template ID
  addArtifact?: string;   // artifact template ID
}

export interface EventChoice {
  label: string;
  description?: string;
  nextStepId: string;
  condition?: { minGold?: number };
}

export interface EventStep {
  id: string;
  text: string;
  choices?: EventChoice[];
  effects?: EventEffect[];
  effectSummary?: string;
  nextStepId?: string;
  isTerminal?: boolean;
}

export interface GameEvent {
  id: string;
  title: string;
  startStepId: string;
  steps: Record<string, EventStep>;
}
