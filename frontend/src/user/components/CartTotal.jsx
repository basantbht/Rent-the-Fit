import React, { useContext } from 'react';
import Title from './Title';
import { RentContext } from '../../../context/RentContext';

const CartTotal = ({ discount }) => {
    const { currency, delivery_fee, getCartAmount } = useContext(RentContext);

    const subtotal = getCartAmount();
    const discountedTotal = discount ? subtotal - (subtotal * discount / 100) : subtotal;
    const totalAmount = discountedTotal + delivery_fee;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'CART'} text2={'TOTALS'} />
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{currency} {subtotal}.00</p>
                </div>
                <hr />

                <div className='flex justify-between'>
                    <p>Shipping fee</p>
                    <p>{currency} {delivery_fee}.00</p>
                </div>
                <hr />

                {discount > 0 && (
                    <div className='flex justify-between'>
                        <p>Discount ({discount}%)</p>
                        <p>-{currency} {((subtotal * discount) / 100).toFixed(2)}</p>
                    </div>
                )}
                <hr />

                <div className='flex justify-between'>
                    <b>Total</b>
                    <b>{currency} {totalAmount}.00</b>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;
