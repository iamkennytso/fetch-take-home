import { useState, useEffect } from 'react'
import { Dog, SearchDogsParams, useDogApi } from '../../hooks/useDogApi'
import styles from './SearchPage.module.scss'
import { MultiSelect } from '../../components/MultiSelect'
import { Button } from '../../components'
import { Table, Column, DogRowRenderer, CellTypes } from '../../components/Table'
import { SortDirection } from '../../components/Table'

type LoginPageProps = {
  handleApiFail: () => void
}

const PAGE_SIZE = 25

const tableColumns: Column<Dog>[] = [
  { header: 'Favorite', accessor: 'fav', type: CellTypes.Favorite},
  { header: 'Image', accessor: 'img', type: CellTypes.Image },
  { header: 'Name', accessor: 'name', sortable: true },
  { header: 'Age', accessor: 'age', sortable: true },
  { header: 'Zip Code', accessor: 'zip_code' },
  { header: 'Breed', accessor: 'breed',  sortable: true },
];

const SearchPage: React.FC<LoginPageProps> = ({ handleApiFail }) => {
  const [breeds, setBreeds] = useState<string[]>([])
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([])
  const [loadingSearchResults, setLoadingSearchResults] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<Dog[]>([])
  const [sortBy, setSortBy] = useState<keyof Dog | null>('breed');
  const [sortDir, setSortDir] = useState<SortDirection>(SortDirection.Asc);
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const { getBreeds, searchDogs, matchDog } = useDogApi()

  useEffect(() => {
    (async () => {
      const breeds = await getBreeds()
      if (!breeds.length) {
        handleApiFail()
      }
      setBreeds(breeds)
    })()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [sortBy, sortDir, page])

  const handleSearch = async () => {
    setLoadingSearchResults(true)
    const searchParams: SearchDogsParams = {breeds: selectedBreeds}
    if (sortBy) {
      searchParams.sort = `${sortBy}:${sortDir}`
    }
    if (page !== 1) {
      searchParams.from = (page - 1) * PAGE_SIZE
    }
    const resultsPayload = await searchDogs(searchParams)
    const { dogs, total } = resultsPayload
    // temporary solution to remember favorites
    // won't work for multiple users
    const localFavorites: Record<string, boolean> = JSON.parse(localStorage.getItem('favDogs') || '{}');

    for (let dog of dogs) {
      if (localFavorites[dog.id]) {
        dog.fav = true
      }
    }
    setSearchResults(dogs)
    const newTotal = Math.floor(total / 25) + 1
    setTotalPages(newTotal)
    setLoadingSearchResults(false)
  }

  const handleMatch = async () => {
    // display this better
    setLoadingSearchResults(true)
    const favs = JSON.parse(localStorage.getItem('favDogs') || '{}')
    if (!favs) return
    const { dogs, total } = await matchDog(Object.keys(favs).filter(key => !!favs[key]))
    // this is jank
    dogs[0].fav = true
    setSearchResults(dogs)
    setTotalPages(total)
    setLoadingSearchResults(false)
  }

  const handleNextPageClick = () => {
    setPage(prev => prev + 1)
  }

  const handlePrevPageClick = () => {
    setPage(prev => prev - 1)
  }

  const handleSortClick = (col: Column<Dog>) => {
    if (!col.sortable) return
    if (sortBy === col.accessor) {
      setSortDir((prev) => (prev === SortDirection.Asc ? SortDirection.Des : SortDirection.Asc));
    } else {
      setSortBy(col.accessor);
      setSortDir(SortDirection.Asc);
    }
    setPage(1);
  }

  // refactor this so it doesn't run on every render
  const localFavorites: Record<string, boolean> = JSON.parse(localStorage.getItem('favDogs') || '{}');
  const hasFavs = Object.values(localFavorites).some(val => !!val)

  return <div className={styles.page}>
    <div className={styles.contentContainer}>
      <div className={styles.filtersContainer}>
        <MultiSelect
          options={breeds}
          selected={selectedBreeds}
          onChange={setSelectedBreeds}
          placeholder="Breeds..."
        />
        <Button label='Search' className={styles.button} onClick={handleSearch} isDisabled={!selectedBreeds.length}/>
        <Button label='Best Match' className={styles.button} onClick={handleMatch} isDisabled={!hasFavs}/>
      </div>
      <div className={styles.tableContainer}>
        <Table 
          data={searchResults} 
          columns={tableColumns} 
          rowRenderer={DogRowRenderer}
          loading={loadingSearchResults}
          handleNextPageClick={handleNextPageClick}
          handlePrevPageClick={handlePrevPageClick}
          handleSortClick={handleSortClick}
          page={page}
          totalPages={totalPages}
          sortBy={sortBy}
          sortDir={sortDir}
        />
      </div>
    </div>
  </div>
}

export default SearchPage
