import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button, Input, Modal } from "antd";
import Title from "antd/es/typography/Title";
import Upload, { UploadChangeParam } from "antd/es/upload";
import { FileAddOutlined } from "@ant-design/icons";
import ErrorList from "antd/es/form/ErrorList";

interface SubmissionProps {
    id: number;
    comment: string;
    teacher_comment: string | null;
    file_url: string | null;
}

interface ModalStudentResubmitProps {
    isOpen: boolean;
    onClose: () => void;
    submission: SubmissionProps | null;
}

export function ModalStudentResubmit({
    isOpen,
    onClose,
    submission,
}: ModalStudentResubmitProps) {
    const { data, setData, post, processing, reset } = useForm({
        submission_id: null as number | null,
        comment: "",
        file: null as File | null,
        _method: "PUT",
    });

    useEffect(() => {
        if (submission) {
            setData((prevData) => ({
                ...prevData,
                submission_id: submission.id,
                comment: submission.comment || "",
            }));
        }
    }, [submission]);

    const handleFileChange = (info: UploadChangeParam) => {
        if (info.fileList.length > 0) {
            const originFileObj = info.fileList[0].originFileObj;
            if (originFileObj) {
                setData("file", originFileObj);
            }
        } else {
            setData("file", null);
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/submissions/${submission?.id}`, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal
            title={
                <div className="border-b border-slate-100 pb-3 -mt-2">
                    <Title
                        level={4}
                        style={{ margin: 0 }}
                        className="text-lg font-bold text-slate-800"
                    >
                        Доработка практической работы
                    </Title>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={480}
        >
            {submission && (
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-xs text-amber-800">
                        <strong className="block mb-1">
                            Замечание преподавателя:
                        </strong>
                        <p className="italic font-sans">
                            « {submission.teacher_comment || "Нет комментария"}{" "}
                            »
                        </p>
                    </div>

                    <div className="space-y-1.5 w-full">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                Файл решения (ZIP, PDF)
                            </label>
                            <Upload.Dragger
                                maxCount={1}
                                beforeUpload={() => false}
                                onChange={handleFileChange}
                                className="!border-slate-200 hover:!border-blue-500 !bg-white rounded-xl p-5 transition-colors group"
                            >
                                <p className="ant-upload-drag-icon !mb-2">
                                    <FileAddOutlined
                                        style={{ fontSize: "20px" }}
                                        className="text-slate-400 group-hover:text-blue-500 transition-colors"
                                    />
                                </p>
                                <p className="ant-upload-text !text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                                    Перетащите архив или выберите файл
                                </p>
                            </Upload.Dragger>
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide font-mono mb-2">
                                Комментарий
                            </label>
                            <Input.TextArea
                                rows={4}
                                value={data.comment}
                                onChange={(e) =>
                                    setData("comment", e.target.value)
                                }
                                placeholder="Внесите исправления или добавьте обновленную ссылку на работу..."
                                className="!rounded-xl p-3 w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button onClick={onClose} className="!rounded-xl h-10">
                            Отмена
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={processing}
                            className="!rounded-xl h-10 bg-orange-500 border-none font-bold"
                        >
                            Отправить заново
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
