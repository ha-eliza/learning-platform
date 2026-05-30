export interface MaterialsProps {
    id: number;
    url: string;
    title: string;
    content?: string;
    teacher: string;
    tags?: string[];
    date: Date;
    category?: string;
    type: "manual" | "practic";
    fileUrl?: string[];
    is_submitted: boolean;
    is_published: boolean;
}
