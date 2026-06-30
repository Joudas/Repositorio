import { validateProfile } from "@/features/profile/actions/ValidateProfile";
import { GetLinkAction } from "@/features/dashboard/actions/LinkAction";
import ProfileContainter from "@/features/profile/components/profileContainter";

export default async function profilePage() {
  const profile = await validateProfile();
  const getLinkAction = await GetLinkAction();
  const links = Array.isArray(getLinkAction?.data) ? getLinkAction.data : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 h-full max-w-6xl mx-auto animation-fade-in">
      <ProfileContainter profileData={profile} links={links} />
    </div>
  );
}
