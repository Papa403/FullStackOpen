const Course = ({courses}) => {
  return (
    <>
    {courses.map(course => (
      <div key={course.id}>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total total={course.parts}/>
    </div>
    ))}
  </> 
  )
}
const Header = ({course}) => <h1>{course}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map(part => <Part key={part.id} part={part}/>)}
  </div>
)

const Part = ({part}) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = ({total}) => <h4>total of {total.reduce((sum,part)=>sum+part.exercises,0)} exercises</h4>

export default Course