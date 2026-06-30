"use client"
import { Loader2 } from "lucide-react";
import { CreateLinkAction, UpdateLinkAction } from "@/features/dashboard/actions/LinkAction";
import { UploadImageAction } from "@/features/dashboard/actions/ImageAction";
import InputLink from "./InputLink";
import { Link } from "@prisma/client";
import { useActionState } from "react";
import { compressImage } from "@/utils/compressImage";
import { showToast } from "nextjs-toast-notify";

type Props = {
  link?: Link,
  onCancel: () => void,
  handleLinkCreated: (newLink: Link) => void
  handleLinksUpdated: (newLink: Link) => void
}

export const InlineForm = ({ link, onCancel, handleLinkCreated, handleLinksUpdated }: Props) => {

  const submitAction = async (prevState: { error: string | null | undefined }, formData: FormData) => {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | undefined = link?.imageUrl ?? undefined;

    if (imageFile && imageFile.size > 0) {
      const compressed = await compressImage(imageFile);
      const uploadFormData = new FormData();
      uploadFormData.append("image", compressed);
      const uploadResult = await UploadImageAction(uploadFormData);
      if (uploadResult.success) {
        imageUrl = uploadResult.imageUrl;
      } else {
        return { error: uploadResult.error };
      }
    }

    const body = { title, url, imageUrl };

    let response;
    if (link) {
      response = await UpdateLinkAction(body, link.id);
    } else {
      response = await CreateLinkAction(body);
    }

    if (response.success && response.data) {

      showToast.success(
        link ? "¡Enlace actualizado con éxito!" : "¡Enlace creado con éxito!",
        {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
          progress: true,
        }
      );

      if (!link) {
        handleLinkCreated(response.data);
      } else {
        handleLinksUpdated(response.data);
      }
      return { error: null };
    }

    const errorMsg = typeof response.error === "string" ? response.error : "Algo salió mal";

    showToast.error(errorMsg, {
      duration: 4000,
      position: "top-right",
      transition: "bounceIn",
      progress: true,
    });

    return { error: errorMsg };
  };

  const [state, formAction, isPending] = useActionState(submitAction, { error: null });

  return (
    <form
      action={formAction}
      className="bg-white border-2 border-charcola rounded-xl p-5 shadow-md transition-all"
    >
      <InputLink link={link} />

      {state.error && (
        <p className="text-red-500 text-sm mt-2">{typeof state.error === 'string' ? state.error : 'Error al guardar'}</p>
      )}

      <div className="flex justify-end gap-3 mt-4">
        <button
          disabled={isPending}
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Close
        </button>
        <button
          disabled={isPending}
          type="submit"
          className="cursor-pointer px-4 py-2 text-sm font-medium bg-charcola text-white rounded-lg hover:bg-[#0E6251] transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : link ? "Update" : "Save Again"}
        </button>
      </div>
    </form>
  )
};
