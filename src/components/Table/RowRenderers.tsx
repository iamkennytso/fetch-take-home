import React from 'react'
import { Dog } from "../../hooks/useDogApi";
import { Column } from "./Table";
import styles from './RowRenderers.module.scss'

interface ImageCellProps {
  src: string;
  alt: string;
}

interface Metadata {
  alt?: string;
}

export enum CellTypes {
  Image = 'Image'
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

export const TextCellRenderer: React.FC<TextCellProps> = ({ val }) => {
  return <span>{val}</span>;
};

const getCellRenderer = (
  val: string | number, 
  type: CellTypes | null | undefined, 
  meta: Metadata
) => {
  switch (type) {
    case CellTypes.Image:
      const { alt } = meta
      return <ImageCellRenderer src={String(val)} alt={String(alt)} />
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
      {columns.map((col, colIndex) => {
        const val = dog[col.accessor];
        const { type, meta = {}} = col
        return <td key={colIndex} className={styles.cell}>{getCellRenderer(val, type, meta)}</td>;
      })}
    </tr>
  );
};