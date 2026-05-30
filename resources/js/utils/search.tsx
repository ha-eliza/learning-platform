import { MaterialsProps } from "@/types/materials";

export const filterMaterials = (items: MaterialsProps[], searchText: string): MaterialsProps[] => {
    const query = searchText.toLowerCase().trim();
    if (!query) return items;

    return items.filter((item) => {
        const matchesTitle = item.title?.toLowerCase().includes(query);

        const matchesTags = item.tags?.some((tag) =>
            tag.toLowerCase().includes(query)
        );

        const matchesCategory = (item.category as any).name?.toLowerCase().includes(query);

        return matchesTitle || matchesTags || matchesCategory;
    });
};

export const filterStudentWorks = (works: any[], searchText: string): any[] => {
    const query = searchText.toLowerCase().trim();
    if (!query) return works;

    // Вспомогательная функция для перевода системного статуса в текст на русском
    const getStatusTextRu = (status: string): string => {
        if (status === 'verified') return 'сдано';
        if (status === 'rejected') return 'на доработке доработка';
        return 'на проверке проверка';
    };

    return works.filter((work) => {
        const title = work.material_title || work.material?.title || "";
        const studentName = work.student_name || work.user?.name || work.student?.name || "";
        const studentGroup = work.student_group || work.user?.group || work.student?.group || "";
        const grade = work.grade !== undefined && work.grade !== null ? String(work.grade) : "";
        const statusEn = work.status || "";
        const statusRu = getStatusTextRu(statusEn);

        return (
            title.toLowerCase().includes(query) ||
            studentName.toLowerCase().includes(query) ||
            studentGroup.toLowerCase().includes(query) ||
            statusEn.toLowerCase().includes(query) ||
            statusRu.toLowerCase().includes(query) ||
            grade.toLowerCase().includes(query)
        );
    });
};
