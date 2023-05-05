import { useRouter } from 'next/router';
import React from 'react'

const Header = () => {
    const router = useRouter();
  return (
    <div className='bg-white shadow-md sticky top-0 p-5 z-20'>
        <h2 className='text-black text-xl font-SourceSansPro'>
         Assets Menagement
        </h2>
    </div>
  )
}

export default Header
