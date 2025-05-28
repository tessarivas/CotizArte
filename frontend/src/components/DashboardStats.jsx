import React, { useState, useEffect } from "react";
import {
  FileTextIcon,
  CheckCircleIcon,
  FolderIcon,
  DollarSignIcon,
  TrendingUpIcon,
  ClockIcon,
  UsersIcon,
  BarChart3Icon,
} from "lucide-react";
import api from "@/api/axios";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    approvedQuotes: 0,
    totalProjects: 0,
    totalClients: 0,
    totalRevenue: 0,
    thisMonthQuotes: 0,
    avgProjectValue: 0,
    totalHoursWorked: 0,
    mostUsedArtType: "N/A",
    pendingQuotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("access_token");

      // Hacer múltiples llamadas para obtener toda la información
      const [quotesRes, projectsRes, clientsRes] = await Promise.all([
        api.get("/quotes", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/projects", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/clients", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const quotes = quotesRes.data;
      const projects = projectsRes.data;
      const clients = clientsRes.data;

      console.log("📊 Datos recibidos:", { quotes, projects, clients });

      // ✅ CORREGIR: usar los estados en MAYÚSCULAS como están en la BD
      const approvedQuotes = quotes.filter((q) => q.status === "APPROVED");
      const pendingQuotes = quotes.filter((q) => q.status === "PENDING");
      const rejectedQuotes = quotes.filter((q) => q.status === "REJECTED");
      
      console.log("✅ Cotizaciones filtradas:", {
        total: quotes.length,
        approved: approvedQuotes.length,
        pending: pendingQuotes.length,
        rejected: rejectedQuotes.length,
        allStatuses: quotes.map((q) => q.status), // Para debug
      });

      // ✅ CORREGIR: usar el campo correcto para el monto final
      // Según los datos, parece que el campo es 'finalPriceAfterDiscount'
      const totalRevenue = approvedQuotes.reduce((sum, q) => {
        const amount = Number(q.finalPriceAfterDiscount) || Number(q.finalPrice) || 0;
        console.log(`Cotización ${q.id}: $${amount}`);
        return sum + amount;
      }, 0);

      console.log("💰 Ingresos totales calculados:", totalRevenue);

      // Cotizaciones de este mes
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthQuotes = quotes.filter((q) => {
        const quoteDate = new Date(q.createdAt);
        return (
          quoteDate.getMonth() === currentMonth &&
          quoteDate.getFullYear() === currentYear
        );
      }).length;

      console.log("📅 Cotizaciones este mes:", thisMonthQuotes);

      // Promedio por proyecto
      const avgProjectValue =
        approvedQuotes.length > 0 ? totalRevenue / approvedQuotes.length : 0;

      console.log("📊 Promedio por proyecto:", avgProjectValue);

      // Total de horas trabajadas
      const totalHoursWorked = projects.reduce((sum, p) => {
        const hours = Number(p.hoursWorked) || 0;
        return sum + hours;
      }, 0);

      // Tipo de arte más usado
      const artTypeCounts = {};
      projects.forEach((p) => {
        const artType = p.artType?.name || "Sin especificar";
        artTypeCounts[artType] = (artTypeCounts[artType] || 0) + 1;
      });

      const mostUsedArtType =
        Object.keys(artTypeCounts).length > 0
          ? Object.keys(artTypeCounts).reduce((a, b) =>
              artTypeCounts[a] > artTypeCounts[b] ? a : b
            )
          : "N/A";

      console.log("🎨 Conteo por tipo de arte:", artTypeCounts);
      console.log("🏆 Tipo más usado:", mostUsedArtType);

      const finalStats = {
        totalQuotes: quotes.length,
        approvedQuotes: approvedQuotes.length,
        totalProjects: projects.length,
        totalClients: clients.length,
        totalRevenue,
        thisMonthQuotes,
        avgProjectValue,
        totalHoursWorked,
        mostUsedArtType,
        pendingQuotes: pendingQuotes.length,
        rejectedQuotes: rejectedQuotes.length, // ✅ Agregar rechazadas también
      };

      console.log("📈 Stats finales:", finalStats);
      setStats(finalStats);

    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateApprovalRate = () => {
    if (stats.totalQuotes === 0) return 0;
    return ((stats.approvedQuotes / stats.totalQuotes) * 100).toFixed(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="stat bg-gray-200 animate-pulse rounded-lg h-32"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90vw] max-w-7xl mx-auto px-6 py-10 font-regular-text">
      {/* Título de la sección */}
      <div className="mb-8 text-center">
        <GradientText className="text-6xl font-logo-text">
          Resumen de Actividad
        </GradientText>
        <p className="text-neutral font-bold underline decoration-3 decoration-primary">
          Un vistazo rápido a tus actividades y estadísticas importantes
        </p>
      </div>

      {/* Stats Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Cotizaciones */}
        <div className="stat bg-white shadow-lg rounded-lg border border-gray-100 transition-shadow">
          <div className="stat-figure text-blue-500">
            <FileTextIcon className="h-8 w-8" />
          </div>
          <div className="stat-title text-gray-600">Total Cotizaciones</div>
          <div className="stat-value text-blue-600">{stats.totalQuotes}</div>
          <div className="stat-desc text-gray-500">
            {stats.thisMonthQuotes} este mes
          </div>
        </div>

        {/* Cotizaciones Aprobadas */}
        <div className="stat bg-white shadow-lg rounded-lg border border-gray-100 transition-shadow">
          <div className="stat-figure text-green-500">
            <CheckCircleIcon className="h-8 w-8" />
          </div>
          <div className="stat-title text-gray-600">Cotizaciones Aprobadas</div>
          <div className="stat-value text-green-600">
            {stats.approvedQuotes}
          </div>
          <div className="stat-desc text-green-600">
            {calculateApprovalRate()}% tasa de aprobación
          </div>
        </div>

        {/* Total de Proyectos */}
        <div className="stat bg-white shadow-lg rounded-lg border border-gray-100 transition-shadow">
          <div className="stat-figure text-purple-500">
            <FolderIcon className="h-8 w-8" />
          </div>
          <div className="stat-title text-gray-600">Proyectos Creados</div>
          <div className="stat-value text-purple-600">
            {stats.totalProjects}
          </div>
          <div className="stat-desc text-gray-500">
            Tipo favorito: {stats.mostUsedArtType}
          </div>
        </div>

        {/* Total de Clientes */}
        <div className="stat bg-white shadow-lg rounded-lg border border-gray-100 transition-shadow">
          <div className="stat-figure text-pink-500">
            <UsersIcon className="h-8 w-8" />
          </div>
          <div className="stat-title text-gray-600">Clientes Registrados</div>
          <div className="stat-value text-pink-600">{stats.totalClients}</div>
          <div className="stat-desc text-gray-500">Base de clientes</div>
        </div>
      </div>

      {/* Stats Financieras y de Productividad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Ingresos Totales */}
        <div className="stat bg-gradient-to-br from-green-50 to-green-100 shadow-lg rounded-lg border border-green-200">
          <div className="stat-figure text-green-600">
            <DollarSignIcon className="h-10 w-10" />
          </div>
          <div className="stat-title text-green-700">Ingresos Totales</div>
          <div className="stat-value text-green-800 text-2xl">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div className="stat-desc text-green-600">
            De cotizaciones aprobadas
          </div>
        </div>

        {/* Promedio por Proyecto */}
        <div className="stat bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg border border-blue-200">
          <div className="stat-figure text-blue-600">
            <TrendingUpIcon className="h-10 w-10" />
          </div>
          <div className="stat-title text-blue-700">Promedio por Proyecto</div>
          <div className="stat-value text-blue-800 text-2xl">
            {formatCurrency(stats.avgProjectValue)}
          </div>
          <div className="stat-desc text-blue-600">
            Valor medio de cotizaciones
          </div>
        </div>

        {/* Horas Trabajadas */}
        <div className="stat bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg rounded-lg border border-orange-200">
          <div className="stat-figure text-orange-600">
            <ClockIcon className="h-10 w-10" />
          </div>
          <div className="stat-title text-orange-600">Horas Trabajadas</div>
          <div className="stat-value text-orange-700 text-2xl">
            {stats.totalHoursWorked}h
          </div>
          <div className="stat-desc text-orange-600">
            En todos tus proyectos
          </div>
        </div>
      </div>
    </div>
  );
}
