function Header({ title }) {
  return (
    <div className="bg-white shadow p-5 rounded-xl">
      <h2 className="text-2xl font-bold text-slate-800">
        {title}
      </h2>
    </div>
  );
}

export default Header;