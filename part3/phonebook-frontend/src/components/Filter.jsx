const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input name='searchName' id='search-name' value={value} onChange={onChange} />
    </div>
  )
}

export default Filter