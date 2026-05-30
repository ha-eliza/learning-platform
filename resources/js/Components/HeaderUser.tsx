import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { router } from "@inertiajs/react";
import { Button, Space } from "antd";
import Title from "antd/es/typography/Title";

interface HeaderUserProps {
    user: {
        name?: string;
        role: "student" | "teacher";
        group?: string;
        department?: string;
    };
    completedCount: number;
    pendingReviewCount: number;
    averageGrade: number;
    favoritesCount: number;
    recentMaterialsLength: number;
    totalMaterialsCount: number;
}

export function HeaderUser({
    user,
    completedCount,
    pendingReviewCount,
    averageGrade,
    favoritesCount,
    recentMaterialsLength,
    totalMaterialsCount,
}: HeaderUserProps) {
    const isStudent = user.role === "student";
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                    <UserOutlined className="text-2xl" />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Space size={8} className="flex items-center">
                            <Title
                                level={2}
                                style={{
                                    margin: 0,
                                    color: "#0f172a",
                                }}
                                className="!text-[18px] md:text-2xl font-bold tracking-tight"
                            >
                                {user.name || "Имя не указано"}
                            </Title>
                            <Button
                                type="text"
                                icon={
                                    <EditOutlined className="text-slate-400 hover:text-blue-600" />
                                }
                                onClick={() =>
                                    router.get(route("profile.edit"))
                                }
                                className="flex items-center justify-center"
                            />
                        </Space>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold uppercase text-[10px]">
                            {isStudent ? "Студент" : "Преподаватель"}
                        </span>
                        <span>•</span>
                        <span className="font-sans">
                            {isStudent
                                ? `${user.group || "—"}`
                                : user.department ||
                                  "Кафедра Веб-технологий и Дизайна"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800 font-mono">
                        {isStudent ? completedCount : pendingReviewCount}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isStudent ? "Выполнено" : "На проверку"}
                    </div>
                </div>

                <div className="w-[1px] h-8 bg-slate-200" />

                <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800 font-mono">
                        {isStudent
                            ? averageGrade > 0
                                ? averageGrade.toFixed(1)
                                : "—"
                            : favoritesCount}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isStudent ? "Средний балл" : "Избранное"}
                    </div>
                </div>

                <div className="w-[1px] h-8 bg-slate-200" />

                <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800 font-mono">
                        {isStudent
                            ? recentMaterialsLength
                            : totalMaterialsCount}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isStudent ? "Избранное" : "Всего материалов"}
                    </div>
                </div>
            </div>
        </div>
    );
}
