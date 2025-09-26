const Persons = ({persons, filterRule, deletePerson}) => {
  return (
      <>
          {persons.filter(filterRule).map(person => { 
            return (
              <div key={person.id}>
                {person.name} {person.number}
                <button onClick={() => deletePerson(person.name, person.id)}>delete</button>
              </div>
            ) 
          })}

      </>
  )
}

export default Persons