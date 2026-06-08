import { Button, Popover } from "antd";
import { ColumnsType } from "antd/es/table";
import { ReadOutlined, CommentOutlined } from "@ant-design/icons";
import { router } from "@inertiajs/react";
import { formatShortName } from "@/utils/format";

const renderDate = (createdAt: string) => {
    return createdAt ? new Date(createdAt).toLocaleDateString("ru-RU") : "—";
};
interface StudentActions {
    onResubmit: (record: any) => void;
}
const StatusBadge = ({
    status,
    grade,
    comment,
}: {
    status: string;
    grade?: number;
    comment?: string;
}) => {
    if (status === "verified") {
        return (
            <span
                className="text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50/80 p-1 sm:px-2.5 sm:py-1 rounded-full flex items-center justify-center gap-1 w-7 h-7 sm:w-auto sm:h-auto border border-emerald-100 font-sans"
                title={`Сдано • Оценка ${grade}`}
            >
                <span className="sm:hidden text-[10px]">{grade}</span>
                <span className="hidden sm:inline">Сдано • Оценка {grade}</span>
            </span>
        );
    }
    if (status === "rejected") {
        return (
            <span
                className="text-[11px] sm:text-xs font-semibold text-rose-600 bg-rose-50/80 p-1 sm:px-2.5 sm:py-1 rounded-full w-7 h-7 sm:w-auto sm:h-auto flex items-center justify-center border border-rose-100 font-sans"
                title={comment || "На доработке"}
            >
                {/* На мобилках выводим крестик/символ доработки */}
                <span className="sm:hidden text-[8px]">❌</span>
                <span className="hidden sm:inline">На доработке</span>
            </span>
        );
    }
    return (
        <span
            className="text-[11px] sm:text-xs font-semibold text-amber-600 bg-amber-50/80 p-1 sm:px-2.5 sm:py-1 rounded-full w-7 h-7 sm:w-auto sm:h-auto flex items-center justify-center border border-amber-100 animate-pulse font-sans"
            title="На проверке"
        >
            {/* На мобилках выводим часы ожидания */}
            <span className="sm:hidden text-xs">⏳</span>
            <span className="hidden sm:inline">На проверке</span>
        </span>
    );
};

export const getStudentSubmissionsColumns = ({
    onResubmit,
}: StudentActions): ColumnsType<any> => [
    {
        title: "ПРАКТИЧЕСКАЯ РАБОТА",
        onHeaderCell: () => ({
            className:
                "!text-[10px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        dataIndex: ["material", "title"],
        key: "title",
        width: "35%",
        render: (text: string, record: any) => (
            <div className="max-w-[125px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[370px] py-1 cursor-default">
                <h4
                    className="font-bold text-slate-800 text-[12px] sm:text-base truncate block w-full group-hover:text-blue-600 transition-colors m-0"
                    title={text || record.material_title || "Задание"}
                >
                    {text || record.material_title || "Задание"}
                </h4>
                <div className="text-[8px] font-mono text-slate-400">
                    Отправлено: {renderDate(record.created_at)}
                </div>
            </div>
        ),
    },
    {
        title: "ПРЕПОДАВАТЕЛЬ",
        onHeaderCell: () => ({
            className:
                "!text-[10px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        key: "teacher",
        width: "25%",
        className: "hidden sm:table-cell",
        render: (record: any) => (
            <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-700">
                    {formatShortName(record.material?.teacher || "-")}
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {record.material?.department || "—"}
                </div>
            </div>
        ),
    },
    {
        title: "СТАТУС",
        onHeaderCell: () => ({
            className:
                "!text-[10px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        dataIndex: "status",
        key: "status",
        width: "20%",
        render: (status: string, record: any) => (
            <StatusBadge
                status={status}
                grade={record.grade}
                comment={record.comment}
            />
        ),
    },
    {
        title: "УПРАВЛЕНИЕ",
        onHeaderCell: () => ({
            className:
                "!text-[10px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        key: "management",
        width: "20%",
        align: "right",
        render: (record: any) => {
            const isRecordRejected = record.status === "rejected";

            return (
                <div className="flex items-center justify-end flex-wrap md:flex-nowrap gap-1 md:gap-2">
                    <Button
                        type="text"
                        icon={<ReadOutlined />}
                        className="text-slate-400 hover:text-blue-600 !rounded-xl flex items-center justify-center"
                        onClick={() =>
                            router.get(`/materials/${record.material?.url}`)
                        }
                        title="Читать задание"
                    />
                    {record.teacher_comment && (
                        <Popover
                            title={
                                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                                    Замечания
                                </span>
                            }
                            content={
                                <div className="max-w-[300px] text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                                    {record.teacher_comment}
                                </div>
                            }
                            trigger="click"
                            placement="left"
                        >
                            <Button
                                type="text"
                                className="text-amber-500 hover:text-amber-600 !rounded-xl flex items-center justify-center"
                                icon={<CommentOutlined />}
                                title="Посмотреть замечания"
                            />
                        </Popover>
                    )}
                    {isRecordRejected && (
                        <>
                            {/* НОВАЯ КНОПКА: Исправить работу */}
                            <Button
                                type="primary"
                                size="small"
                                className="!bg-orange-500 hover:!bg-orange-600 !rounded-lg text-xs font-semibold px-3"
                                onClick={() => onResubmit(record)}
                                title="Исправить и отправить заново"
                            >
                                Исправить
                            </Button>
                        </>
                    )}
                </div>
            );
        },
    },
];

// ==========================================
// 2. КОЛОНКИ ДЛЯ ПРЕПОДАВАТЕЛЯ (Проверка работ)
// ==========================================
interface TeacherActions {
    onEvaluate: (record: any) => void;
}

export const getTeacherSubmissionsColumns = ({
    onEvaluate,
}: TeacherActions): ColumnsType<any> => [
    {
        title: "ПРАКТИЧЕСКАЯ РАБОТА",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        dataIndex: ["material", "title"],
        key: "title",
        width: "35%",
        render: (text: string, record: any) => (
            <div className="max-w-[125px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[370px] py-0.5 cursor-default">
                <h4
                    className="font-bold text-slate-800 text-xs sm:text-base truncate block w-full group-hover:text-blue-600 transition-colors m-0 leading-tight"
                    title={record.material_title}
                >
                    {text || record.material_title || "Задание"}
                </h4>
                <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-0.5">
                    Отправлено: {renderDate(record.created_at)}
                </div>
            </div>
        ),
    },
    {
        title: "СТУДЕНТ / ГРУППА",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        key: "student_info",
        width: "25%",
        className: "hidden sm:table-cell",
        render: (record: any) => (
            <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-700">
                    {formatShortName(record.user?.name || "Студент")}
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {record.user?.group || "—"}
                </div>
            </div>
        ),
    },
    {
        title: "СТАТУС",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        dataIndex: "status",
        key: "status",
        width: "20%",
        render: (status: string, record: any) => (
            <StatusBadge
                status={status}
                grade={record.grade}
                comment={record.comment}
            />
        ),
    },
    {
        title: "УПРАВЛЕНИЕ",
        onHeaderCell: () => ({
            className:
                "!text-[11px] md:!text-sm font-bold text-slate-500 tracking-wider p-2 md:p-4",
        }),
        key: "management",
        width: "20%",
        align: "right",
        render: (record: any) => (
            <div className="flex items-center justify-end gap-1 md:gap-2 flex-wrap md:flex-nowrap">
                <Button
                    type="text"
                    icon={<ReadOutlined />}
                    className="text-slate-400 hover:text-blue-600 !rounded-xl flex items-center justify-center"
                    onClick={() =>
                        router.get(`/materials/${record.material?.url}`)
                    }
                    title="Читать задание"
                />
                {record.status === "pending" ? (
                    <Button
                        type="primary"
                        size="small"
                        className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg text-xs font-semibold font-sans h-8"
                        onClick={() => onEvaluate?.(record)}
                    >
                        Оценить
                    </Button>
                ) : record.status === "rejected" ? (
                    <span className="text-xs text-slate-400 italic pr-2">
                        Ожидает исправления
                    </span>
                ) : null}
            </div>
        ),
    },
];
