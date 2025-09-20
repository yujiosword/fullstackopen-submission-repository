import Header from './Header'
import Content from './Content'

const Course = ({course}) => {
  //const total = course.parts.map(part => part.exercises).reduce((sum, value) => sum+value, 0)
  return (
    <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    </>
  )
}

export default Course