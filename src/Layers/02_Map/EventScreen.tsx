import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectGold } from '../../redux/slices/Inventory/inventorySelector';
import { getRandomEvent } from '../../data/eventRegistry';
import { resolveAllEffects } from '../../data/resolveEventEffect';
import { EventStep } from '../../types/event';

interface EventScreenProps {
  onComplete: () => void;
}

const EventScreen = ({ onComplete }: EventScreenProps) => {
  const dispatch = useAppDispatch();
  const gold = useAppSelector(selectGold);

  const event = useMemo(() => getRandomEvent(), []);
  const [currentStepId, setCurrentStepId] = useState(event.startStepId);
  const [effectResult, setEffectResult] = useState<string | null>(null);
  const [effectsApplied, setEffectsApplied] = useState<Set<string>>(new Set());
  const [fadeClass, setFadeClass] = useState('event-step-visible');

  const currentStep: EventStep = event.steps[currentStepId];

  // Apply effects when arriving at an outcome step
  useEffect(() => {
    if (currentStep.effects && !effectsApplied.has(currentStepId)) {
      const summary = resolveAllEffects(currentStep.effects, dispatch);
      setEffectResult(summary);
      setEffectsApplied(prev => new Set(prev).add(currentStepId));
    }
  }, [currentStepId, currentStep, dispatch, effectsApplied]);

  const goToStep = useCallback((nextStepId: string) => {
    setFadeClass('event-step-hidden');
    setTimeout(() => {
      setCurrentStepId(nextStepId);
      setEffectResult(null);
      setFadeClass('event-step-visible');
    }, 300);
  }, []);

  const isChoiceStep = !!currentStep.choices;
  const isContinueStep = !currentStep.choices && !!currentStep.nextStepId && !currentStep.isTerminal;

  return (
    <div className="map-screen-overlay">
      <div className="map-screen-content event-content">
        <h2 className="map-screen-title">{event.title}</h2>

        <div className={`event-step ${fadeClass}`}>
          <p className="event-narrative">{currentStep.text}</p>

          {effectResult && (
            <p className="event-effect-summary">{effectResult}</p>
          )}

          {isChoiceStep && (
            <div className="event-choices">
              {currentStep.choices!.map((choice, i) => {
                const meetsCondition = !choice.condition?.minGold || gold >= choice.condition.minGold;
                return (
                  <button
                    key={i}
                    className="map-screen-btn event-choice-btn"
                    disabled={!meetsCondition}
                    onClick={() => goToStep(choice.nextStepId)}
                  >
                    <span>{choice.label}</span>
                    {choice.description && (
                      <span className="event-choice-desc">{choice.description}</span>
                    )}
                    {choice.condition?.minGold && (
                      <span className="event-choice-cost">Requires {choice.condition.minGold}g</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {isContinueStep && (
            <div className="map-screen-actions">
              <button
                className="map-screen-btn"
                onClick={() => goToStep(currentStep.nextStepId!)}
              >
                Continue
              </button>
            </div>
          )}

          {currentStep.isTerminal && (
            <div className="map-screen-actions">
              <button className="map-screen-btn leave-btn" onClick={onComplete}>
                Continue your journey
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventScreen;
