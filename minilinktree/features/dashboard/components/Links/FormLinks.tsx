'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { InlineForm } from './InlineForm';
import CardLink from './CardLink';
import { Link } from "@prisma/client";
import { DeleteLinkAction } from '../../actions/LinkAction';
type Props = {
    getLink: Link[] | undefined,
    isAdding: boolean,
    setIsAdding: Dispatch<SetStateAction<boolean>>
}

export default function FormLinks({getLink, isAdding, setIsAdding}: Props) {
    const [editingId, setEditingId] = useState<Link["id"] | null>(null);
    const [links, setLinks] = useState(Array.isArray(getLink) ? getLink : []);

    const handleLinkCreated = (newLink: Link) => {
        setLinks([...links, newLink]);
        setIsAdding(false); // Cierra el formulario
    };

    const handleLinksUpdated = (newLink: Link) => {
        const updatedLinks = links.map(link => 
            link.id === newLink.id ? newLink : link
        );
        setLinks(updatedLinks);
        setEditingId(null); // Cierra el formulario
    }

    // Activar/Desactivar Link (Toggle)
    const toggleLinkStatus = (id: Link["id"]) => {
        setLinks(links?.map(link => 
        link.id === id ? { ...link, isActive: !link.isActive } : link
        ));
    };

    // Eliminar Link Definitivamente
    const deleteLink = (id: Link["id"]) => {
        // Siempre es buena UX pedir confirmación antes de un borrado destructivo
        if(window.confirm("¿Estás seguro de que quieres eliminar este enlace para siempre?")) {
            DeleteLinkAction(id);
            setLinks(links?.filter(link => link.id !== id));
        }
    };


  return (
    <div className="flex flex-col gap-4">
        {isAdding && <InlineForm handleLinksUpdated={handleLinksUpdated} handleLinkCreated={handleLinkCreated} onCancel={() => setIsAdding(false)} />}

        {/* Renderizado de la lista interactiva */}
        {links?.map((link) => (
        <div key={link.id}>
            {editingId === link.id ? (
            <InlineForm  handleLinksUpdated={handleLinksUpdated} link={link} handleLinkCreated={handleLinkCreated} onCancel={() => setEditingId(null)} />
            ) : (
            // MAGIA UX: Si el enlace está inactivo, le bajamos la opacidad (opacity-60)
            <CardLink link={link} toggleLinkStatus={toggleLinkStatus} deleteLink={deleteLink} setEditingId={setEditingId} />
            )}
        </div>
        ))}
    </div>
  )
}
