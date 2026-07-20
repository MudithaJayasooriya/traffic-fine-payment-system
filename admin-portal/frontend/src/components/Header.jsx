function Header({ title, subtitle }) {
  return (
    <div className="bg-[#07223a] border border-[#164e70] p-4 rounded-xl shadow-lg flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-[#fff6ea] tracking-wide">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-[#aacde9] mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#072b46] border border-[#4aa3ff]/40 text-[#4aa3ff] text-[11px] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1fc97a] animate-pulse"></span>
        SYSTEM OPERATIONAL
      </div>
    </div>
  );
}

export default Header;