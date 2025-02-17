import React, { createContext, useContext, useEffect, useState } from 'react'
import { foodData } from '../data';

const CartContext = createContext(null);
const CART_KEY = 'cart';
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};



export default function CartProvider({ children }) {
    
    const initCart = getCartFromLocalStorage();
    const [cartItems, setCartItems] = useState(initCart.items);
    const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
    const [totalCount, setTotalCount] = useState(initCart.totalCount);

    useEffect(() => {
        const totalPrice = sum(cartItems.map(item => item.price));
        const totalCount = cartItems.length;
        setTotalPrice(totalPrice);
        setTotalCount(totalCount);
        localStorage.setItem(
            CART_KEY,
            JSON.stringify({
              items: cartItems,
              totalPrice,
              totalCount,
            })
          );

      }, [cartItems]);

      function getCartFromLocalStorage() {
        const storedCart = localStorage.getItem(CART_KEY);
        return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
      }
    
    



    const sum = items => {
        return items.reduce((prevValue, curValue) => prevValue + curValue, 0);
      };
    










    const removeFromCart = foodId => {
        const filteredCartItems = cartItems.filter(item => item.food.id !== foodId);
        setCartItems(filteredCartItems);
      };

    const changeQuantity = (cartItem, newQauntity) => {
        const { food } = cartItem;
    
        const changedCartItem = {
          ...cartItem,
          quantity: newQauntity,
          price: (food.price/1000) * newQauntity,
        };
    
        setCartItems(
          cartItems.map(item => (item.food.id === food.id ? changedCartItem : item))
        );
      };

      const addToCart = food => {
        const cartItem = cartItems.find(item => item.food.id === food.id);
        if (cartItem) {
          changeQuantity(cartItem, cartItem.quantity + 1);
        } else {
          setCartItems([...cartItems, { food, quantity: 1, price: food.price }]);
        }
      };
    



return (
<CartContext.Provider
 value={{ cart: {items: cartItems, totalPrice, totalCount },
 removeFromCart,changeQuantity,addToCart,}}
 >
    {children}
    </CartContext.Provider>
);
} 
export const useCart =() => useContext(CartContext);