import { EnhancedTableConfig } from "@/lib/types/data-table";
import { PendingPromotionDecisionItem } from "@/features/admissions/types/promotion";

export const promotionDecisionsTableConfig: EnhancedTableConfig<PendingPromotionDecisionItem> = {
  columns: [
    {
      key: "student_name",
      label: "Alumno",
      sortable: true,
      searchable: true,
    },
    {
      key: "grade",
      label: "Grado",
      sortable: true,
      searchable: true,
      render: "grade-badge",
    },
    {
      key: "group",
      label: "Grupo",
      sortable: true,
      searchable: true,
      render: "group-badge",
    },
  ],
  itemsPerPage: 25,
  searchable: true,
  sortable: true,
  selectable: true,
};

