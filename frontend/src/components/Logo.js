import Image from 'next/image';
import logo from '@/assets/svg/logo.svg';

const Logo = () => (
  <div className="w-36 bg text-primary">
    <Image src={logo} alt="Logo" width={100} height={100} className='w-full' />
  </div>
);

export default Logo;