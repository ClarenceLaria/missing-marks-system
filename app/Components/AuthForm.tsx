'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Input from './Input';
import Button from './Button';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import clsx from 'clsx'
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/authUptions';


type Variant = 'REGISTER' | 'LOGIN';

export default function AuthForm() {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [loading, setisLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    registrationNumber: '',
    userType:'STUDENT'
  });

  const toggleLoading = () => {
    setisLoading((prevLoading) => !prevLoading);
  };

  const toggleVariant = useCallback(() => {
    setVariant((prevVariant) => (prevVariant === 'LOGIN' ? 'REGISTER' : 'LOGIN'));
  }, []);

  const session = useSession();

  const router = useRouter();

  // useEffect(() => {
  //   if (session?.status === 'authenticated') {
  //     if (session.data.userType === 'Lecturer') {
  //       router.push('/Lecturer');
  //     } else if(session.data.userType === 'STUDENT') {
  //       router.push('/Student/home');
  //     }
  //      else if(session.data.userType === 'ADMIN') {
  //       router.push('/Admin');
  //     }else{
  //       router.push('/SuperAdmin/Dashboard')
  //     }

  //   }
  // });

  const handleSubmit = async () => {
    const event = window.event;
    if (!event) {
      return;
    }
    event.preventDefault();

    toggleLoading();

    if (variant === 'LOGIN'){
      if(formData.email === ''|| formData.email===null || formData.password === ''|| formData.password===null){
        toggleLoading();
        toast.error('Please fill all the fields')
        throw new Error('Missing fields')
      }
    }else{
      if(formData.firstName === ''|| formData.firstName===null || formData.secondName === ''|| formData.secondName===null || formData.email === ''|| formData.email===null || formData.password === ''|| formData.password===null || formData.registrationNumber === ''|| formData.registrationNumber===null){
        toggleLoading();
        toast.error('Please fill all the fields')
        throw new Error('Missing fields')
      }
    }

    

    try {

     

      if (variant === 'REGISTER') {

        


        toast.loading("Sending request...")

        const user = await fetch ('/api/register',{
          method:'POST',
          body:JSON.stringify(formData)
        })
        toast.dismiss()
        if(user?.ok && user?.status===200){
          toast.dismiss()
          toast.success('Request sent to admin successfully')
        } else if(!user?.ok && user?.status===400){
          toast.dismiss()
          toast.error('Something went wrong')
        }
        else if(user?.status===402){
          toast.dismiss()
          toast.error('User with credentials already exists')
        }
      }


      if (variant === 'LOGIN') {
        toast.loading("Authenticating user...")

        const callback = await signIn('credentials', {
          ...formData,
          redirect: false,
        });



        if (callback?.status === 401) {
          toast.dismiss();
          toast.error('Unauthorized');
        } else if (callback?.ok && !callback?.error) {
          toast.dismiss();
          toast.success('Logged In');
        }
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Something went wrong');
    } finally {
      toggleLoading();
    }
  };

  useEffect(() => {
    setDisabled(loading);
  }, [loading]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event) {
      return;
    }
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <div className=' mx-16 bg-white px-4 lg:px-10 py-6 mt-2 gap-2 rounded-md  shadow-lg'>
        <form>
          {variant === 'REGISTER' && (
             <>
             <Input
               id='FName'
               name='firstName'
               label='First Name'
               type='text'
               required
               placeholder='Enter First Name'
               disabled={disabled}
               value={formData.firstName}
               onChange={handleChange}
             />
             <Input
               id='SName'
               name='secondName'
               label='Second Name'
               required
               type='text'
               placeholder='Enter Second Name'
               disabled={disabled}
               value={formData.secondName}
               onChange={handleChange}
             />
             <Input
               id='regNo'
               name='registrationNumber'
               label='Registration Number'
               required
               type='text'
               placeholder='Enter Registration Number'
               disabled={disabled}
               value={formData.registrationNumber}
               onChange={handleChange}
             />
           </>
         )}
         <Input
           required
           id='email'
           name='email'
           label=' Email'
           type='email'
           placeholder='Email address'
           disabled={disabled}
           value={formData.email}
           onChange={handleChange}
         />
         <Input
           required
           id='Pword'
           name='password'
           label='Password'
           type='password'
           placeholder='Enter Password'
           disabled={disabled}
           value={formData.password}
           onChange={handleChange}
         />
          <div className='mt-4 text-gray-100'>
            <Button
              type='submit'
              fullWidth
              onClick={() => handleSubmit()}
              disabled={disabled}
            >
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        <div className='flex gap-2 justify-center text-xs mt-6 px-2 text-gray-500'>
          <div>{variant === 'LOGIN' ? "Don't have an account?": "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {variant === 'LOGIN' ? 'Sign up' : 'Login'}
          </div>
        </div>
      </div>
    </>
  );
}