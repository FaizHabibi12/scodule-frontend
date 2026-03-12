"use client"

import { KeyboardEvent, useState, useEffect } from "react"

type Props = {
    url: string,
    search: string,
    onSearchChange?: (query: string) => void
}

const Search = ({ search, onSearchChange }: Props) => {
    const [keyword, setKeyword] = useState<string>(search)

    useEffect(() => {
        setKeyword(search)
    }, [search])

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return
        const trimmedKeyword = keyword.trim()
        if (trimmedKeyword === search.trim()) return
        if (onSearchChange) {
            onSearchChange(trimmedKeyword)
        }
    }

    return (
        <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="text-base rounded-lg w-full text-muted py-2.5 px-5 border border-gray-300 focus:outline-none"
            placeholder="Cari mapel..."
            onKeyUp={handleSearch}
            aria-label="Cari"
        />
    )
}

export default Search
