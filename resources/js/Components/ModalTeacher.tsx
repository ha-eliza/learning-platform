import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button, Input, Modal, Select } from "antd";
import Title from "antd/es/typography/Title";

interface ModalTeacherProps {
    isOpen: boolean;
    onClose: () => void;
    submission: any;
}

export function ModalTeacher({
    isOpen,
    onClose,
    submission,
}: ModalTeacherProps) {
    const {
        data: gradeData,
        setData: setGradeData,
        post: postGrade,
        processing: gradeProcessing,
        reset: resetGrade,
    } = useForm({
        submission_id: null as number | null,
        status: "verified" as "verified" | "rejected",
        grade: 5 as number,
        teacher_comment: "",
    });

    useEffect(() => {
        if (submission) {
            setGradeData("submission_id", submission.id);
        }
    }, [submission]);

    const handleGradeSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        postGrade(route("submissions.grade"), {
            onSuccess: () => {
                onClose();
                resetGrade();
            },
        });
    };

    return (
        <Modal
            title={
                <div className="border-b border-slate-100 pb-3 -mt-2 font-tenor">
                    <Title
                        level={4}
                        style={{ margin: 0, color: "#0f172a" }}
                        className="text-lg font-bold tracking-tight"
                    >
                        Проверка и оценка работы
                    </Title>
                </div>
            }
            open={isOpen}
            onCancel={() => {
                onClose();
                resetGrade();
            }}
            footer={null}
            className="font-tenor"
            width={480}
        >
            {submission && (
                <form onSubmit={handleGradeSubmit} className="space-y-5 pt-4">
                    {/* Инфо-блок о студенте */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1 text-xs">
                        <div>
                            <span className="text-slate-400 font-mono uppercase text-[10px]">
                                Студент:
                            </span>{" "}
                            <strong className="text-slate-700 font-sans">
                                {submission.user?.name}
                            </strong>
                        </div>
                        <div>
                            <span className="text-slate-400 font-mono uppercase text-[10px]">
                                Группа:
                            </span>{" "}
                            <strong className="text-slate-700 font-mono">
                                {submission.user?.group}
                            </strong>
                        </div>
                        <div>
                            <span className="text-slate-400 font-mono uppercase text-[10px]">
                                Задание:
                            </span>{" "}
                            <strong className="text-slate-700 font-sans">
                                {submission.material_title}
                            </strong>
                        </div>
                        {/* Если студент прикрепил файл, выводим ссылку на него */}
                        {submission.file_url && (
                            <div className="mt-2 pt-2 border-t border-slate-200/60">
                                <a
                                    href={submission.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                                >
                                    📎 Скачать/Посмотреть прикрепленный файл
                                </a>
                            </div>
                        )}
                        {submission.comment && (
                            <div className="mt-2 pt-2 border-t border-slate-200/60 text-slate-500 italic font-sans">
                                « {submission.comment} »
                            </div>
                        )}
                    </div>

                    {/* Выбор вердикта */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                            Решение по работе
                        </label>
                        <Select
                            value={gradeData.status}
                            onChange={(value) => setGradeData("status", value)}
                            className="w-full h-11 [&>.ant-select-selector]:!rounded-xl"
                            options={[
                                {
                                    value: "verified",
                                    label: (
                                        <span className="text-sm font-semibold text-emerald-600 font-sans">
                                            Зачесть (Выставить оценку)
                                        </span>
                                    ),
                                },
                                {
                                    value: "rejected",
                                    label: (
                                        <span className="text-sm font-semibold text-rose-600 font-sans">
                                            Вернуть на доработку
                                        </span>
                                    ),
                                },
                            ]}
                        />
                    </div>

                    {/* Выбор оценки */}
                    {gradeData.status === "verified" && (
                        <div className="space-y-1.5 animate-fadeIn">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                Оценка
                            </label>
                            <Select
                                value={gradeData.grade}
                                onChange={(value) =>
                                    setGradeData("grade", value)
                                }
                                className="w-full h-11 [&>.ant-select-selector]:!rounded-xl"
                                options={[
                                    {
                                        value: 5,
                                        label: (
                                            <span className="font-bold text-emerald-600 font-mono">
                                                5 (Отлично)
                                            </span>
                                        ),
                                    },
                                    {
                                        value: 4,
                                        label: (
                                            <span className="font-bold text-blue-600 font-mono">
                                                4 (Хорошо)
                                            </span>
                                        ),
                                    },
                                    {
                                        value: 3,
                                        label: (
                                            <span className="font-bold text-amber-600 font-mono">
                                                3 (Удовлетворительно)
                                            </span>
                                        ),
                                    },
                                    {
                                        value: 2,
                                        label: (
                                            <span className="font-bold text-rose-600 font-mono">
                                                2 (Неудовлетворительно)
                                            </span>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    )}

                    {/* Текстовая рецензия (Дописано) */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                            Замечания / Отзыв
                        </label>
                        <Input.TextArea
                            rows={3}
                            value={gradeData.teacher_comment}
                            onChange={(e) =>
                                setGradeData("teacher_comment", e.target.value)
                            }
                            placeholder="Напишите комментарий к оценке или замечания для доработки..."
                            className="!rounded-xl p-3"
                        />
                    </div>

                    {/* Кнопки отправки (Дописано) */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            onClick={onClose}
                            className="!rounded-xl h-10 font-medium"
                        >
                            Отмена
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={gradeProcessing}
                            className="!rounded-xl h-10 font-bold bg-blue-600"
                        >
                            Сохранить результат
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
