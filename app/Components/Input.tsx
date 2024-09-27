import React from 'react'
import clsx from 'clsx'

export default function Input({label,id,placeholder,type,disabled,required,value,onChange,name}:{label:string,id:string,placeholder:string,type:string,disabled?:boolean, required?:boolean,name:string, value?:string,onChange?:((event:any)=>void)}) {
  return (
   <>
   <label className='
   block text-sm font-medium leading-7 text-gray-900' htmlFor={id}>{label}
   </label>
   <input type={type} id={id} placeholder={placeholder} required={required} value={value} onChange={onChange} autoComplete={id} name={name} disabled={disabled} className={clsx(`block w-full rounded-md border-0 py-1.5 px-3 mb-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 outline-sky-300`,disabled && 'opacity-100 cursor-default')} />

   </>
  )
}