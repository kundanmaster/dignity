import React from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/cart/cartContext';

const calculateTotalPrice = (items) => {
  return items
    .reduce((total, item) => {
      const price = parseFloat(item.course_price) || 0;
      return total + price;
    }, 0)
    .toFixed(2);
};

const CartPanel = () => {
  const { cartItems, removeFromCart, toggleCart } = useCart();

  const totalPrice = calculateTotalPrice(cartItems);

  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-1/5 bg-white shadow-lg p-4 z-[101] flex flex-col">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-xl font-bold">Cart</h2>
        <button onClick={toggleCart} className="text-gray-800 hover:text-gray-500">
          <span aria-hidden="true" className="text-2xl">
            &times;
          </span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div
              key={index}
              className="p-2 border-b border-gray-200 flex space-x-4"
            >
              <div className="flex-shrink-0">
                <Image
                  src="/images/pages/first_aid.jpg"
                  alt={item.course_title}
                  width={100}
                  height={100}
                  className="rounded object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{item.course_title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {stripHtmlTags(item.short_description)}
                </p>
                <p className="text-gray-800 font-bold text-end">
                  ${parseFloat(item.course_price).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 flex-shrink-0"
              >
                <span aria-hidden="true" className="text-xl">
                  &times;
                </span>
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No items in cart.</p>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <p className="font-bold text-lg">Total Price:</p>
            <p className="text-lg">${totalPrice}</p>
          </div>
          <button className="bg-goldlight hover:bg-primarygold text-white px-4 py-2 rounded w-full mt-2">
            Proceed to pay
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPanel;
