interface ShopScreenProps {
  onComplete: () => void;
}

const ShopScreen = ({ onComplete }: ShopScreenProps) => {
  return (
    <div className="map-screen-overlay">
      <div className="map-screen-content">
        <h2 className="map-screen-title">Shop</h2>
        <p className="map-screen-description">A merchant offers their wares.</p>
        <div className="map-screen-shop-area">
          {/* Placeholder for shop items */}
        </div>
        <div className="map-screen-actions">
          <button className="map-screen-btn" onClick={onComplete}>
            Exit to Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;
