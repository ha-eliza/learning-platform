import React, { useMemo, Suspense } from "react";
import { useForm, router } from "@inertiajs/react";
import {
    Typography,
    Select,
    Switch,
    Button,
    message,
    Upload,
    Input,
} from "antd";
import { ArrowRightOutlined, FileAddOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import "easymde/dist/easymde.min.css";
import MainLayout from "@/Layouts/MainLayout";
import { defaultMdeOptions } from "./config/mdeOptions";
import { useMaterialSlug } from "@/hooks/useMaterialSlug";

const SimpleMDE = React.lazy(() => import("react-simplemde-editor"));
const { Title } = Typography;

interface CategoryOption {
    id: number;
    name: string;
}

interface MaterialsProps {
    id: number;
    title: string;
    url: string;
    content?: string;
    type: "manual" | "practic";
    category_id: number;
    tags?: string[];
    file_url?: string[];
    is_published: boolean;
}

interface EditProps {
    material: MaterialsProps;
    categories: CategoryOption[];
}

const EditMaterial: React.FC<EditProps> = ({ material, categories }) => {
    const initialFileList: UploadFile[] = useMemo(() => {
        if (!material.file_url) return [];
        return material.file_url.map((url, idx) => ({
            uid: `-${idx}`,
            name: url.split("/").pop() || `file-${idx}.pdf`,
            status: "done",
            url: url,
        }));
    }, [material.file_url]);
    const { data, setData, processing, errors } = useForm({
        title: material.title,
        url: material.url,
        content: material.content || "",
        type: material.type,
        category: material.category_id,
        tags: material.tags || [],
        pdf: initialFileList,
        is_published: material.is_published,
    });
    const { handleTitleChange } = useMaterialSlug(setData);
    const mdeOptions = useMemo(() => defaultMdeOptions, []);
    const handleUploadChange = (info: any) => {
        setData("pdf", info.fileList);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.title || !data.category) {
            message.error("Пожалуйста, заполните обязательные поля (*)");
            return;
        }
        const existingFiles = data.pdf
            .filter((file) => !file.originFileObj && file.url)
            .map((file) => file.url as string);
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("title", data.title);
        formData.append("url", data.url);
        formData.append("content", data.content);
        formData.append("type", data.type);
        formData.append("category", String(data.category));
        formData.append("is_published", data.is_published ? "1" : "0");
        data.tags.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
        });
        if (existingFiles.length > 0) {
            existingFiles.forEach((url, index) => {
                formData.append(`existing_files[${index}]`, url);
            });
        } else {
            formData.append("existing_files", "");
        }
        data.pdf.forEach((file) => {
            if (file.originFileObj instanceof File) {
                formData.append("pdf[]", file.originFileObj);
            }
        });
        router.post(`/materials/${material.id}`, formData, {
            forceFormData: true,
            onSuccess: () => message.success("Материал успешно обновлен!"),
            onError: (errs) => {
                console.log("Ошибки валидации Laravel:", errs);
                message.error("Проверьте ошибки заполнения формы.");
            },
        });
    };

    return (
        <MainLayout>
            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="relative pl-6 border-l-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                            изменение публикации
                        </span>
                        <Title
                            level={2}
                            style={{ margin: 0, color: "#0f172a" }}
                            className="text-2xl font-bold tracking-tight"
                        >
                            Редактирование материала
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* ЛЕВАЯ ЧАСТЬ: КОНТЕНТ */}
                    <div className="lg:col-span-2 space-y-6">
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

                    {/* ПРАВАЯ ЧАСТЬ: СИДБАР (ИСПРАВЛЕНО: убрана полупрозрачность фонового слоя для устранения белых полос) */}
                    <div className="space-y-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm h-fit overflow-hidden">
                        <div className="space-y-6">
                            <Title
                                level={4}
                                style={{ margin: 0, color: "#0f172a" }}
                                className="text-base font-bold tracking-tight uppercase text-slate-400 mb-2"
                            >
                                Параметры публикации
                            </Title>

                            {/* Выбор раздела */}
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
                                    options={categories.map((cat) => ({
                                        value: cat.id,
                                        label: cat.name.toUpperCase(),
                                    }))}
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
                                <Switch
                                    checked={data.is_published}
                                    onChange={(checked) =>
                                        setData("is_published", checked)
                                    }
                                    className="bg-slate-200 aria-checked:bg-blue-600"
                                />
                            </div>
                        </div>

                        {/* Кнопка отправки */}
                        <div className="pt-2">
                            <Button
                                type="text"
                                htmlType="submit"
                                loading={processing}
                                className="w-full border border-slate-200 !rounded-xl text-[11px] font-bold uppercase tracking-wider h-11 px-4 hover:!border-slate-800 hover:!bg-slate-800 hover:!text-white transition-all duration-200 flex items-center justify-center gap-2 bg-white shadow-sm group/btn"
                            >
                                Сохранить изменения
                                <ArrowRightOutlined className="text-[10px] text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayout>
    );
};

export default EditMaterial;
