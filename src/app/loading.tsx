export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-soft-bg">
      <div className="flex flex-col items-center justify-center animate-pulse">
        <img
          src="/assets/logo.png"
          alt="Ankit Nishad Logo Loading"
          className="h-24 md:h-32 w-auto object-contain drop-shadow-sm mb-6"
        />
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary-black rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 bg-primary-black rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 bg-primary-black rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
