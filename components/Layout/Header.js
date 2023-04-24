import { useRouter } from 'next/router';
import React from 'react'

const Header = () => {
    const router = useRouter();
  return (
    <div className='bg-black/10 px-10'>
        <h2 className='my-5 text-black text-xl font-SourceSansPro'>
         Assets Menagement
        </h2>
    </div>
  )
}

export default Header
