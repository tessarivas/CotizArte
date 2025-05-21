import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileTextIcon, // Cotización
  SquarePenIcon, // Crear Proyecto
  UsersIcon, // Clientes
  PaintbrushIcon, // Materiales
  CircleDollarSignIcon // Perfiles de Precios
} from "lucide-react";

const ActionCards = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Crear Proyecto",
      subtitle: "Inicia un nuevo proyecto artístico",
      href: "/create-project",
      Icon: SquarePenIcon,
      gradient: "from-teal-300 to-teal-500",
      hoverColor: "text-teal-300",
    },
    {
      title: "Realizar una Cotización",
      subtitle: "Calcula el costo de una obra",
      href: "/quotes",
      Icon: FileTextIcon,
      gradient: "from-pink-300 to-pink-500",
      hoverColor: "text-pink-300",
    },
    {
      title: "Administrar Clientes",
      subtitle: "Gestiona tus clientes y encargos",
      href: "/clients",
      Icon: UsersIcon,
      gradient: "from-orange-300 to-orange-500",
      hoverColor: "text-orange-300",
    },
    {
      title: "Guardar Materiales",
      subtitle: "Registra tus herramientas y materiales",
      href: "/materials",
      Icon: PaintbrushIcon,
      gradient: "from-purple-300 to-purple-500",
      hoverColor: "text-purple-300",
    },
    {
      title: "Perfiles de Precios",
      subtitle: "Define tarifas y ajustes de cotización",
      href: "/pricing-profile",
      Icon: CircleDollarSignIcon,
      gradient: "from-gray-500 to-gray-700",
      hoverColor: "text-gray-300",
    },
  ];

  return (
    <div className="p-4 mt-8">
      <div className="grid gap-8 grid-cols-2 lg:grid-cols-5">
        {cards.map(({ title, subtitle, Icon, href, gradient, hoverColor }, i) => (
          <Card
            key={i}
            title={title}
            subtitle={subtitle}
            Icon={Icon}
            href={href}
            gradient={gradient}
            hoverColor={hoverColor}
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, Icon, href, gradient, hoverColor }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(href)}
      className="w-full p-4 rounded-xl border-[3px] border-[#fff7fb] relative overflow-hidden group bg-white cursor-pointer shadow-lg transition-transform hover:scale-105"
    >
      {/* Fondo degradado animado */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300`} />

      {/* Contenido */}
      <div className="relative z-10">
        <Icon className={`absolute z-0 -top-8 left-52 size-22 opacity-40 rotate-5 ${hoverColor} group-hover:text-white group-hover:rotate-15 transition-all duration-300`} />
        <Icon className={`mb-2 size-10 ${hoverColor} group-hover:text-white transition-colors duration-300`} />
        <h3 className="mt-5 font-medium text-xl text-slate-950 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="-mt-0.5 text-slate-400 group-hover:text-white transition-colors duration-300">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default ActionCards;


