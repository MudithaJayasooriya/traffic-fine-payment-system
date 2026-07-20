function Header({ title, subtitle }) {
  return (
    <div className="bg-[#07223a] border border-[#164e70] p-6 rounded-2xl shadow-xl flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-[#fff6ea] tracking-wide">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-[#aacde9] mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#072b46] border border-[#4aa3ff]/40 text-[#4aa3ff] text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-[#1fc97a] animate-pulse"></span>
        SYSTEM OPERATIONAL
      </div>
    </div>
  );
}

export default Header;