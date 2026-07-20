import Container from "@/components/layout/Container";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center">
      <Container>
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">
            Vinayak Joshi
          </p>

          <h1 className="mt-4 text-6xl font-bold tracking-tight">
            No.One
          </h1>

          <p className="mt-6 text-neutral-400 max-w-xl mx-auto">
            The Digital Headquarters of Vinayak Joshi.
          </p>
        </div>
      </Container>
    </main>
  );
}