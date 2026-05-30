"use client";

import React, { useEffect, useMemo } from "react";
import { Typography, Button, Space, Tag } from "antd";
import {
    DownloadOutlined,
    UserOutlined,
    LeftOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { marked } from "marked";
import { router } from "@inertiajs/react";
import { MaterialsProps } from "@/types/materials";
import { markedHighlight } from "marked-highlight";
import { ButtonSave } from "@/Components/TableSave";
import { formatShortName } from "@/utils/format";

const { Title, Paragraph } = Typography;

interface ShowProps {
    material: MaterialsProps;
}
marked.use(
    markedHighlight({
        highlight(code, lang) {
            return code;
        },
    }),
);

const renderer = new marked.Renderer();
renderer.code = function ({ text, lang }) {
    const escapedText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const langClass = lang ? `language-${lang}` : "language-plaintext";
    return `<pre class="${langClass}"><code class="${langClass}">${escapedText}</code></pre>`;
};
marked.use({ renderer });
export default function Show({ material }: ShowProps) {
    const isManual = material.type === "manual";
    useEffect(() => {
        const timer = setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).Prism) {
                (window as any).Prism.highlightAll();
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [material.content]);

    const rawHtml = useMemo(() => {
        return { __html: marked.parse(material.content || "") };
    }, [material.content]);

    return (
        <div className="my-2 mx-5">
            <header className="flex justify-between items-center">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-[11px] font-bold uppercase tracking-wider transition-colors group"
                >
                    <LeftOutlined className="text-[9px] transition-transform group-hover:-translate-x-0.5" />
                    К списку
                </button>
                <div className="flex items-center gap-5 text-slate-400">
                    <ButtonSave
                        materialId={material.id}
                        initialIsFavorite={(material as any).is_favorite}
                    />

                    <button
                        onClick={() => {
                            // Вызывает наш умный роут (скачает файл или автоматически созданный ZIP)
                            window.location.href = `/materials/${material.id}/download-files`;
                        }}
                        className="hover:text-slate-700 transition-colors flex items-center justify-center p-1"
                        title="Скачать файлы"
                    >
                        <DownloadOutlined style={{ fontSize: "18px" }} />
                    </button>

                    {/* Разделительная тонкая серая полоса */}
                    <div className="w-[1px] h-4 bg-slate-200" />

                    {/* Ссылка-иконка перехода в Личный Кабинет */}
                    <button
                        onClick={() => router.get("/dashboard")}
                        className="hover:text-slate-700 transition-colors flex items-center justify-center p-1"
                        title="Личный кабинет"
                    >
                        <UserOutlined style={{ fontSize: "18px" }} />
                    </button>
                </div>
            </header>
            <main className="max-w-[768px] w-full mx-auto my-20">
                <div className="space-y-4 border-b border-slate-200/60 pb-6 font-tenor">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                                isManual
                                    ? "bg-blue-50/60 text-blue-600 border-blue-100"
                                    : "bg-purple-50/60 text-purple-600 border-purple-100"
                            }`}
                        >
                            {isManual ? "Методичка" : "Практика"}
                        </span>

                        {/* Разделительная черта перед категорией */}
                        <span className="text-slate-200 text-xs font-mono">
                            |
                        </span>
                        <div className="text-[11px] font-bold text-[#900007] tracking-wider uppercase">
                            {material.category}
                        </div>
                        {material.tags && material.tags.length > 0 && (
                            <span className="text-slate-200 text-xs font-mono">
                                |
                            </span>
                        )}
                        <div className="flex flex-wrap items-center gap-3">
                            {material.tags && material.tags.length > 0 ? (
                                material.tags.map((tag, index) => (
                                    <React.Fragment key={tag}>
                                        <span className="text-[11px] font-mono font-medium text-slate-400 hover:text-blue-600 transition-colors cursor-pointer border-b border-slate-200 hover:border-blue-400 pb-0.5">
                                            #{tag}
                                        </span>
                                        {index < (material.tags?.length ?? 0) - 1 && (
                                            <span className="text-slate-200 text-[10px] font-mono select-none">
                                                /
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <span className="text-xs text-slate-300 italic">
                                    Без тегов
                                </span>
                            )}
                        </div>
                    </div>

                    {/* СТИЛЬ ЗАГОЛОВКА 2: Плотный, полужирный контрастный заголовок */}
                    <Title
                        level={1}
                        style={{ margin: 0, color: "#1e293b", fontWeight: 600 }}
                        className="text-2xl md:text-3xl tracking-tight leading-tight uppercase font-semibold"
                    >
                        {material.title}
                    </Title>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                        <Space size={6}>
                            <UserOutlined className="text-slate-300" />
                            <span className="text-slate-600 font-sans font-medium">
                                {formatShortName(material.teacher)}
                            </span>
                        </Space>
                        <span className="text-slate-200">|</span>
                        <Space size={6}>
                            <CalendarOutlined className="text-slate-300" />
                            <span>
                                {new Date(material.date).toLocaleDateString(
                                    "ru-RU",
                                )}
                            </span>
                        </Space>
                    </div>
                </div>

                <div>
                    <div className="prose prose-slate my-[48px] max-w-none font-sans text-slate-750 leading-relaxed text-base">
                        {material.content ? (
                            <div
                                dangerouslySetInnerHTML={rawHtml}
                                className="space-y-4 markdown-body"
                            />
                        ) : (
                            <Paragraph className="text-slate-400 italic">
                                Текстовое содержимое отсутствует.
                            </Paragraph>
                        )}
                    </div>
                    {/* Блок прикрепленных файлов для скачивания внизу */}
                    {material.fileUrl && material.fileUrl.length > 0 && (
                        <div className="pt-6 border-t border-slate-100 space-y-3">
                            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                Сопутствующие материалы
                            </h5>
                            <div className="flex flex-wrap gap-3">
                                {material.fileUrl.map((url, idx) => (
                                    <Button
                                        key={idx}
                                        type="text"
                                        icon={
                                            <DownloadOutlined className="text-xs text-slate-400 group-hover:text-slate-600" />
                                        }
                                        className="border border-slate-200 !rounded-xl text-[11px] font-bold uppercase tracking-wider h-10 px-4 hover:!border-slate-800 hover:!bg-slate-800 hover:!text-white transition-all flex items-center gap-2 bg-white shadow-sm group"
                                        href={url}
                                        target="_blank"
                                    >
                                        Скачать приложение{" "}
                                        {url.length > 1 ? `№${idx + 1}` : ""}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
