const Persons = ({person, onClick}) => 
                  <div key={person.id}>
                    {person.name} {person.number}
                    <button onClick={onClick}>delete</button>
                  </div>

export default Persons