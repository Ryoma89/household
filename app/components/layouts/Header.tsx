'use client'
import Link from "next/link"
import LogoutButton from "../elements/LogoutButton";

const Header = ( ) => {

  return (
    <header className='flex justify-between items-center py-4 px-10 bg-mainColor text-white'>
      <h1 className='text-3xl'>Household Budget App</h1>
      <ul className='flex text-xl items-center'>
      <li className="mr-4 hover:opacity-70">
          <Link href="/login">Login</Link>
        </li>
        <li className=" mr-4 hover:opacity-70">
          <Link href="/signUp">Sign Up</Link>
        </li>
        <li className="hover:opacity-70">
          <LogoutButton />
        </li>
      </ul>
    </header>
  )
}

export default Header