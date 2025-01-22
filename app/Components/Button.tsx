import clsx from 'clsx'
import React from 'react'

export default function Button({type,fullWidth,onClick,disabled,children}:{type?:'button'|'submit'|'reset'|undefined,fullWidth?:boolean,onClick?:()=>void,disabled?:boolean,children?:React.ReactNode}) {
  return (
   <>
    <button type={type} disabled={disabled} onClick={onClick} className={clsx(`flex justify-center rounded-md px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-card-foreground hover:bg-card-foreground focus-visible:outline-sky-600`,disabled&&'opacity-50 cursor-not-allowed',fullWidth && 'w-full')} >{children}</button>
   </>
  )
}