import { MaterialsProps } from "@/types/materials";
import {
    CheckCircleFilled,
    CheckCircleOutlined,
    CloseCircleFilled,
    DeleteOutlined,
    EditOutlined,
    FileTextOutlined,
    ReadOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";

interface ActionCallbacks {
    onView: (url: string) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onDeleteLike?: (id: number) => void;
}

export const getManualsColumns = ({
    onView,
    onEdit,
    onDelete,
}: ActionCallbacks): ColumnsType<MaterialsProps> => [
    {
        title: "НАЗВАНИЕ",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        dataIndex: "title",
        key: "title",
        width: "25%",
        render: (text: string, record: any) => {
            const titleText = text || record.material_title || "Задание";
            return (
                <div className="flex items-center gap-4 py-1">
                    <div
                        className={
                            "p-2.5 rounded-xl border shrink-0 mt-0.5 bg-blue-50/50 text-blue-500 border-blue-100"
                        }
                    >
                        <FileTextOutlined className="text-base" />
                    </div>
                    <div className="max-w-[180px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[370px] py-1 cursor-default">
                        <h4
                            className="font-bold text-slate-800 text-sm sm:text-base truncate block w-full group-hover:text-blue-600 transition-colors m-0"
                            title={titleText}
                        >
                            {titleText}
                        </h4>
                    </div>
                </div>
            );
        },
    },
    {
        title: "КАТЕГОРИЯ",
        dataIndex: "category",
        className: "hidden md:table-cell",
        key: "category",
        width: "20%",
        render: (_, record: MaterialsProps) => {
            const category = (record as any).category?.name || "-";
            return (
                <span className="text-[12px] font-bold text-[#900007] tracking-wider uppercase">
                    {category}
                </span>
            );
        },
    },
    {
        title: "ТЕГИ",
        dataIndex: "tags",
        key: "tags",
        width: "20%",
        className: "hidden md:table-cell",
        render: (tags: string[]) => (
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                {tags?.map((tag: string) => (
                    <Tag
                        key={tag}
                        className="font-mono bg-[#f7faff] text-[#2563eb]"
                    >
                        {tag}
                    </Tag>
                ))}
            </div>
        ),
    },
    {
        title: "СТАТУС",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        dataIndex: "is_published",
        key: "is_published",
        width: "20%",
        render: (isPublished: boolean) => (
            <span
                className={`p-1 md:px-2 md:py-1 rounded-md text-xs font-medium inline-flex items-center justify-center gap-1 transition-all ${
                    isPublished
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                }`}
                title={isPublished ? "Опубликовано" : "Черновик"}
            >
                {isPublished ? (
                    <>
                        {/* Иконка галочки видна на мобильных, скрывается на десктопе (md:hidden) */}
                        <CheckCircleFilled className="text-sm md:hidden text-green-600" />
                        {/* Текст виден только на больших экранах (hidden md:inline) */}
                        <span className="hidden md:inline">Опубликовано</span>
                    </>
                ) : (
                    <>
                        {/* Иконка крестика видна на мобильных, скрывается на десктопе (md:hidden) */}
                        <CloseCircleFilled className="text-sm md:hidden text-slate-500" />
                        {/* Текст виден только на больших экранах (hidden md:inline) */}
                        <span className="hidden md:inline">Черновик</span>
                    </>
                )}
            </span>
        ),
    },

    {
        title: "УПРАВЛЕНИЕ",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        key: "action",
        align: "right",
        width: "15%",
        render: (_, record) => (
            <Space size="small">
                <Button
                    type="text"
                    icon={<ReadOutlined />}
                    className="text-slate-400 hover:text-blue-600 !rounded-xl flex items-center justify-center text-base"
                    onClick={() => onView(record.url)}
                    title="Читать материал"
                />
                <Button
                    type="text"
                    className="text-slate-400 hover:text-blue-600 !rounded-xl flex items-center justify-center text-base"
                    icon={<EditOutlined />}
                    onClick={() => onEdit?.(record.id)}
                    title="Редактировать материал"
                />
                <Popconfirm
                    title="Удалить этот материал?"
                    onConfirm={() => onDelete?.(record.id)}
                    okText="Да"
                    cancelText="Нет"
                >
                    <Button
                        type="text"
                        danger
                        className="text-slate-400 hover:text-rose-600 !rounded-xl flex items-center justify-center text-base"
                        icon={<DeleteOutlined />}
                    />
                </Popconfirm>
            </Space>
        ),
    },
];

export const getFavoritesColumns = ({
    onView,
    onDeleteLike,
}: ActionCallbacks): ColumnsType<MaterialsProps> => [
    {
        title: "НАЗВАНИЕ",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        dataIndex: "title",
        key: "title",
        className: "p-2 md:p-4 text-xs md:text-sm",
        render: (text: string, record: MaterialsProps) => {
            const isManual = record.type === "manual";
            return (
                <div className="flex items-center gap-2 sm:gap-4 py-0.5 md:py-1">
                    <div
                        className={`hidden sm:flex p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                            isManual
                                ? "bg-blue-50/50 text-blue-500 border-blue-100"
                                : "bg-purple-50/50 text-purple-500 border-purple-100"
                        }`}
                    >
                        {isManual ? (
                            <FileTextOutlined className="text-base" />
                        ) : (
                            <CheckCircleOutlined className="text-base" />
                        )}
                    </div>
                    {/* Ограничение ширины для предотвращения расползания строки */}
                    <div className="max-w-[140px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[370px] py-0.5 cursor-default">
                        <h4
                            className="font-bold text-slate-800 text-xs sm:text-base truncate block w-full group-hover:text-blue-600 transition-colors m-0 leading-tight"
                            title={text}
                        >
                            {text}
                        </h4>
                    </div>
                </div>
            );
        },
    },

    {
        title: "КАТЕГОРИЯ",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        dataIndex: "category",
        key: "category",
        width: "25%",
        className: "p-4",
        render: (category: string) => (
            <span className="text-[8px] md:text-[12px] font-bold text-[#900007] tracking-wider uppercase">
                {category}
            </span>
        ),
    },

    {
        title: "ТЕГИ",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        dataIndex: "tags",
        key: "tags",
        width: "25%",
        className: "hidden md:table-cell p-4",
        render: (tags: string[]) => (
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                {tags?.map((tag: string) => (
                    <Tag
                        key={tag}
                        className="font-mono bg-[#f7faff] text-[#2563eb]"
                    >
                        {tag}
                    </Tag>
                ))}
            </div>
        ),
    },

    {
        title: "УПРАВЛЕНИЕ",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        key: "management",
        className: "w-[20%] p-2 md:p-4 md:w-[20%]",
        align: "right" as const,
        render: (record: MaterialsProps) => (
            <div className="flex items-center justify-end gap-0.5 sm:gap-2">
                <Button
                    type="text"
                    icon={<ReadOutlined />}
                    className="text-slate-400 hover:text-blue-600 !rounded-xl flex items-center justify-center text-sm sm:text-base w-8 h-8 sm:w-10 sm:h-10"
                    onClick={() => onView(record.url)}
                    title="Читать материал"
                />

                <Popconfirm
                    title="Удалить из сохраненок?"
                    onConfirm={() => onDeleteLike?.(record.id)}
                    okText="Да"
                    cancelText="Нет"
                    placement="topRight" // Чтобы окно подтверждения не уезжало за край мобильного экрана
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className="text-slate-400 hover:text-rose-600 !rounded-xl flex items-center justify-center text-sm sm:text-base w-8 h-8 sm:w-10 sm:h-10"
                        title="Удалить из сохраненного"
                    />
                </Popconfirm>
            </div>
        ),
    },
];
