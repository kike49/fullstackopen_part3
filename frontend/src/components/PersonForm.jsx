const PersonForm = ({addData, name, number, handleNameChange, handleNumberChange}) => {
    return (
        <form onSubmit={addData}>
            <div>
                Name: <input value={name} onChange={handleNameChange} />
            </div>
            <div>
                Number: <input value={number} onChange={handleNumberChange} />
            </div>
            <div>
                <button type="submit">Add</button>
            </div>
        </form>
    )
}

export default PersonForm
