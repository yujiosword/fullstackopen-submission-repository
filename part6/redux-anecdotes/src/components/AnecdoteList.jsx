import { useSelector, useDispatch } from "react-redux"
import { updateVote } from '../reducers/anecdoteReducer'


const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  const vote = id => {
    console.log('vote', id)
    dispatch(updateVote(id))
  }

  return (
    <div>
      {anecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote.id)} />
      ))}
    </div>
  )
}

export default AnecdoteList