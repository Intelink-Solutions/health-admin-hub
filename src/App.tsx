import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import PublicLayout from "@/components/layout/PublicLayout";
// Admin Pages
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import Staff from "./pages/Staff";
import Pharmacy from "./pages/Pharmacy";
import Prescriptions from "./pages/Prescriptions";
import Admissions from "./pages/Admissions";
import EHR from "./pages/EHR";
import Wards from "./pages/Wards";
import Dispensing from "./pages/Dispensing";
import PharmacySales from "./pages/PharmacySales";
import Laboratory from "./pages/Laboratory";
import Radiology from "./pages/Radiology";
import Payments from "./pages/Payments";
import FinancialReports from "./pages/FinancialReports";
import NurseAssignments from "./pages/NurseAssignments";
import ConsultationQueue from "./pages/ConsultationQueue";
import DoctorOrders from "./pages/DoctorOrders";
import VitalsMonitoring from "./pages/VitalsMonitoring";
import Roles from "./pages/Roles";
import Scheduling from "./pages/Scheduling";
import ActivityLogs from "./pages/ActivityLogs";
import VirtualConsultations from "./pages/VirtualConsultations";
import HomeVisits from "./pages/HomeVisits";
import Bookings from "./pages/Bookings";
import Services from "./pages/Services";
import Analytics from "./pages/Analytics";
import ClinicalReports from "./pages/ClinicalReports";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
// Public Pages
import { HomePage } from "./public/pages/HomePage";
import { LoginPage } from "./public/pages/LoginPage";
import { RegisterPage } from "./public/pages/RegisterPage";
import { ForgotPasswordPage } from "./public/pages/ForgotPasswordPage";
import { DoctorsPage } from "./public/pages/DoctorsPage";
import { HospitalsPage } from "./public/pages/HospitalsPage";
import { TelemedicineConsultationPage } from "./public/pages/TelemedicineConsultationPage";
import { PatientDashboardPage } from "./public/pages/PatientDashboardPage";
import { EcommerceServicesPage } from "./public/pages/EcommerceServicesPage";
import { ProviderDashboardPage } from "./public/pages/ProviderDashboardPage";
import { ChatPage } from "./public/pages/ChatPage";
import { ProviderServicesFormPage } from "./public/pages/ProviderServicesFormPage";
import { ProviderSettingsPage } from "./public/pages/ProviderSettingsPage";
import { UserSettingsPage } from "./public/pages/UserSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Pages with Mobile Navigation */}
              <Route path="/home" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
              <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
              <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />
              <Route path="/discover/doctors" element={<PublicLayout><DoctorsPage /></PublicLayout>} />
              <Route path="/discover/hospitals" element={<PublicLayout><HospitalsPage /></PublicLayout>} />
              <Route path="/telemedicine/consultation" element={<PublicLayout><TelemedicineConsultationPage /></PublicLayout>} />
              <Route path="/user/dashboard" element={<PublicLayout><PatientDashboardPage /></PublicLayout>} />
              <Route path="/marketplace/services" element={<PublicLayout><EcommerceServicesPage /></PublicLayout>} />
              <Route path="/provider/dashboard" element={<PublicLayout><ProviderDashboardPage /></PublicLayout>} />
              <Route path="/chat" element={<PublicLayout><ChatPage /></PublicLayout>} />
              <Route path="/provider/services" element={<PublicLayout><ProviderServicesFormPage /></PublicLayout>} />
              <Route path="/provider/settings" element={<PublicLayout><ProviderSettingsPage /></PublicLayout>} />
              <Route path="/user/settings" element={<PublicLayout><UserSettingsPage /></PublicLayout>} />

          {/* Admin Pages */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/admin/dashboard" element={<Index />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/finance/billing" element={<Billing />} />
          <Route path="/admin/staff" element={<Staff />} />
          <Route path="/pharmacy/inventory" element={<Pharmacy />} />
          <Route path="/pharmacy/prescriptions" element={<Prescriptions />} />
          <Route path="/hospital/admissions" element={<Admissions />} />
          <Route path="/hospital/ehr" element={<EHR />} />
          <Route path="/hospital/wards" element={<Wards />} />
          <Route path="/pharmacy/dispensing" element={<Dispensing />} />
          <Route path="/pharmacy/sales" element={<PharmacySales />} />
          <Route path="/laboratory/tests" element={<Laboratory />} />
          <Route path="/laboratory/radiology" element={<Radiology />} />
          <Route path="/finance/payments" element={<Payments />} />
          <Route path="/finance/reports" element={<FinancialReports />} />
          <Route path="/nursing/assignments" element={<NurseAssignments />} />
          <Route path="/nursing/queue" element={<ConsultationQueue />} />
          <Route path="/nursing/orders" element={<DoctorOrders />} />
          <Route path="/nursing/vitals" element={<VitalsMonitoring />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/scheduling" element={<Scheduling />} />
          <Route path="/admin/logs" element={<ActivityLogs />} />
          <Route path="/telemedicine/consultations" element={<VirtualConsultations />} />
          <Route path="/telemedicine/home-visits" element={<HomeVisits />} />
          <Route path="/ecommerce/bookings" element={<Bookings />} />
          <Route path="/ecommerce/services" element={<Services />} />
          <Route path="/analytics/dashboard" element={<Analytics />} />
          <Route path="/analytics/clinical-reports" element={<ClinicalReports />} />
          <Route path="/security" element={<Security />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
