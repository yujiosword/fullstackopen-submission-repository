const PersonForm = ({onSubmit, nameValue, onNameChange, numberValue, onNumberChange}) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          name: <input name='personName' id='person-name' value={nameValue} onChange={onNameChange} />
        </div>
        <div>
          number: <input name='personNumber' id='person-number' value={numberValue} onChange={onNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

export default PersonForm