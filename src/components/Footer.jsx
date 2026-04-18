export default function Footer() {
  return (
    <footer className="bg-black py-12 px-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-4">
        <div className="bg-[#22c55e] text-black px-3 py-2 rounded-none text-[16px] font-black">AC</div>
        <div className="text-left border-l border-white/10 pl-4">
          <p className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-tighter">Andrew Camisetas de Fútbol</p>
          <p className="text-[#22c55e] text-[12px] md:text-[13px] font-black uppercase tracking-widest">La pasión en tu piel</p>
        </div>
      </div>

      <p className="text-gray-400 text-[12px] md:text-[13px] font-bold uppercase tracking-widest">
        © 2026 Andrew Camisetas de Fútbol. Todos los derechos reservados.
      </p>

      <div className="flex gap-8 text-gray-400 text-[12px] md:text-[13px] font-black uppercase tracking-widest">
        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
        <a href="#" className="hover:text-white transition-colors">Términos</a>
      </div>
    </footer>
  );
}
