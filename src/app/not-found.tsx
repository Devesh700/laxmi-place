import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
      <h1 className="text-3xl font-bold text-stone-900">Page Not Found</h1>
      <p className="text-stone-700">
        The page you are looking for could not be found.
      </p>
      <Link
        href="/"
        className="inline-block rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white"
      >
        Return Home
      </Link>
    </section>
  );
}
