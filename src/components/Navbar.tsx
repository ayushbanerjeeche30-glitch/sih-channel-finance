import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-sm">
          🏛️
        </div>
        <div>
          <h1 className="font-bold text-xl text-gray-900 leading-tight">SamruddhiSetu</h1>
          <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">Channel Finance System for SC Beneficiaries</p>
        </div>
      </div>
      
      <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500">
        <Link href="/" className="hover:text-blue-900 transition-colors">Home</Link>
        <Link href="#" className="hover:text-blue-900 transition-colors">Scheme Finder</Link>
        <Link href="/calculator" className="hover:text-blue-900 transition-colors">EMI Calculator</Link>
        <Link href="/locator" className="text-blue-700 font-bold border-b-2 border-blue-700 pb-1">Partner Locator</Link>
        <Link href="/tracker" className="hover:text-blue-900 transition-colors">Track Application</Link>
        <Link href="#" className="hover:text-blue-900 transition-colors">Impact</Link>
      </nav>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm font-bold text-gray-700 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition">
          🌐 English
        </button>
        <button className="bg-blue-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition shadow-md">
          Find my scheme
        </button>
      </div>
    </header>
  );
}