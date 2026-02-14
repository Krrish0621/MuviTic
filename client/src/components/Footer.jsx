const Footer = () => {
  return (
    <footer className="relative mt-40 w-full text-white border-t border-white/10 bg-gradient-to-b from-black via-zinc-900 to-black">

      <div className="px-6 md:px-16 lg:px-36 py-16 flex flex-col md:flex-row justify-between gap-14">

        {/* Brand Section */}
        <div className="md:max-w-sm">

          {/* Premium Text Logo */}
          <h1 className="text-3xl font-black tracking-widest">
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              MuviTic
            </span>
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-white/60">
            Experience cinema like never before. Discover the latest releases,
            book your seats instantly, and enjoy a seamless movie booking
            journey designed for modern audiences.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-6">
            <div className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-red-500 transition cursor-pointer">
              🎬
            </div>
            <div className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-red-500 transition cursor-pointer">
              🎥
            </div>
            <div className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-red-500 transition cursor-pointer">
              🍿
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex-1 flex flex-col sm:flex-row md:justify-end gap-14 md:gap-24">

          {/* Company Links */}
          <div>
            <h2 className="font-semibold mb-5 text-white text-lg">Company</h2>
            <ul className="text-sm space-y-3 text-white/60">
              <li>
                <a href="/" className="hover:text-red-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/movies" className="hover:text-red-400 transition">
                  Movies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="font-semibold mb-5 text-white text-lg">Contact</h2>
            <div className="text-sm space-y-3 text-white/60">
              <p>krrish@gmail.com</p>
              <p>+91 90000 00000</p>
              <p>India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-white/10 py-6 text-center text-sm text-white/50 bg-black">
        © {new Date().getFullYear()} MuviTic. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
