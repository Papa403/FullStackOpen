import { useState } from 'react'

const Statistics = (props) => {
  if (props.text === 'positive') {
    return <div>{props.text} {props.value}%</div> 
  }

  return (
    <div>
      {props.text} {props.value}
    </div>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
    <h1>give feedback</h1>
    <button onClick={()=>setGood(good+1)}>good</button>
    <button onClick={()=>setNeutral(neutral+1)}>neutral</button>
    <button onClick={()=>setBad(bad+1)}>bad</button>
    <h1>statistics</h1>
    <Statistics text="good" value={good}/>
    <Statistics text="neutral" value={neutral}/>
    <Statistics text="bad" value={bad}/>
    <Statistics text="all" value={good+neutral+bad}/>
    <Statistics text="average" value={(good*1 + bad*-1)/(good+neutral+bad)}/>
    <Statistics text="positive" value={good/(good+neutral+bad)*100}/>
    </div>
  )
}

export default App