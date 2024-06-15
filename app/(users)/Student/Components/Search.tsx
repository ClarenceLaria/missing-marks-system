
'use client'
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useDebouncedCallback } from 'use-debounce'


export default function Search({placeholder}:{placeholder:string}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const {replace} = useRouter()
    
    const handleSearch = useDebouncedCallback( (term:string) =>{
    
    const params = new URLSearchParams(searchParams)
    
     if(term){
      params.set('query',term)
     }
     else{
      params.delete('query')
     }

     replace(`${pathname}?${params.toString()}`)

    },300)

    
  return (
    <div className='relative flex flex-1 flex-shrink-0  '>
      <MagnifyingGlassCircleIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900'/>
      <input type="text" 
      id='search' name='search'placeholder={placeholder} onChange={(e)=>{
        handleSearch(e.target.value)
      }} className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 outline-sky-300 ' />
    </div>
  )
}
