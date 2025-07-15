import { useState } from 'react'

const Button =({text, onClick}) => (
  <button onClick={onClick}>{text}</button>
)

const StatisticsLine = (props) => {
  if (props.text == 'positive'){
    return <p>{props.text} {props.value}%</p>
  }
  return <p>{props.text} {props.value}</p>
}

const Statistics = ({good, neutral, bad}) => {
  const all = good+neutral+bad
  if (all == 0)
    return <div>No feedback given</div>
  return (
    <>
      <StatisticsLine text='good' value ={good} />
      <StatisticsLine text='neutral' value ={neutral} />
      <StatisticsLine text='bad' value ={bad} />
      <StatisticsLine text='all' value ={all} />
      <StatisticsLine text='average' value ={(good*1 + bad*-1)/(good+neutral+bad)} />
      <StatisticsLine text='positive' value ={good/(good+neutral+bad)*100} />
    </>
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
    <Button text="good" onClick={()=>setGood(good+1)} />
    <Button text="neutral" onClick={()=>setNeutral(neutral+1)}/>
    <Button text="bad" onClick={()=>setBad(bad+1)}/>
    <h1>statistics</h1>
    <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App