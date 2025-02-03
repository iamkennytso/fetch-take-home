import React from 'react';
import styles from './Table.module.scss';
import { Button } from '../Button';
import { CellTypes } from './RowRenderers';

export enum SortDirection {
  Asc = 'asc',
  Des = 'desc'
}

// Define a generic column interface.
export interface Column<T> {
  header: string;
  accessor: keyof T;
  sortable?: boolean
  type?: CellTypes | null
  meta?: { property: string }
  onClick?: Function
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowRenderer: (row: T, columns: Column<T>[]) => React.ReactNode;
  loading: boolean;
  handleNextPageClick: () => void;
  handlePrevPageClick: () => void;
  handleSortClick: Function
  page: number;
  totalPages: number;
  sortBy: keyof T | null;
  sortDir: SortDirection;
}

function Table<T>({ 
  data, 
  columns, 
  rowRenderer,
  loading,
  handleNextPageClick, 
  handlePrevPageClick,
  handleSortClick,
  page,
  totalPages,
  sortBy,
  sortDir
}: TableProps<T>): JSX.Element {
  // todo: activity indicator
  if (loading) return <div>Loading...</div>

  // it's not the greatest looking, especially how the columns are all the same width
  // improve on design
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} onClick={() => handleSortClick(col)}>
                {col.header}
                {sortBy === col.accessor && (
                  <span>{sortDir === SortDirection.Asc ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => rowRenderer(row, columns))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <Button label='Previous' onClick={handlePrevPageClick} isDisabled={page === 1} />
        <div className={styles.pageText}>Page {page} of {totalPages}</div>
        <Button label='Next' onClick={handleNextPageClick} isDisabled={page === totalPages} />
      </div>
    </>
  );
}

export default Table;