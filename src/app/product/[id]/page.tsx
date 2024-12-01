'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProductDetails from '@/components/ProductDetails';

const ProductPage: React.FC = () => {
  const params = useParams();
  const productId = params.id as string;

  return <ProductDetails productId={productId} />;
};

export default ProductPage;
