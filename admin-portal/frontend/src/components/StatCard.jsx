function StatCard({ title, value, icon: Icon, color = "text-[#4aa3ff]", onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#07223a] border border-[#1f4f78] rounded-xl p-4 shadow-lg flex items-center justify-between transition-all duration-200 hover:border-[#4aa3ff]/50 ${onClick ? 'cursor-pointer hover:bg-[#072b46]' : ''}`}
    >
      <div>
        <h3 className="text-[11px] font-semibold text-[#aacde9] uppercase tracking-wider">
          {title}
        </h3>
        <p className={`text-xl font-extrabold mt-1 ${color}`}>
          {value}
        </p>
      </div>
      {Icon && (
        <div className="p-2.5 rounded-xl bg-[#072b46] border border-[#4aa3ff]/30 text-[#4aa3ff] text-lg">
          <Icon />
        </div>
      )}
    </div>
  );
}

export default StatCard;