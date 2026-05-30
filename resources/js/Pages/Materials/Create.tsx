"use client";

import React, { useMemo, Suspense } from "react";
import { router, useForm } from "@inertiajs/react";
import {
    Typography,
    Input,
    Select,
    Upload,
    Switch,
    Button,
    message,
} from "antd";
import { FileAddOutlined, ArrowRightOutlined } from "@ant-design/icons";
import type { UploadChangeParam, UploadFile } from "antd/es/upload";
import "easymde/dist/easymde.min.css";
import MainLayout from "@/Layouts/MainLayout";
import { defaultMdeOptions } from "./config/mdeOptions";
import { useMaterialSlug } from "@/hooks/useMaterialSlug";

const { Title } = Typography;
const SimpleMDE = React.lazy(() => import("react-simplemde-editor"));

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        url: "",
        content: "",
        type: "practic",
        category: null as number | null,
        tags: [] as string[],
        pdf: [] as UploadFile[],
        is_published: false,
    });
    const { handleTitleChange } = useMaterialSlug(setData);
    const mdeOptions = useMemo(() => defaultMdeOptions, []);
    const normFile = <T extends UploadFile>(
        e: UploadChangeParam<T> | T[],
    ): T[] => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList || [];
    };
    const handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
        const fileList = normFile(info);
        setData("pdf", fileList);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.title || !data.category) {
            message.error("Пожалуйста, заполните обязательные поля (*)");
            return;
        }
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("url", data.url);
        formData.append("content", data.content);
        formData.append("type", data.type);
        formData.append("category", String(data.category));
        formData.append("is_published", data.is_published ? "1" : "0");
        data.tags.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
        });
        data.pdf.forEach((file) => {
            if (file.originFileObj) {
                formData.append("pdf[]", file.originFileObj as any);
            }
        });
        router.post(route("materials.store"), formData, {
            forceFormData: true,
            onSuccess: () => message.success("Материал успешно опубликован!"),
            onError: (errs) => {
                console.log("Ошибки валидации Laravel:", errs);
                message.error("Проверьте ошибки заполнения формы.");
            },
        });
    };

    return (
        <MainLayout>
            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="relative z-2 pl-6 border-l-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                            Новая публикация
                        </span>
                        <Title
                            level={2}
                            style={{ margin: 0, color: "#0f172a" }}
                            className="text-2xl font-bold tracking-tight"
                        >
                            Создание учебного материала
                        </Title>
                    </div>

                    <Select
                        value={data.type}
                        onChange={(value) => setData("type", value)}
                        className="w-full sm:w-[180px] font-medium"
                        options={[
                            {
                                value: "manual",
                                label: (
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                        Методичка
                                    </span>
                                ),
                            },
                            {
                                value: "practic",
                                label: (
                                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                                        Практикум
                                    </span>
                                ),
                            },
                        ]}
                    />
                </div>

                {/* ОСНОВНОЙ ДВУХКОЛОНОЧНЫЙ ЛЕЙАУТ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* ЛЕВАЯ ЧАСТЬ: КОНТЕНТ (2/3 ШИРИНЫ) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Заголовок */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                Заголовок статьи *
                            </label>
                            <Input
                                size="large"
                                placeholder="Например: Основы синтаксиса и типы данных"
                                value={data.title}
                                onChange={handleTitleChange}
                                status={errors.title ? "error" : ""}
                                className="!rounded-xl !h-11 !border-slate-200 focus:!border-blue-500 font-sans text-slate-700"
                            />
                            {errors.title && (
                                <span className="text-xs text-rose-500 font-sans block">
                                    {errors.title}
                                </span>
                            )}
                        </div>

                        {/* Автоматический URL */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                URL-адрес (генерируется автоматически)
                            </label>
                            <Input
                                size="large"
                                disabled
                                placeholder="Будет сгенерирован автоматически"
                                value={data.url}
                                className="!rounded-xl !h-11 !border-slate-100 !bg-slate-50 font-mono text-xs text-slate-400"
                            />
                        </div>

                        {/* Текстовое содержимое (Markdown) */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                Контент
                            </label>
                            <div className="custom-markdown-editor border border-slate-200 rounded-xl overflow-hidden bg-white">
                                <Suspense
                                    fallback={
                                        <div className="p-8 text-center text-slate-400 font-sans text-sm">
                                            Загрузка Markdown-редактора...
                                        </div>
                                    }
                                >
                                    <SimpleMDE
                                        options={mdeOptions}
                                        value={data.content}
                                        onChange={(value) =>
                                            setData("content", value)
                                        }
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* ПРАВАЯ ЧАСТЬ: СИДБАР КЛАССИФИКАЦИИ И СТАТУСА (1/3 ШИРИНЫ) */}
                    <div className="space-y-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm h-fit overflow-hidden">
                        <div className="space-y-6">
                            <Title
                                level={4}
                                style={{ margin: 0, color: "#0f172a" }}
                                className="text-base font-bold tracking-tight uppercase text-slate-400 mb-2"
                            >
                                Параметры публикации
                            </Title>

                            {/* Раздел */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                    Раздел *
                                </label>
                                <Select
                                    placeholder="Выберите раздел"
                                    value={data.category}
                                    onChange={(value) =>
                                        setData("category", value)
                                    }
                                    status={errors.category ? "error" : ""}
                                    className="w-full [&>.ant-select-selector]:!rounded-xl [&>.ant-select-selector]:!border-slate-200"
                                    options={[
                                        {
                                            value: 1,
                                            label: "ОСНОВЫ WEB-ТЕХНОЛОГИЙ",
                                        },
                                        {
                                            value: 2,
                                            label: "WEB-ДИЗАЙН",
                                        },
                                    ]}
                                />
                                {errors.category && (
                                    <span className="text-xs text-rose-500 font-sans block">
                                        {errors.category}
                                    </span>
                                )}
                            </div>

                            {/* Теги */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                    Теги
                                </label>
                                <Select
                                    mode="tags"
                                    placeholder="Введите теги и нажмите Enter"
                                    value={data.tags}
                                    onChange={(value) => setData("tags", value)}
                                    className="w-full [&>.ant-select-selector]:!rounded-xl [&>.ant-select-selector]:!border-slate-200"
                                    tokenSeparators={[","]}
                                    maxTagCount="responsive"
                                />
                            </div>

                            {/* Загрузка PDF */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                    Прикрепить PDF
                                </label>
                                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white h-fit">
                                    <Upload.Dragger
                                        maxCount={2}
                                        beforeUpload={() => false}
                                        fileList={data.pdf}
                                        onChange={handleUploadChange}
                                        className="hover:!border-blue-500 !bg-white transition-colors group [&.ant-upload-drag]:!border-none"
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <FileAddOutlined
                                                style={{ fontSize: "20px" }}
                                                className="text-slate-400 group-hover:text-blue-500 transition-colors"
                                            />
                                        </p>
                                        <p className="ant-upload-text !text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                                            Выберите файл
                                        </p>
                                    </Upload.Dragger>
                                </div>
                            </div>

                            {/* Статус публикации */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                                <span className="text-slate-600 font-medium text-xs uppercase tracking-wider font-mono">
                                    Опубликовано
                                </span>
                                <div className="flex items-center gap-3">
                                    <Switch
                                        checked={data.is_published}
                                        onChange={(checked) =>
                                            setData("is_published", checked)
                                        }
                                        className="bg-slate-200 aria-checked:bg-blue-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Фирменная кнопка отправки формы */}
                        <div className="pt-2">
                            <Button
                                type="text"
                                htmlType="submit"
                                loading={processing}
                                className="w-full border border-slate-200 !rounded-xl text-[11px] font-bold uppercase tracking-wider h-11 px-4 hover:!border-slate-800 hover:!bg-slate-800 hover:!text-white transition-all duration-200 flex items-center justify-center gap-2 bg-white shadow-sm group/btn"
                            >
                                Создать
                                <ArrowRightOutlined className="text-[10px] text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayout>
    );
}
