export default function Services() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-950 p-24">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-12">
        Our Services
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-orange-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white mb-3">Web Development</h3>
          <p className="text-gray-400">Custom web applications built with modern frameworks like React and Next.js.</p>
        </div>
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-orange-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white mb-3">UI/UX Design</h3>
          <p className="text-gray-400">Intuitive and beautiful interfaces designed with the user in mind.</p>
        </div>
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-orange-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white mb-3">Cloud Hosting</h3>
          <p className="text-gray-400">Reliable and scalable cloud infrastructure for your growing business.</p>
        </div>
      </div>
    </main>
  );
}
