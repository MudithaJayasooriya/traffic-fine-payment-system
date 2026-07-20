function StatCard({ title, value, icon: Icon, color = "text-[#4aa3ff]" }) {
  return (
    <div className="bg-[#07223a] border border-[#1f4f78] rounded-2xl p-6 shadow-xl flex items-center justify-between transition-all duration-200 hover:border-[#4aa3ff]/50">
      <div>
        <h3 className="text-xs font-semibold text-[#aacde9] uppercase tracking-wider">
          {title}
        </h3>
        <p className={`text-3xl font-bold mt-2 ${color}`}>
          {value}
        </p>
      </div>
      {Icon && (
        <div className="p-3.5 rounded-2xl bg-[#072b46] border border-[#4aa3ff]/30 text-[#4aa3ff] text-2xl">
          <Icon />
        </div>
      )}
    </div>
  );
}

export default StatCard;