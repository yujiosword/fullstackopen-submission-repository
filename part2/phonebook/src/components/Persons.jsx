const Persons = ({persons, filterRule}) => {
  return (
      <>
          {persons.filter(filterRule).map(person => <p>{person.name} {person.number}</p>)}
      </>
  )
}

export default Persons