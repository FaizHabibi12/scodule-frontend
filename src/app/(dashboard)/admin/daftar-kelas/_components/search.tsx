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

    useEffect(() => {
        const trimmedKeyword = keyword.trim()
        if (trimmedKeyword === search.trim()) return

        const timeout = window.setTimeout(() => {
            onSearchChange?.(trimmedKeyword)
        }, 350)

        return () => window.clearTimeout(timeout)
    }, [keyword, onSearchChange, search])

    return (
        <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="text-base rounded-2xl shadow w-full text-muted py-2.5 px-5 focus:outline-none bg-white"
            placeholder="Cari kelas..."
            aria-label="Cari"
        />
    )
}

export default Search
