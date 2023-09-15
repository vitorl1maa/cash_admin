import { getCurrentUser } from "@/lib/session";

export default async function ServerAuth() {
  const user = await getCurrentUser();
  return (
    <>
      {user !== undefined && (
        <div className="bg-blue-950 w-full h-60">
          <h1 className="text-3xl font-bold">Server component</h1>
          {JSON.stringify(user)}
        </div>
      )}
    </>
  );
}
