import Part from './Part'

const Content = ({parts}) => 
  {
    const total = parts.map(part => part.exercises).reduce((sum, value) => sum+value, 0)
    return (
      <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
      <p>
        <b>total of {total} exercises</b>
      </p>
      </div>
    )
  }

export default Content

