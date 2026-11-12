"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
      <h1 className="text-3xl font-bold text-stone-900">Something Went Wrong</h1>
      <p className="text-stone-700">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
