interface EventScreenProps {
  onComplete: () => void;
}

const EventScreen = ({ onComplete }: EventScreenProps) => {
  return (
    <div className="map-screen-overlay">
      <div className="map-screen-content">
        <h2 className="map-screen-title">Event</h2>
        <p className="map-screen-description">Something unusual happens along the path...</p>
        <div className="map-screen-actions">
          <button className="map-screen-btn" onClick={onComplete}>
            Exit Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventScreen;
