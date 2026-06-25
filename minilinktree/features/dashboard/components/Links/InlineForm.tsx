import { ImageIcon, Loader2 } from "lucide-react";
import { CreateLinkAction, UpdateLinkAction } from "@/features/dashboard/actions/LinkAction";
import InputLink from "./InputLink";
import { Link } from "@prisma/client";
import { useActionState } from "react";

type Props = {
  link?: Link,
  onCancel: () => void,
  handleLinkCreated: (newLink: Link) => void
  handleLinksUpdated: (newLink: Link ) => void

}
export const InlineForm = ({ link, onCancel, handleLinkCreated, handleLinksUpdated }: Props) => {
  
  const submitAction = async (prevState: any, formData: FormData) => {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const body = { title, url };
    
    let response;
    if (link) {
      response = await UpdateLinkAction(body, link.id);
    } else {
      response = await CreateLinkAction(body);
    }

    if (response.success && response.data) {
      if (!link) {
        handleLinkCreated(response.data);
      } else {
        handleLinksUpdated(response.data);
      }
      return { error: null };
    }

    return { error: response.error || "Something went wrong" };
  };

  const [state, formAction, isPending] = useActionState(submitAction, { error: null });

  return(
    <form 
      action={formAction}
      className="bg-white border-2 border-charcola rounded-xl p-5 shadow-md transition-all">
        <div className="flex gap-4">
          <button className="min-w-[64px] h-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 border-charcola-hover text-charcola-hover transition-colors group">
            <ImageIcon size={24} className="group-hover:scale-110 transition-transform" />
          </button>
          <div className="flex-1 flex flex-col gap-3">
            <InputLink link={link} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button 
          disabled={isPending}
          onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Close
          </button>
          <button 
          disabled={isPending}
          type="submit"
          className="cursor-pointer px-4 py-2 text-sm font-medium bg-charcola text-white rounded-lg bg-charcola-hover transition-colors">
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> {/* 🚀 Spinner animado de Lucide */}
              </>
            ) : (
              link ? "Update" : "Save Again"
            )}
          </button>
        </div>
    </form>
  )
};