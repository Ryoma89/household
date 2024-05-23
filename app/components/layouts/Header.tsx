const Header = ( ) => {
  return (
    <header className='flex justify-between items-center py-4 px-10 bg-mainColor text-white'>
      <h1 className='text-3xl'>Household Budget App</h1>
      <ul className='flex text-xl'>
        <li className='mr-4 hover:opacity-70'>Login</li>
        <li className='hover:opacity-70'>Sign up</li>
      </ul>
    </header>
  )
}

export default Header
