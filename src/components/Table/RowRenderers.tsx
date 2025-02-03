import React, { useState } from 'react'
import { Dog } from "../../hooks/useDogApi";
import { Column } from "./Table";
import styles from './RowRenderers.module.scss'

interface ImageCellProps {
  src: string;
  alt: string;
}

interface FavoriateCellProps {
  val: boolean,
  onClick: Function,
  id: string
}

interface Metadata {
  alt?: string;
}

export enum CellTypes {
  Image = 'Image',
  Favorite = 'Favorite'
}

export const ImageCellRenderer: React.FC<ImageCellProps> = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={styles.imgCell}
    />
  );
};

interface TextCellProps {
  val: string | number;
}

const TextCellRenderer: React.FC<TextCellProps> = ({ val }) => {
  return <span>{val}</span>;
};

const FavoriteCellRenderer: React.FC<FavoriateCellProps> = ({ val: initialVal, onClick, id}) => {
  // might break if you click too fast
  // should refactor this to be a pure component
  // logic for favoriting shouldn't be on here either, probably
  const [val, setVal] = useState(initialVal)
  const handleOnClick = async (id: string) => {
    const newVal = !val
    setVal(newVal)
    const newFavs: Record<string, boolean> = JSON.parse(localStorage.getItem('favDogs') || '{}');
    newFavs[id] = newVal
    localStorage.setItem('favDogs', JSON.stringify(newFavs))
  }
  return <div className={styles.favCell} onClick={() => handleOnClick(id)}>{val ? '❤️': '♡'}</div>;
};

const getCellRenderer = (
  val: any,
  type: CellTypes | null | undefined, 
  meta: Metadata,
  onClick: Function,
  dog: Dog
) => {
  switch (type) {
    case CellTypes.Favorite:
      return <FavoriteCellRenderer val={val} onClick={onClick} id={dog.id}/>
    case CellTypes.Image:
      const { alt } = meta
      return <ImageCellRenderer src={val} alt={String(alt)} />
    default:
      return <TextCellRenderer val={val} />
  }
}

export const DogRowRenderer = (
  dog: Dog,
  columns: Column<Dog>[]
) => {
  return (
    <tr key={dog.id} className={styles.row}>
      {columns.map((col, idx) => {
        const val = dog[col.accessor];
        const { type, meta = {}, onClick = () => {} } = col
        return <td 
          key={idx} 
          className={styles.cell}
        >
          {getCellRenderer(val, type, meta, onClick, dog)}
        </td>;
      })}
    </tr>
  );
};