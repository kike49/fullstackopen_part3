const Person = ({name, number, handleDeletePerson}) => {
    return (
        <div>
            {name} {number}
            <button onClick={handleDeletePerson}>Delete</button>
        </div>
    )
}

export default Person
