"use client";

import { useMemo } from "react";
import { Select, Button, Radio } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import { MaterialsProps } from "@/types/materials";

interface SortProps {
    items: MaterialsProps[];
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    selectedTeacher: string;
    onTeacherChange: (value: string) => void;
    selectedTags: string[];
    onTagsChange: (value: string[]) => void;
    selectedType: string;
    onTypeChange: (value: string) => void;
    sortOrder: "asc" | "desc";
    onSortOrderChange: () => void;
}

export function Sort({
    items,
    selectedCategory,
    onCategoryChange,
    selectedTeacher,
    onTeacherChange,
    selectedTags,
    onTagsChange,
    selectedType,
    onTypeChange,
    sortOrder,
    onSortOrderChange,
}: SortProps) {
    const categories = useMemo(
        () => ["all", ...Array.from(new Set(items.map((i) => i.category)))],
        [items],
    );
    const teachers = useMemo(
        () => ["all", ...Array.from(new Set(items.map((i) => i.teacher)))],
        [items],
    );
    const allTags = useMemo(
        () => Array.from(new Set(items.flatMap((i) => i.tags))),
        [items],
    );

    return (
        <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shadow-sm ">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Левый блок: Селекторы фильтрации */}
                <div className="flex flex-wrap items-center gap-3 flex-1 sm:min-w-[300px]">
                    {/* Разделы / Категории */}
                    <Select
                        className="w-full sm:w-[220px]"
                        value={selectedCategory}
                        onChange={onCategoryChange}
                        options={categories.map((c) => ({
                            value: c,
                            label: c === "all" ? "Все разделы" : c,
                        }))}
                    />

                    {/* Преподаватели */}
                    <Select
                        className="w-full sm:w-[180px]"
                        value={selectedTeacher}
                        onChange={onTeacherChange}
                        options={teachers.map((t) => ({
                            value: t,
                            label: t === "all" ? "Все преподаватели" : t,
                        }))}
                    />

                    {/* Множественный выбор тегов */}
                    <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        placeholder="Фильтр по тегам"
                        className="w-full sm:w-[220px]"
                        value={selectedTags}
                        onChange={onTagsChange}
                        options={allTags.map((t) => ({ value: t, label: t }))}
                        allowClear
                    />
                </div>

                {/* Правый блок: Выбор типа и Сортировка по ID */}
                <div className="flex items-center gap-4 flex-wrap">
                    <Radio.Group
                        value={selectedType}
                        onChange={(e) => onTypeChange(e.target.value)}
                        optionType="button"
                        buttonStyle="solid"
                        className="w-full sm:w-auto flex [&>.ant-radio-button-wrapper]:flex-1 [&>.ant-radio-button-wrapper]:text-center max-sm:[&_.ant-radio-button-wrapper]:text-xs max-sm:[&_.ant-radio-button-wrapper]:h-7 max-sm:[&_.ant-radio-button-wrapper]:flex max-sm:[&_.ant-radio-button-wrapper]:items-center max-sm:[&_.ant-radio-button-wrapper]:justify-center"
                    >
                        <Radio.Button value="all">Все</Radio.Button>
                        <Radio.Button value="manual">Методички</Radio.Button>
                        <Radio.Button value="practic">Практика</Radio.Button>
                    </Radio.Group>

                    {/* Кнопка изменения направления сортировки */}
                    <Button
                        icon={<ArrowDownOutlined />}
                        onClick={onSortOrderChange}
                        className="flex items-center justify-center gap-1.5 font-medium border-slate-200 text-slate-600 hover:!text-blue-600 hover:!border-blue-500 bg-white w-full sm:w-auto max-sm:text-xs max-sm:h-7"
                    >
                        ID:{" "}
                        {sortOrder === "asc" ? "По возрастанию" : "По убыванию"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
