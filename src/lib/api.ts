import { Product } from '@/types/Product';
import { Order } from '@/types/Order';

interface SearchResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  includesRelatedCategories: boolean;
}

interface ProductsResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

function getToken(): string | null {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token expired or invalid
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    window.location.href = '/auth/login'; // Force redirect to login
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status: ${response.status}`);
  }

  return response;
}

export async function searchProducts(searchTerm: string, category: string): Promise<Product[]> {
  try {
    const response = await fetch(`http://localhost:5009/api/products/search?q=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

export async function getRecommendedProducts(query: string = '', limit: number = 10, productId?: string): Promise<Product[]> {
  try {
    let url: string;
    if (productId) {
      url = `http://localhost:5009/api/products/${productId}/recommendations?limit=${limit}`;
    } else {
      url = `http://localhost:5009/api/products/recommend-and-search?q=${encodeURIComponent(query)}&limit=${limit}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: SearchResponse = await response.json();

    // If it's a random recommendation (no query and no productId), shuffle the results
    if (!query && !productId) {
      return data.products.sort(() => 0.5 - Math.random()).slice(0, limit);
    }

    return data.products;
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch('http://localhost:5009/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
}

export async function getProductReviews(productId: string): Promise<any[]> {
  try {
    const response = await fetch(`http://localhost:5009/api/review/product-reviews/${productId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.reviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

export async function getFarmerProfile(): Promise<any> {
  const response = await fetchWithAuth('http://localhost:5009/api/users');
  return await response.json();
}

export async function getFarmerOrders(): Promise<Order[]> {
  try {
    const response = await fetchWithAuth('http://localhost:5009/api/farmer/orders');
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
    throw error;
  }
}

export async function getFarmerProducts(page: number = 1, limit: number = 10): Promise<any> {
  const response = await fetchWithAuth(`http://localhost:5009/api/farmer/products?page=${page}&limit=${limit}`);
  const data = await response.json();
  if (!data || !Array.isArray(data.products)) {
    throw new Error('Invalid data received from server');
  }
  return {
    products: data.products,
    totalCount: data.totalProducts,
    currentPage: data.currentPage,
    totalPages: data.totalPages
  };
}

export const uploadProductImages = async (images: File[]): Promise<{ url: string; originalName: string }[] | { [key: string]: string } | string> => {
  const formData = new FormData();
  images.forEach((image, index) => {
    formData.append(`image${index + 1}`, image);
  });

  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch('http://localhost:5009/api/upload/product', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload images');
  }

  return response.json();
};

export async function addProduct(productData: any): Promise<string> {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }
  const response = await fetch('http://localhost:5009/api/farmer/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add product');
  }

  const data = await response.json();
  return data.productId;
}

export async function updateProduct(productId: string, updatedProduct: any): Promise<void> {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const response = await fetch(`http://localhost:5009/api/farmer/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function toggleProductForSale(productId: string, isForSale: boolean): Promise<void> {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const response = await fetch(`http://localhost:5009/api/farmer/products/${productId}/toggle-sale`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isForSale })
    });

    if (!response.ok) {
      throw new Error('Failed to toggle product for sale status');
    }
  } catch (error) {
    console.error('Error toggling product for sale status:', error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`http://localhost:5009/api/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return await response.json();
}

export async function getCartItems(): Promise<any> {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  const response = await fetch('http://localhost:5008/api/cart/getitem', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart items');
  }
  return await response.json();
}

export async function updateCartItem(productId: string, quantity: number): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  const response = await fetch('http://localhost:5008/api/cart/updateitem', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });
  if (!response.ok) {
    throw new Error('Failed to update cart item');
  }
}

export async function removeCartItem(productId: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  const response = await fetch('http://localhost:5008/api/cart/removeitem', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId })
  });
  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }
}

export async function checkout(): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  const response = await fetch('http://localhost:5008/api/cart/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Checkout failed');
  }
}

export async function getProductDetails(productId: string): Promise<Product> {
  const response = await fetch(`http://localhost:5009/api/products/${productId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  return response.json();
}

export const addToCart = async (productId: string) => {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ productId }),
  });
  if (!response.ok) throw new Error('Failed to add to cart');
  return response.json();
};

export const removeFromCart = async (productId: string) => {
  const response = await fetch(`${API_URL}/cart/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ productId }),
  });
  if (!response.ok) throw new Error('Failed to remove from cart');
  return response.json();
};

export const getCart = async () => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch cart');
  return response.json();
};

export const placeOrder = async (orderData: any) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error('Failed to place order');
  return response.json();
};
