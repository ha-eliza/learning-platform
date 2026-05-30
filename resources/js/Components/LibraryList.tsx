"use client";

import React from "react";
import { Typography, Button } from "antd";
import {
    ArrowRightOutlined,
    DownloadOutlined,
    BookOutlined,
    ExperimentOutlined,
} from "@ant-design/icons";
import { MaterialsProps } from "@/types/materials";
import { usePage } from "@inertiajs/react";
import { LibraryActions } from "./LibraryActions";
import { SubmissionProps } from "@/types/submission";

const { Title } = Typography;

interface LibraryListProps {
    books: MaterialsProps[];
    studentWorks: SubmissionProps[]; 
    isTeacher: boolean;
    onRead: (item: MaterialsProps) => void;
    onSend: (item: MaterialsProps) => void;
    onResubmit: (submission: SubmissionProps) => void;
}

export function LibraryList({
    books = [],
    studentWorks = [],
    isTeacher,
    onSend,
    onRead,
    onResubmit,
}: LibraryListProps) {
    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col">
                {books.map((item) => {
                    const isManual = item.type === "manual";
                    const dateObject =
                        item.date instanceof Date
                            ? item.date
                            : new Date(item.date);
                    const formattedDate = dateObject.toLocaleDateString(
                        "ru-RU",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        },
                    );
                    const currentSubmission = studentWorks.find(
                        (work) => work.material_id === item.id,
                    );
                    return (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between py-6 px-2 border-b border-slate-200/60 hover:bg-slate-100/40 rounded-xl transition-all duration-200 group gap-4"
                        >
                            {/* Левая часть: Иконка типа материала + Мета-данные + Заголовок */}
                            <div className="flex items-start gap-5 flex-1">
                                <div
                                    className={`p-2.5 rounded-xl transition-colors mt-0.5 flex items-center justify-center border ${
                                        isManual
                                            ? "bg-white text-slate-400 border-slate-200 group-hover:text-blue-500 group-hover:border-blue-200 shadow-sm"
                                            : "bg-white text-slate-400 border-slate-200 group-hover:text-purple-500 group-hover:border-purple-200 shadow-sm"
                                    }`}
                                >
                                    {isManual ? (
                                        <BookOutlined className="text-lg" />
                                    ) : (
                                        <ExperimentOutlined className="text-lg" />
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap">
                                        <span className="font-bold text-slate-700">
                                            {String(item.id).padStart(2, "0")}
                                        </span>
                                        <span className="text-slate-300">
                                            |
                                        </span>
                                        <span>{formattedDate}</span>
                                        <span className="text-slate-300">
                                            |
                                        </span>
                                        <span className="uppercase text-[#900007] font-bold tracking-wider text-[11px] ml-1">
                                            {item.category}
                                        </span>
                                    </div>
                                    <Title
                                        level={3}
                                        style={{
                                            margin: 0,
                                            color: "#0f172a",
                                            fontWeight: 600,
                                        }}
                                        className="text-lg md:text-xl tracking-tight group-hover:text-blue-600 transition-colors"
                                    >
                                        {item.title}
                                    </Title>
                                </div>
                            </div>

                            <div className="flex items-center justify-start sm:justify-end min-w-[240px] gap-3 sm:ml-4">
                                <LibraryActions
                                    item={item}
                                    submission={currentSubmission}
                                    isManual={isManual}
                                    isTeacher={isTeacher}
                                    onRead={onRead}
                                    onSend={onSend}
                                    onResubmit={onResubmit}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
