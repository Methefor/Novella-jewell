import { Metadata } from 'next';
import FavorilerClient from './FavorilerClient';

export const metadata: Metadata = {
  title: 'Favorilerim | NOVELLA',
  description: 'Beğendiğiniz ürünleri favorilerinize ekleyin ve dilediğiniz zaman ulaşın.',
};

export default function FavorilerPage() {
  return <FavorilerClient />;
}
