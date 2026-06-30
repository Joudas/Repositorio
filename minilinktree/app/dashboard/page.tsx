import { GetLinkAction } from "@/features/dashboard/actions/LinkAction";
import { validateProfile } from "@/features/profile/actions/ValidateProfile";
import LinkContainer from "@/features/dashboard/components/linkContainer";

export default async function DashboardPage() {
    const profile = await validateProfile();
  
  const getLinkAction = await GetLinkAction();
  const getLink = Array.isArray(getLinkAction?.data) ? getLinkAction.data : [];
  const errorMsg = getLinkAction?.success === false
    ? (typeof getLinkAction.error === "string" ? getLinkAction.error : "Error al cargar los enlaces")
    : null;

  return (
    <LinkContainer profile={profile} getLink={getLink} errorMsg={errorMsg} />
  );
}
