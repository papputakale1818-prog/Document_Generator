
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider, useAuth } from './context/AuthContext'
// import LoginPage from './pages/LoginPage'
// import ForgotPassword from './pages/ForgotPassword'
// import CompaniesPage from './pages/CompaniesPage'
// import DashboardPage from './pages/DashboardPage'
// import UsersPage from './pages/UsersPage'
// import AdminPage from './pages/AdminPage'
// import ExperienceLetterPage_SoftGrid from './pages/ExperienceLetter_SoftGrid'
// import ExperienceLetterPage_UASIT    from './pages/ExperienceLetter_UASIT'
// import ResignationAcceptance_SoftGrid from './pages/ResignationAcceptance_SoftGrid'
// import MyDocuments from './pages/MyDocuments'
// import AddEmployee from './pages/AddEmployee'

// // ── Company-wise Offer Letter pages ──────────────────────────────────────
// import OfferLetterPage_SoftGrid      from './pages/OfferLetterPage_SoftGrid'
// import OfferLetterPage_UASIT         from './pages/OfferLetterPage_UASIT'

// // ── Company-wise Offer Confirmation pages ────────────────────────────────
// import OfferConfirmationPage_SoftGrid    from './pages/OfferConfirmationPage_SoftGrid'
// import OfferConfirmationPage_UASIT       from './pages/OfferConfirmationPage_UASIT'

// // ── Company-wise Pay Slip pages ──────────────────────────────────────────
// import PaySlipPage_SoftGrid     from './pages/PaySlip_SoftGrid'
// import PaySlipPage_UASIT        from './pages/PaySlip_UASIT'

// // ── Company-wise Salary Appraisal pages ─────────────────────────────────
// import AppraisalLetter_SoftGrid     from './pages/AppraisalLetter_softgrid'
// import AppraisalLetter_UASIT        from './pages/appraisalLetter_uasit'

// // ── Company-wise Relieving Letter pages ──────────────────────────────────
// import RelievingLetter_SoftGrid     from './pages/RelievingLetter_SoftGrid'
// import RelievingLetter_UASIT        from './pages/RelievingLetter_UASIT'

// // ── Switcher — Offer Letter ───────────────────────────────────────────────
// function OfferLetterPage() {
//   const { selectedCompany } = useAuth()
//   switch (selectedCompany?.id) {
//     case 1:  return <OfferLetterPage_SoftGrid />
//     case 2:  return <OfferLetterPage_UASIT />
//     default: return <OfferLetterPage_SoftGrid />
//   }
// }

// // ── Switcher — Offer Confirmation ────────────────────────────────────────
// function OfferConfirmationPage() {
//   const { selectedCompany } = useAuth()
//   switch (selectedCompany?.id) {
//     case 1:  return <OfferConfirmationPage_SoftGrid />
//     case 2:  return <OfferConfirmationPage_UASIT />
//     default: return <OfferConfirmationPage_SoftGrid />
//   }
// }

// // ── Switcher — Pay Slip ───────────────────────────────────────────────────
// function PaySlipPage() {
//   const { selectedCompany } = useAuth()
//   switch (selectedCompany?.id) {
//     case 1:  return <PaySlipPage_SoftGrid />
//     case 2:  return <PaySlipPage_UASIT />
//     default: return <PaySlipPage_SoftGrid />
//   }
// }

// // ── Switcher — Salary Appraisal ───────────────────────────────────────────
// function AppraisalPage() {
//   const { selectedCompany } = useAuth()
//   switch (selectedCompany?.id) {
//     case 1:  return <AppraisalLetter_SoftGrid />
//     case 2:  return <AppraisalLetter_UASIT />
//     default: return <AppraisalLetter_SoftGrid />
//   }
// }

// // ── Switcher — Relieving Letter ───────────────────────────────────────────
// function RelievingLetterPage() {
//   const { selectedCompany } = useAuth()
//   switch (selectedCompany?.id) {
//     case 1:  return <RelievingLetter_SoftGrid />
//     case 2:  return <RelievingLetter_UASIT />
//     default: return <RelievingLetter_SoftGrid />
//   }
// }

// // ── Switcher — Experience Letter ──────────────────────────────────────────
// function ExperienceLetterPage() {
//   const { selectedCompany } = useAuth()
//   switch (selectedCompany?.id) {
//     case 1:  return <ExperienceLetterPage_SoftGrid />
//     case 2:  return <ExperienceLetterPage_UASIT />
//     default: return <ExperienceLetterPage_SoftGrid />
//   }
// }

// // ── 🔐 Protected Route ────────────────────────────────────────────────────
// function ProtectedRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/login" replace />
// }

// // ── 🔑 Admin Route ────────────────────────────────────────────────────────
// function AdminRoute({ children }) {
//   const { user } = useAuth()
//   if (!user) return <Navigate to="/login" replace />
//   if (user.role !== 'admin') return <Navigate to="/companies" replace />
//   return children
// }

// // ── 🏢 Company Route ──────────────────────────────────────────────────────
// function CompanyRoute({ children }) {
//   const { user, selectedCompany } = useAuth()
//   if (!user) return <Navigate to="/login" replace />
//   if (!selectedCompany) return <Navigate to="/companies" replace />
//   return children
// }

// // ── 🚫 Public Route ───────────────────────────────────────────────────────
// function PublicRoute({ children }) {
//   const { user } = useAuth()
//   return user ? <Navigate to="/companies" replace /> : children
// }

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Default */}
//       <Route path="/" element={<Navigate to="/login" replace />} />

//       {/* Public */}
//       <Route path="/login"           element={<PublicRoute><LoginPage /></PublicRoute>} />
//       <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
//       <Route path="/reset-password"  element={<ForgotPassword />} />

//       {/* Protected */}
//       <Route path="/companies"    element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
//       <Route path="/users"        element={<AdminRoute><UsersPage /></AdminRoute>} />
//       <Route path="/my-documents" element={<ProtectedRoute><MyDocuments /></ProtectedRoute>} />

//       {/* Admin only */}
//       <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

//       {/* ✅ Dashboard — nested routes */}
//       <Route path="/dashboard" element={<CompanyRoute><DashboardPage /></CompanyRoute>}>
//         <Route path="add-employee"       element={<AddEmployee />} />
//         <Route path="offer-letter"       element={<OfferLetterPage />} />
//         <Route path="offer-confirmation" element={<OfferConfirmationPage />} />
//         <Route path="pay-slip"           element={<PaySlipPage />} />
//         <Route path="salary-appraisal"   element={<AppraisalPage />} />
//         <Route path="relieving-letter"   element={<RelievingLetterPage />} />
//         <Route path="experience-letter"  element={<ExperienceLetterPage />} />
//         <Route path="resignation-acceptance" element={<ResignationAcceptance_SoftGrid />} />
//       </Route>

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/login" replace />} />
//     </Routes>
//   )
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </AuthProvider>
//   )
// }

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import ForgotPassword from './pages/ForgotPassword'
import CompaniesPage from './pages/CompaniesPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import AdminPage from './pages/AdminPage'
import ExperienceLetterPage_SoftGrid from './pages/ExperienceLetter_SoftGrid'
import ExperienceLetterPage_UASIT    from './pages/ExperienceLetter_UASIT'
import ResignationAcceptance_SoftGrid from './pages/ResignationAcceptance_SoftGrid'
import ResignationAcceptance_UASIT    from './pages/ResignationAcceptance_UASIT'
import MyDocuments from './pages/MyDocuments'
import AddEmployee from './pages/AddEmployee'

// ── Company-wise Offer Letter pages ──────────────────────────────────────
import OfferLetterPage_SoftGrid      from './pages/OfferLetterPage_SoftGrid'
import OfferLetterPage_UASIT         from './pages/OfferLetterPage_UASIT'

// ── Company-wise Offer Confirmation pages ────────────────────────────────
import OfferConfirmationPage_SoftGrid    from './pages/OfferConfirmationPage_SoftGrid'
import OfferConfirmationPage_UASIT       from './pages/OfferConfirmationPage_UASIT'

// ── Company-wise Pay Slip pages ──────────────────────────────────────────
import PaySlipPage_SoftGrid     from './pages/PaySlip_SoftGrid'
import PaySlipPage_UASIT        from './pages/PaySlip_UASIT'

// ── Company-wise Salary Appraisal pages ─────────────────────────────────
import AppraisalLetter_SoftGrid     from './pages/AppraisalLetter_softgrid'
import AppraisalLetter_UASIT        from './pages/appraisalLetter_uasit'

// ── Company-wise Relieving Letter pages ──────────────────────────────────
import RelievingLetter_SoftGrid     from './pages/RelievingLetter_SoftGrid'
import RelievingLetter_UASIT        from './pages/RelievingLetter_UASIT'

// ── Switcher — Offer Letter ───────────────────────────────────────────────
function OfferLetterPage() {
  const { selectedCompany } = useAuth()
  switch (selectedCompany?.id) {
    case 1:  return <OfferLetterPage_SoftGrid />
    case 2:  return <OfferLetterPage_UASIT />
    default: return <OfferLetterPage_SoftGrid />
  }
}

// ── Switcher — Offer Confirmation ────────────────────────────────────────
function OfferConfirmationPage() {
  const { selectedCompany } = useAuth()
  switch (selectedCompany?.id) {
    case 1:  return <OfferConfirmationPage_SoftGrid />
    case 2:  return <OfferConfirmationPage_UASIT />
    default: return <OfferConfirmationPage_SoftGrid />
  }
}

// ── Switcher — Pay Slip ───────────────────────────────────────────────────
function PaySlipPage() {
  const { selectedCompany } = useAuth()
  switch (selectedCompany?.id) {
    case 1:  return <PaySlipPage_SoftGrid />
    case 2:  return <PaySlipPage_UASIT />
    default: return <PaySlipPage_SoftGrid />
  }
}

// ── Switcher — Salary Appraisal ───────────────────────────────────────────
function AppraisalPage() {
  const { selectedCompany } = useAuth()
  switch (selectedCompany?.id) {
    case 1:  return <AppraisalLetter_SoftGrid />
    case 2:  return <AppraisalLetter_UASIT />
    default: return <AppraisalLetter_SoftGrid />
  }
}

// ── Switcher — Relieving Letter ───────────────────────────────────────────
function RelievingLetterPage() {
  const { selectedCompany } = useAuth()
  switch (selectedCompany?.id) {
    case 1:  return <RelievingLetter_SoftGrid />
    case 2:  return <RelievingLetter_UASIT />
    default: return <RelievingLetter_SoftGrid />
  }
}

// ── Switcher — Experience Letter ──────────────────────────────────────────
function ExperienceLetterPage() {
  const { selectedCompany } = useAuth()
  switch (selectedCompany?.id) {
    case 1:  return <ExperienceLetterPage_SoftGrid />
    case 2:  return <ExperienceLetterPage_UASIT />
    default: return <ExperienceLetterPage_SoftGrid />
  }
}

// ── Switcher — Resignation Acceptance ────────────────────────────────────
function ResignationAcceptancePage() {
  const { selectedCompany } = useAuth()
  switch (selectedCompany?.id) {
    case 1:  return <ResignationAcceptance_SoftGrid />
    case 2:  return <ResignationAcceptance_UASIT />
    default: return <ResignationAcceptance_SoftGrid />
  }
}

// ── 🔐 Protected Route ────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

// ── 🔑 Admin Route ────────────────────────────────────────────────────────
function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/companies" replace />
  return children
}

// ── 🏢 Company Route ──────────────────────────────────────────────────────
function CompanyRoute({ children }) {
  const { user, selectedCompany } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!selectedCompany) return <Navigate to="/companies" replace />
  return children
}

// ── 🚫 Public Route ───────────────────────────────────────────────────────
function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/companies" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public */}
      <Route path="/login"           element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password"  element={<ForgotPassword />} />

      {/* Protected */}
      <Route path="/companies"    element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
      <Route path="/users"        element={<AdminRoute><UsersPage /></AdminRoute>} />
      <Route path="/my-documents" element={<ProtectedRoute><MyDocuments /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

      {/* ✅ Dashboard — nested routes */}
      <Route path="/dashboard" element={<CompanyRoute><DashboardPage /></CompanyRoute>}>
        <Route path="add-employee"       element={<AddEmployee />} />
        <Route path="offer-letter"       element={<OfferLetterPage />} />
        <Route path="offer-confirmation" element={<OfferConfirmationPage />} />
        <Route path="pay-slip"           element={<PaySlipPage />} />
        <Route path="salary-appraisal"   element={<AppraisalPage />} />
        <Route path="relieving-letter"   element={<RelievingLetterPage />} />
        <Route path="experience-letter"  element={<ExperienceLetterPage />} />
        <Route path="resignation-acceptance" element={<ResignationAcceptancePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}