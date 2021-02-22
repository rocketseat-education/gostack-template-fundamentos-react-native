import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const data = await AsyncStorage.getItem('@GoMarketplace/cart');

      if (data) {
        setProducts([...JSON.parse(data)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (item: Omit<Product, 'quantity'>) => {
      const productInCart = products.find(product => product.id === item.id);

      if (!productInCart) {
        setProducts([...products, { ...item, quantity: 1 }]);
      } else {
        productInCart.quantity += 1;
        setProducts([...products]);
      }

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);
      await AsyncStorage.setItem('@GoMarketplace', JSON.stringify(products));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const product = products.find(item => item.id === id);

      if (product) {
        product.quantity += 1;
      }

      setProducts([...products]);

      await AsyncStorage.setItem('@GoMarketplace', JSON.stringify(products));
    },
    [products],
  );


  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
