import { useSelector, useDispatch } from 'react-redux'
import { increment,decrement } from './redux/slices/counter/counterSlice'
import { selectCount } from './redux'
import './styles/main.scss'

function App() {
  // const [count, setCount] = useState(0)
  const count = useSelector(selectCount)
  const dispatch = useDispatch()
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
      <div>Count: {count}</div>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
      </div>
    </>
  )
}

export default App
