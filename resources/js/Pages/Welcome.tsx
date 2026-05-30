"use client";

import { useState, useMemo } from "react";
import { LibraryList } from "@/Components/LibraryList";
import { Sort } from "@/Components/Sort";
import MainLayout from "@/Layouts/MainLayout";
import { PageProps } from "@/types";
import { MaterialsProps } from "@/types/materials";
import { ModalStudent } from "@/Components/ModalStudent";
import { ModalStudentResubmit } from "@/Components/ModalStudentResubmit";
import { SubmissionProps } from "@/types/submission";

interface WelcomeProps extends PageProps {
    materials: MaterialsProps[];
    studentWorks?: SubmissionProps[];
}

export default function Welcome({
    auth,
    materials = [],
    studentWorks = [],
}: WelcomeProps & { auth: any }) {
    const user = auth?.user;
    const isTeacher = user?.role === "teacher";
    console.log("Данные, пришедшие из Laravel в React:", materials);
    console.log("Роль пользователя (isTeacher):", isTeacher);

    // Стейты фильтрации
    const [category, setCategory] = useState<string>("all");
    const [teacher, setTeacher] = useState<string>("all");
    const [tags, setTags] = useState<string[]>([]);
    const [type, setType] = useState<string>("all");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Состояния для управления вынесенным модальным окном
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] =
        useState<MaterialsProps | null>(null);
    const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

    const onRead = (item: MaterialsProps) => {
        const routeParam = item.url ? item.url : String(item.id);
        window.open(`/materials/${routeParam}`, "_blank");
    };

    const onSend = (item: MaterialsProps) => {
        setSelectedMaterial(item);
        setIsModalOpen(true);
    };
    const handleOpenResubmit = (submission: any) => {
        setSelectedSubmission(submission);
        setIsResubmitModalOpen(true);
    };
    // Логика фильтрации и сортировки
    const filteredAndSortedItems = useMemo(() => {
        return materials
            .filter((item) => {
                const matchCategory =
                    category === "all" || item.category === category;
                const matchTeacher =
                    teacher === "all" || item.teacher === teacher;
                const currentType =
                    item.type === "practic" ? "practic" : item.type;
                const matchType = type === "all" || currentType === type;
                const matchTags =
                    tags.length === 0 ||
                    tags.every((t) => item.tags?.includes(t) ?? false);

                return matchCategory && matchTeacher && matchType && matchTags;
            })
            .sort((a, b) => {
                return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
            });
    }, [materials, category, teacher, type, tags, sortOrder]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <Sort
                    items={materials}
                    selectedCategory={category}
                    onCategoryChange={setCategory}
                    selectedTeacher={teacher}
                    onTeacherChange={setTeacher}
                    selectedTags={tags}
                    onTagsChange={setTags}
                    selectedType={type}
                    onTypeChange={setType}
                    sortOrder={sortOrder}
                    onSortOrderChange={() =>
                        setSortOrder((prev) =>
                            prev === "asc" ? "desc" : "asc",
                        )
                    }
                />

                {filteredAndSortedItems.length > 0 ? (
                    <LibraryList
                        books={filteredAndSortedItems}
                        studentWorks={studentWorks} 
                        isTeacher={isTeacher}
                        onRead={onRead}
                        onSend={onSend}
                        onResubmit={handleOpenResubmit}
                    />
                ) : (
                    <div className="text-center py-16 text-slate-400 font-medium">
                        Материалы по выбранным параметрам фильтрации не найдены.
                    </div>
                )}
            </div>
            <ModalStudent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                material={selectedMaterial}
            />
            <ModalStudentResubmit
                isOpen={isResubmitModalOpen}
                onClose={() => setIsResubmitModalOpen(false)}
                submission={selectedSubmission}
            />
        </MainLayout>
    );
}
