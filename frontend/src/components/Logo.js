import Image from 'next/image'
import logo from '@/assets/svg/logo.svg'

const Logo = () => (
  <div className="w-24 sm:w-28 md:w-36 flex-shrink-0 text-primary">
    <Image src={logo} alt="Logo" width={100} height={100} className='w-full' />
  </div>
)


export default Logo
