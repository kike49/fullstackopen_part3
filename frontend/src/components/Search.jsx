const Search = ({search, handler}) => {
    return (
        <div>
            Filter search with: <input type="text" value={search} onChange={handler} />
        </div>
    )
}

export default Search
