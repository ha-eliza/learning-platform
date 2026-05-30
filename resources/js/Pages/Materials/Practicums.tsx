import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { ManagementTable } from "@/Components/ManagamentTable";
import { getManualsColumns } from "./config/getManualsColumns";
import { MaterialsProps } from "@/types/materials";
import { filterMaterials } from "@/utils/search";
import { Header } from "@/Components/Header";

export default function Manuals({ practicums }: { practicums: MaterialsProps[] }) {
    const [searchText, setSearchText] = useState("");

    const filteredData = useMemo(
        () => filterMaterials(practicums, searchText),
        [practicums, searchText],
    );

    const actions = {
        onView: (url: string) => router.get(`/materials/${url}`),
        onEdit: (id: number) => router.get(`/materials/${id}/edit`),
        onDelete: (id: number) => router.delete(`/materials/${id}`),
    };

    return (
        <MainLayout>
            <Header />
            <ManagementTable
                title="Практикум"
                columns={getManualsColumns(actions)}
                dataSource={filteredData}
                searchText={searchText}
                onSearchChange={setSearchText}
                onCreateClick={() =>
                    router.get("/materials/create?type=practic")
                }
            />
        </MainLayout>
    );
}
