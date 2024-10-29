'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Input from './Input';
import Button from './Button';
import { signIn, useSession } from 'next-auth/react';
import { Session } from 'next-auth';

// Extend the Session type to include userType
declare module 'next-auth' {
  interface Session {
    userType?: 'Lecturer' | 'STUDENT' | 'ADMIN' | 'SuperAdmin';
  }
}
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import clsx from 'clsx'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


type Variant = 'REGISTER' | 'LOGIN';

export default function StaffAuthForm() {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [loading, setisLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const toggleLoading = () => {
    setisLoading((prevLoading) => !prevLoading);
  };

  const toggleVariant = useCallback(() => {
    setVariant((prevVariant) => (prevVariant === 'LOGIN' ? 'REGISTER' : 'LOGIN'));
  }, []);

  const session = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      if (session.data.userType === 'Lecturer') {
        router.push('/Lecturer');
    //   } else 
    //   if(session.data.userType === 'STUDENT') {
    //     router.push('/Student/home');
      }
       else if(session.data.userType === 'ADMIN') {
        router.push('/Admin');
      }else{
        router.push('/SuperAdmin/Dashboard')
      }
    }
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/; //This rejects emails like 123@gmail.com and accepts emails like example123@gmail.com, all emails must be lowercase
    return emailRegex.test(email);
  };
  const validatePhoneNumber = (regNo: string) => {
    const pattern = /^[A-Z]{3}\/B\/\d{2}-\d{5}\/\d{4}$/;
    return pattern.test(regNo);
  };

  const handleSubmit = async () => {
    const event = window.event;
    if (!event) {
      return;
    }
    event.preventDefault();

    toggleLoading();
    if (!isValidEmail(formData.email)) {
      toggleLoading();
      toast.error('Please enter a valid email address');
      return;
    }

    if (variant === 'LOGIN'){
      if(formData.email === ''|| formData.email===null || formData.password === ''|| formData.password===null){
        toggleLoading();
        toast.error('Please fill all the fields')
      }
    }else{
      if(formData.firstName === ''|| formData.firstName===null || formData.secondName === ''|| formData.secondName===null || formData.email === ''|| formData.email===null || formData.password === ''|| formData.password===null || formData.phoneNumber === ''|| formData.phoneNumber===null){
        toggleLoading();
        toast.error('Please fill all the fields')
      }
    }

    
console.log(formData)
    try {

     

      if (variant === 'REGISTER') {
        try {

          toast.loading("Sending request...");
      
          // Send POST request to the server
          const response = await fetch('/api/registerStaff', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          toast.dismiss();

          // Check response status and act accordingly
          if (response.ok && response.status === 200 || response.status === 201) {
            toast.success('User Registered Successfully');
          } else if (response.status === 400) {
            const errorData = await response.json();
            toast.error(errorData.error);
          } else if (response.status === 409) {
            toast.error('User with these credentials already exists');
          } else {
            toast.error('Unexpected error occurred');
          }
        } catch (error) {
          // Handle network or unexpected errors
          toast.dismiss();
          toast.error('Failed to send request. Please try again.');
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
          toast.error('Unauthorized acccess');
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

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
               id='phoneNumber'
               name='phoneNumber'
               label='Phone Number'
               required
               type='text'
               placeholder='Enter Phone Number'
               disabled={disabled}
               value={formData.phoneNumber}
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
          //  pattern="^[a-zA-Z0-9._%+-]+@mmust\.ac\.ke$"
         />
         <div className='relative'>
          <Input
            required
            id='Pword'
            name='password'
            label='Password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter Password'
            disabled={disabled}
            value={formData.password}
            onChange={handleChange}
            />
            <div
             className='absolute inset-y-0 right-0 flex  pr-1 cursor-pointer   items-center mt-7 '
             onClick={togglePasswordVisibility} 
           >
             {showPassword ? (
              <EyeSlashIcon className='w-4 max-[425px]:w-3'/>
             ) : (
               <EyeIcon className='w-4 max-[425px]:w-3'/>
             )}
           </div>
          </div>
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