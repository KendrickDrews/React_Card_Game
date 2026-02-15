import { useAppDispatch } from '../../redux/hooks';
import { menuState } from '../../redux/slices/Menu/menuSlice';

const MainMenu = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="main-menu">
      <h1 className="main-menu-title">Slay The Browser</h1>
      <div className="main-menu-buttons">
        <button className="menu-button" onClick={() => dispatch(menuState.setScreen('runConfig'))}>
          Start Game
        </button>
        <button className="menu-button" onClick={() => dispatch(menuState.setScreen('bestiary'))}>
          Bestiary
        </button>
        <button className="menu-button" onClick={() => dispatch(menuState.setScreen('options'))}>
          Options
        </button>
        <button className="menu-button" onClick={() => dispatch(menuState.setScreen('stats'))}>
          Game Stats
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
