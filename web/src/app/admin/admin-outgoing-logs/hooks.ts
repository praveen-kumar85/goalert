import Fuse from 'fuse.js'
import { useEffect, useRef, useState } from 'react'

interface FuseParams<T> {
  data: T[]
  keys?: Fuse.FuseOptionKey[]
  options?: Fuse.IFuseOptions<T>
}

interface FuseResults<T> {
  results: { item: T; refIndex: number }[]
  search: string
  setSearch: (search: string) => void
}

const defaultOptions = {
  shouldSort: true,
  threshold: 0.1,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
}

const DEFAULT_QUERY = ''

export const useFuse = <T>({
  data,
  keys,
  options,
}: FuseParams<T>): FuseResults<T> => {
  const [results, setResults] = useState<{ item: T; refIndex: number }[]>([])
  const [search, setSearch] = useState(DEFAULT_QUERY)
  const fuse = useRef<Fuse<T>>()

  console.log('f', data, search, results)

  useEffect(() => {
    if (!data) {
      return
    }
    fuse.current = new Fuse(data, {
      ...defaultOptions,
      ...options,
      keys,
    })
  }, [search, fuse, data, keys, options])

  useEffect(() => {
    async function set(): Promise<void> {
      if (fuse.current) {
        setResults(await fuse.current.search(search))
      }
    }
    set()
  }, [search, fuse, data])

  return { results, search, setSearch }
}
