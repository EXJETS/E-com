"use client";

export default function NewsletterForm() {
  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="your@email.com"
        className="bg-gray-800 border border-gray-700 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-pink-400 placeholder:text-gray-500"
      />
      <button
        type="submit"
        className="bg-pink-500 hover:bg-pink-600 text-white text-sm py-2.5 px-4 rounded-xl font-semibold transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
