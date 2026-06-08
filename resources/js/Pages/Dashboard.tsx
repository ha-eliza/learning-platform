"use client";

import { useMemo, useState } from "react";
import { Typography, Tabs, Badge } from "antd";
import { UserProps } from "@/types/user";
import MainLayout from "@/Layouts/MainLayout";
import { usePage, useForm, router } from "@inertiajs/react";
import { ManagementTable } from "@/Components/ManagamentTable";
import { getFavoritesColumns } from "./Materials/config/getManualsColumns";
import { filterMaterials, filterStudentWorks } from "@/utils/search";
import { HeaderUser } from "@/Components/HeaderUser";
import {
    getStudentSubmissionsColumns,
    getTeacherSubmissionsColumns,
} from "./Materials/config/getSubmissionsColumns";
import { PageProps } from "@/types";
import { ModalTeacher } from "@/Components/ModalTeacher";
import { ModalStudentResubmit } from "@/Components/ModalStudentResubmit";

interface DashboardProps extends PageProps {
    auth: {
        user: UserProps & { email: string };
    };
    studentWorks: any[];
    recentMaterials: any[];
    completedCount: number;
    averageGrade: number;
    pendingReviewCount?: number;
    favoritesCount?: number;
    totalMaterialsCount?: number;
}

export default function Dashboard() {
    const {
        auth,
        studentWorks = [],
        recentMaterials = [],
        completedCount = 0,
        averageGrade = 0,
        pendingReviewCount = 0,
        favoritesCount = 0,
        totalMaterialsCount = 0,
    } = usePage<DashboardProps>().props;
    const user = auth.user;

    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [workSearchText, setWorkSearchText] = useState("");
    const [searchText, setSearchText] = useState("");

    const filteredData = useMemo(() => {
        return filterStudentWorks(studentWorks, workSearchText);
    }, [studentWorks, workSearchText]);

    const filteredDataFav = useMemo(
        () => filterMaterials(recentMaterials, searchText),
        [recentMaterials, searchText],
    );
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [selectedResubmit, setSelectedResubmit] = useState<any>(null);

    const actions = {
        onView: (url: string) => router.get(`/materials/${url}`),
        onDeleteLike: (id: number) => router.post(`/materials/${id}/favorite`),
    };

    const { data, setData, patch, processing } = useForm({
        name: user.name || "",
        group: user.group || "",
        department: user.department || "",
    });

    const isStudent = user.role === "student";

    return (
        <MainLayout>
            <div className="space-y-8">
                <HeaderUser
                    user={auth.user}
                    completedCount={completedCount}
                    pendingReviewCount={pendingReviewCount}
                    averageGrade={averageGrade}
                    favoritesCount={favoritesCount}
                    recentMaterialsLength={recentMaterials.length}
                    totalMaterialsCount={totalMaterialsCount}
                />
                <Tabs
                    defaultActiveKey="1"
                    className="[&_.ant-tabs-nav]:!mb-6 [&_.ant-tabs-tab-btn]:font-semibold [&_.ant-tabs-tab-btn]:text-slate-500 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-blue-600"
                    items={[
                        {
                            key: "1",
                            label: (
                                <span className="flex items-center gap-2 font-bold">
                                    {isStudent
                                        ? "Моя успеваемость"
                                        : "Проверка работ"}
                                    <Badge
                                        count={studentWorks.length}
                                        className="[&_.ant-scroll-number]:!bg-amber-500 [&_.ant-scroll-number]:!text-white [&_.ant-scroll-number]:font-bold text-xs"
                                    />
                                </span>
                            ),
                            children: (
                                <ManagementTable
                                    title={
                                        isStudent
                                            ? "Моя успеваемость"
                                            : "Проверка работ"
                                    }
                                    columns={
                                        isStudent
                                            ? getStudentSubmissionsColumns({
                                                  onResubmit: (record) => {
                                                      setSelectedResubmit(
                                                          record,
                                                      );
                                                      setIsStudentModalOpen(
                                                          true,
                                                      );
                                                  },
                                              })
                                            : getTeacherSubmissionsColumns({
                                                  onEvaluate: (record) => {
                                                      setSelectedSubmission(
                                                          record,
                                                      );
                                                      setIsGradeModalOpen(true);
                                                  },
                                              })
                                    }
                                    dataSource={filteredData}
                                    searchText={workSearchText}
                                    onSearchChange={setWorkSearchText}
                                />
                            ),
                        },

                        {
                            key: "2",
                            label: "Сохраненное",
                            children: (
                                <ManagementTable
                                    title="Избранное"
                                    columns={getFavoritesColumns(actions)}
                                    dataSource={filteredDataFav}
                                    searchText={searchText}
                                    onSearchChange={setSearchText}
                                />
                            ),
                        },
                    ]}
                />
            </div>
            <ModalTeacher
                isOpen={isGradeModalOpen}
                onClose={() => setIsGradeModalOpen(false)}
                submission={selectedSubmission}
            />
            <ModalStudentResubmit
                isOpen={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
                submission={selectedResubmit}
            />
        </MainLayout>
    );
}
