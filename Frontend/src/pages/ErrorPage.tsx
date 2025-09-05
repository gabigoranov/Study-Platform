export default function ErrorPage({ error }: { error?: any }) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Oops!</h1>
      <p className="text-red-500">{error?.statusText || "Something went wrong."}</p>
      <p className="mt-2">{error?.data || error?.message || ""}</p>
    </div>
  );
}