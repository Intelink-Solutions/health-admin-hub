import { AdminLayout } from "@/components/layout/AdminLayout";
import { PrescriptionsPage } from "@/components/pharmacy/PrescriptionsPage";

export default function Prescriptions() {
  return (
    <AdminLayout>
      <PrescriptionsPage />
    </AdminLayout>
  );
}
