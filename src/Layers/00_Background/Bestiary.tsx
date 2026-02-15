import { useState } from 'react';
import CreatureGrid from './CreatureGrid';
import CreatureDetails from './CreatureDetails';

interface BestiaryProps {
  onBack: () => void;
}

const Bestiary = ({ onBack }: BestiaryProps) => {
  const [hoveredSpeciesId, setHoveredSpeciesId] = useState<string | null>(null);

  return (
    <div className="bestiary">
      <div className="bestiary-header">
        <button className="menu-button menu-button-small" onClick={onBack}>Back</button>
        <h2>Bestiary</h2>
      </div>
      <div className="bestiary-body">
        <CreatureGrid onHover={setHoveredSpeciesId} readOnly />
        <CreatureDetails hoveredSpeciesId={hoveredSpeciesId} />
      </div>
    </div>
  );
};

export default Bestiary;
