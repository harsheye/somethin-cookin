import Image from 'next/image'
import Link from 'next/link'
import logoSvg from '../../app/logo.svg'

export const Header: React.FC<{ isLoggedIn: boolean; onLogout: () => void }> = ({ isLoggedIn, onLogout }) => {
  return (
    <header className="bg-white shadow-md mt-8">
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src={logoSvg} alt="Swastik Logo" width={100} height={100} className="overflow-hidden" />
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/marketplace" className="text-gray-600 hover:text-gray-900 text-lg">Marketplace</Link></li>
            <li><Link href="/farmer-dashboard" className="text-gray-600 hover:text-gray-900 text-lg">Farmer Dashboard</Link></li>
            <li><Link href="/mandi-prices" className="text-gray-600 hover:text-gray-900 text-lg">Mandi Prices</Link></li>
            {isLoggedIn ? (
              <>
                <li><Link href="/profile" className="text-gray-600 hover:text-gray-900 text-lg">Profile</Link></li>
                <li><button onClick={onLogout} className="text-gray-600 hover:text-gray-900 text-lg">Logout</button></li>
              </>
            ) : (
              <li><Link href="/login" className="text-gray-600 hover:text-gray-900 text-lg">Login</Link></li>
            )}
          </ul>
        </nav>
      </div> */}
    </header>
  )
}
