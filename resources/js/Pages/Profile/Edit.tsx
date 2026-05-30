"use client";

import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Typography, Input, Button, Card, Space, message } from "antd";
import {
    UserOutlined,
    TeamOutlined,
    SaveOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { PageProps } from "@/types";
import { UserProps } from "@/types/user";
import MainLayout from "@/Layouts/MainLayout";

const { Title, Text } = Typography;

export default function EditProfile() {
    const { user } = usePage<PageProps & { user: UserProps }>().props;

    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || "",
        group: user.group || "",
        department: user.department || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        patch(route("profile.update"), {
            onSuccess: () => message.success("Профиль успешно обновлен!"),
            onError: () => message.error("Ошибка при заполнении полей."),
        });
    };

    const isStudent = user.role === "student";

    return (
        <MainLayout>
            <div className="max-w-[600px] mx-auto py-12 px-4">
                <div className="relative pl-6 py-2 border-l-2 border-slate-200/60 hover:border-blue-500 transition-colors duration-300 space-y-8">
                    {/* Шапка формы */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
                            <span className="font-bold text-slate-700">
                                № {String(user.id).padStart(2, "0")}
                            </span>
                            <span className="text-slate-200">|</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold text-[10px]">
                                {isStudent ? "Студент" : "Преподаватель"}
                            </span>
                        </div>

                        <Title
                            level={2}
                            style={{
                                margin: 0,
                                color: "#0f172a",
                                fontWeight: 600,
                            }}
                            className="text-2xl tracking-tight"
                        >
                            Заполнение профиля
                        </Title>
                        <Text className="text-slate-400 text-xs block !mt-2 leading-relaxed">
                            Пожалуйста, укажите ваши реальные данные для
                            корректного отображения в ведомости преподавателя.
                        </Text>
                    </div>

                    {/* Форма без фоновых карточек */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Поле ФИО */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                ФИО
                            </label>
                            <Input
                                size="large"
                                placeholder="Иванов Иван Иванович"
                                prefix={
                                    <UserOutlined className="text-slate-400" />
                                }
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                status={errors.name ? "error" : ""}
                                className="!rounded-xl !h-11 !border-slate-200 focus:!border-blue-500 font-sans text-slate-700"
                            />
                            {errors.name && (
                                <span className="text-xs text-rose-500 font-sans block">
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        {/* Условное поле: Группа или Кафедра */}
                        {isStudent ? (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                    Учебная группа
                                </label>
                                <Input
                                    size="large"
                                    placeholder="ИВТ-11-22"
                                    prefix={
                                        <TeamOutlined className="text-slate-400" />
                                    }
                                    value={data.group}
                                    onChange={(e) =>
                                        setData("group", e.target.value)
                                    }
                                    status={errors.group ? "error" : ""}
                                    className="!rounded-xl !h-11 !border-slate-200 focus:!border-blue-500 font-sans text-slate-700"
                                />
                                {errors.group && (
                                    <span className="text-xs text-rose-500 font-sans block">
                                        {errors.group}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                    Кафедра
                                </label>
                                <Input
                                    size="large"
                                    placeholder="Кафедра веб-технологий"
                                    prefix={
                                        <TeamOutlined className="text-slate-400" />
                                    }
                                    value={data.department}
                                    onChange={(e) =>
                                        setData("department", e.target.value)
                                    }
                                    status={errors.department ? "error" : ""}
                                    className="!rounded-xl !h-11 !border-slate-200 focus:!border-blue-500 font-sans text-slate-700"
                                />
                                {errors.department && (
                                    <span className="text-xs text-rose-500 font-sans block">
                                        {errors.department}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Кнопка в фирменном стиле: Тонкая рамка с эффектом hover-инверсии */}
                        <div className="pt-2">
                            <Button
                                type="text"
                                htmlType="submit"
                                loading={processing}
                                className="w-full border border-slate-200 !rounded-xl text-[11px] font-bold uppercase tracking-wider h-11 px-4 hover:!border-slate-800 hover:!bg-slate-800 hover:!text-white transition-all duration-200 flex items-center justify-center gap-2 bg-white shadow-sm group/btn"
                            >
                                Сохранить данные
                                <ArrowRightOutlined className="text-[10px] text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
