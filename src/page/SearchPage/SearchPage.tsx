import { useState, useEffect } from 'react'
import { Dog, useDogApi } from '../../hooks/useDogApi'
import styles from './SearchPage.module.scss'
import { MultiSelect } from '../../components/MultiSelect'
import { Button } from '../../components'

enum Mode {
  Search = 'SEARCH',
  Results = 'RESULTS'
}

type LoginPageProps = {
  handleApiFail: () => void
}

const SearchPage: React.FC<LoginPageProps> = ({ handleApiFail }) => {
  const [breeds, setBreeds] = useState<string[]>([])
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<Dog[]>([])
  const { getBreeds, searchDogs } = useDogApi()

  useEffect(() => {
    (async () => {
      const breeds = await getBreeds()
      if (!breeds.length) {
        handleApiFail()
      }
      setBreeds(breeds)
    })()
  }, [])

  const handleSearch = async () => {
    const newSearchResults = await searchDogs({breeds})
    setSearchResults(newSearchResults)
  }

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
      </div>
      <div className={styles.tableContainer}>

      </div>
    </div>
  </div>
}

export default SearchPage
