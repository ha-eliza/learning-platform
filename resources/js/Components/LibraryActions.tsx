import React from "react";
import { Button } from "antd";
import { ArrowRightOutlined, DownloadOutlined, EyeOutlined, FormOutlined } from "@ant-design/icons";

// Вспомогательный компонент статуса/оценки (тот, что вы прислали)
const StatusBadge = ({ status, grade }: { status: string; grade?: number }) => {
    if (status === "verified") {
        return (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-full flex items-center gap-1 w-fit border border-emerald-100 whitespace-nowrap">
                Сдано • Оценка {grade}
            </span>
        );
    }
    if (status === "rejected") {
        return (
            <span className="text-xs font-semibold text-rose-600 bg-rose-50/80 px-2.5 py-1 rounded-full w-fit block border border-rose-100 whitespace-nowrap">
                На доработке
            </span>
        );
    }
    return (
        <span className="text-xs font-semibold text-amber-600 bg-amber-50/80 px-2.5 py-1 rounded-full w-fit block border border-amber-100 animate-pulse whitespace-nowrap">
            На проверке
        </span>
    );
};

interface LibraryActionsProps {
    item: any;
    submission?: any; // Найденная студенческая работа
    isManual: boolean;
    isTeacher: boolean;
    onRead: (item: any) => void;
    onSend: (item: any) => void;
    onResubmit: (submission: any) => void; // Экшен для доработки
}

export const LibraryActions = ({
    item,
    submission,
    isManual,
    isTeacher,
    onRead,
    onSend,
    onResubmit,
}: LibraryActionsProps) => {

    if (isManual) {
        return (
            <Button
                type="link"
                className="!text-slate-700 hover:!text-blue-600 font-bold uppercase tracking-wider flex items-center gap-2 p-0 h-auto text-xs transition-colors group/btn sm:ml-auto"
                onClick={() => onRead(item)}
            >
                Читать
                <ArrowRightOutlined className="text-[10px] transition-transform group-hover/btn:translate-x-1" />
            </Button>
        );
    }

    return (
        <div className="flex items-center justify-between w-full gap-4">
            <Button
                type="text"
                icon={<EyeOutlined className="text-xs text-slate-400 group-hover:text-slate-600" />}
                className="border border-slate-200 !rounded-xl text-[11px] font-bold uppercase tracking-wider h-10 px-4 hover:!border-slate-800 hover:!bg-slate-800 hover:!text-white transition-all flex items-center gap-2 bg-white shadow-sm"
                onClick={() => onRead(item)}
                target="_blank"
            >
                Задание
            </Button>

            {!isTeacher && (() => {
                // Если работы в базе нет — показываем чистую кнопку "Отправить"
                if (!submission) {
                    return (
                        <Button
                            type="link"
                            className="!text-slate-700 hover:!text-blue-600 font-bold uppercase tracking-wider flex items-center gap-2 p-0 h-auto text-xs transition-colors group/btn"
                            onClick={() => onSend(item)}
                        >
                            Отправить
                            <ArrowRightOutlined className="text-[10px] transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                    );
                }

                // Если работа отклонена (На доработке) — выводим статус и кнопку "Изменить"
                if (submission.status === "rejected") {
                    return (
                        <div className="flex items-center gap-2">
                            <StatusBadge status={submission.status} />
                            <Button
                                type="primary"
                                size="small"
                                className="!bg-orange-500 hover:!bg-orange-600 !rounded-lg text-xs font-semibold h-8 px-3"
                                onClick={() => onResubmit(submission)}
                            >
                                Изменить
                            </Button>
                        </div>
                    );
                }

                // Во всех остальных случаях (verified / pending) выводим ваш StatusBadge
                return <StatusBadge status={submission.status} grade={submission.grade} />;
            })()}
        </div>
    );
};


