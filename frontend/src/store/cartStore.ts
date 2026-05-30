import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/order';
import { useAuthStore } from '@/store/authStore';

interface CartState {
  carts: Record<string, CartItem[]>;
  isCartOpen: boolean;
  addToCart: (product: any, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
}

const getActiveUserId = () => {
  const user = useAuthStore.getState().user;
  return user ? user._id : 'guest';
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carts: {},
      isCartOpen: false,
      
      addToCart: (product, size, quantity = 1) => {
        const { carts } = get();
        const activeUserId = getActiveUserId();
        const userCart = carts[activeUserId] || [];
        
        const existingItemIndex = userCart.findIndex(
          (item) => item._id === product._id && item.size === size
        );

        let newItems = [...userCart];

        if (existingItemIndex > -1) {
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity,
          };
        } else {
          newItems.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            size,
            quantity,
          });
        }

        set({
          carts: {
            ...carts,
            [activeUserId]: newItems,
          },
          isCartOpen: true,
        });
      },

      removeFromCart: (productId, size) => {
        const { carts } = get();
        const activeUserId = getActiveUserId();
        const userCart = carts[activeUserId] || [];
        
        const newItems = userCart.filter(
          (item) => !(item._id === productId && item.size === size)
        );
        
        set({
          carts: {
            ...carts,
            [activeUserId]: newItems,
          },
        });
      },

      updateQuantity: (productId, size, quantity) => {
        const { carts, removeFromCart } = get();
        const activeUserId = getActiveUserId();
        const userCart = carts[activeUserId] || [];
        
        if (quantity <= 0) {
          removeFromCart(productId, size);
          return;
        }

        const newItems = userCart.map((item) =>
          item._id === productId && item.size === size ? { ...item, quantity } : item
        );
        
        set({
          carts: {
            ...carts,
            [activeUserId]: newItems,
          },
        });
      },

      clearCart: () => {
        const { carts } = get();
        const activeUserId = getActiveUserId();
        
        set({
          carts: {
            ...carts,
            [activeUserId]: [],
          },
        });
      },
      
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'behencode_cart',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0 || !persistedState || !persistedState.carts) {
          const oldCartItems = persistedState?.cartItems || [];
          return {
            carts: {
              guest: oldCartItems,
            },
            isCartOpen: persistedState?.isCartOpen || false,
          };
        }
        return persistedState;
      },
    }
  )
);

export default useCartStore;

