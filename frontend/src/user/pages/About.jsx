import React from 'react'
import Title from '../components/Title'
import { assets } from '../../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Welcome to Rent the Fit, your go-to destination for renting stylish and high-quality fashion at unbeatable prices! We believe fashion should be accessible, sustainable, and hassle-free. Whether you need an outfit for a wedding, a party, or a special occasion, we bring you a wide range of trendy options all without the commitment of buying.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>At Rent the Fit, our mission is to make fashion affordable, sustainable, and accessible to everyone. We strive to reduce fashion waste by promoting the idea of renting over buying, allowing you to enjoy premium outfits without the hefty price tag.</p>
        </div>
      </div>

      <div className='text-xl py-4'>
      <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-30'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We take pride in offering high-quality, well-maintained outfits that look and feel brand new. Every piece in our collection undergoes a thorough quality check, professional cleaning, and sanitization, ensuring a fresh and flawless experience every time you rent from us.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convinience:</b>
          <p className='text-gray-600'>Renting your favorite outfits has never been easier! Our seamless online platform lets you browse, select, and rent your desired outfit in just a few clicks. With flexible rental periods and doorstep delivery, we make sure your fashion experience is effortless and enjoyable.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Your satisfaction is our top priority! Our dedicated support team is here to assist you at every step—whether you need help selecting an outfit, tracking your order, or managing returns. We ensure a smooth and hassle-free experience, so you can focus on looking your best!</p>
        </div>
      </div>
    </div>
  )
}

export default About