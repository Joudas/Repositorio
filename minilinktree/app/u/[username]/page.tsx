import { getPublicProfile } from "@/features/profile/actions/PublicProfileAction";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import LinkMock from "@/components/LinkMock";
import Image from "next/image";
import { User } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const result = await getPublicProfile(username);
  if (!result.success) return { title: "Usuario no encontrado" };

  return {
    title: `${result.data.displayName} (@${result.data.username})`,
    description: result.data.bio || "Perfil de MiniLinktree",
    openGraph: {
      title: result.data.displayName ?? undefined,
      description: result.data.bio ?? undefined,
      images: result.data.avatarUrl ? [result.data.avatarUrl] : [],
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const result = await getPublicProfile(username);

  if (!result.success) notFound();

  const { links, avatarUrl, displayName, username: uname, bio } = result.data;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-4">

        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={displayName ?? ""} width={80} height={80} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User size={28} />
            </div>
          )}
        </div>

        <h1 className="text-xl font-bold text-gray-900">
          {displayName || "Sin nombre"}
        </h1>

        <p className="text-gray-500 text-sm">@{uname}</p>

        {bio && (
          <p className="text-gray-600 text-sm max-w-sm leading-relaxed">{bio}</p>
        )}

        <div className="w-full flex flex-col gap-3 mt-4">
          {links.length > 0 ? (
            links.map((link) => <LinkMock key={link.id} link={link} />)
          ) : (
            <p className="text-gray-400 text-sm">Este usuario aún no tiene enlaces.</p>
          )}
        </div>
      </div>
    </div>
  );
}
