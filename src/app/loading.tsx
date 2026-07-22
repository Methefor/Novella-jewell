export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-gold/25 border-t-gold rounded-full animate-spin" />
        <p className="font-sans font-light text-sm text-black/40 tracking-wide">
          Yükleniyor…
        </p>
      </div>
    </div>
  );
}
