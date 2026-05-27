import { InputBox } from "@/components/InputBox";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
          ⚡ Fast • Secure • Analytics Powered
        </div>

        <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-7xl">
          Shorten URLs.
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Track Everything.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
          A modern URL shortener built for speed, analytics, and scalability.
          Create short links instantly and monitor clicks in real-time.
        </p>

        <InputBox />

        <div className="mt-16 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl">
            <div className="mb-4 text-3xl">⚡</div>
            <h3 className="text-xl font-semibold">Fast Redirects</h3>
            <p className="mt-3 text-zinc-400">
              Optimized URL redirects using Redis caching and efficient backend
              architecture.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl">
            <div className="mb-4 text-3xl">📈</div>
            <h3 className="text-xl font-semibold">Click Analytics</h3>
            <p className="mt-3 text-zinc-400">
              Track URL visits with Redis-backed click counting and batched
              database updates.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl">
            <div className="mb-4 text-3xl">🛡️</div>
            <h3 className="text-xl font-semibold">Production-Ready Backend</h3>
            <p className="mt-3 text-zinc-400">
              Built with rate limiting, structured logging, Docker, and scalable
              backend practices.
            </p>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-10 text-sm text-zinc-500">
          <span>Next.js</span>
          <span>Express</span>
          <span>PostgreSQL</span>
          <span>Redis</span>
          <span>Docker</span>
        </div>
      </section>
    </main>
  );
}
