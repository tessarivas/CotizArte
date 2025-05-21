// src/components/Quotes/CommonQuoteFields.jsx
import React from "react";
import { FileCheck2Icon } from "lucide-react";

export const CommonQuoteFields = ({
  data,
  handleChange,
  pricingProfiles,
  selectedPricingProfile,
  setSelectedPricingProfile,
  clients = [],
  selectedClient,
  setSelectedClient,
  projectHasClient,
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl font-regular-text">
      <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
        <FileCheck2Icon className="w-5 h-5 text-orange-400" />
        Detalles de la Cotización
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Columna 1: Cliente y Perfil de Precios */}
        <div>
          {/* Selector de cliente solo si el proyecto no tiene uno */}
          {!projectHasClient && (
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Asignar Cliente:
              </label>
              <select
                value={selectedClient ? selectedClient.id : ""}
                onChange={(e) => {
                  const client = clients.find(
                    (c) => c.id === Number(e.target.value)
                  );
                  setSelectedClient(client);
                }}
                className="select select-bordered w-full"
              >
                <option value="">Selecciona un cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-2">
            <label className="block text-sm font-bold mb-2">
              Perfil de Precios
            </label>
            <select
              name="pricingProfileId"
              value={selectedPricingProfile ? selectedPricingProfile.id : ""}
              onChange={(e) => {
                const profileId = Number(e.target.value);
                const profile = pricingProfiles.find((p) => p.id === profileId);
                setSelectedPricingProfile(profile);
              }}
              required
              className="select select-bordered w-full"
            >
              <option value="">
                Seleccione un perfil con tárifas preajustadas
              </option>
              {pricingProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.artType?.name}: Tarifa x Hora{" "}
                  {profile.standardHourlyRate} - Proyectos x Mes{" "}
                  {profile.projectsPerMonth}
                </option>
              ))}
            </select>
            <div className="text-xs pt-3 pl-1 italic text-[#a4a4a4]">
              <p>
                Si aún no has agregado un perfil de precios personalizado accede
                a tu panel y crea un nuevo perfil de precios para el tipo de
                arte que necesites.
              </p>
            </div>
          </div>
        </div>
        {/* Columna 2: Descuento y Notas */}
        <div>
          <label className="block text-sm font-bold mb-2">Descuento (%):</label>
          <input
            name="discountPercentage"
            type="number"
            min="0"
            max="100"
            value={data.discountPercentage}
            onChange={handleChange}
            className="input input-bordered w-full mb-3"
          />
          <label className="block text-sm font-bold mb-2">Notas:</label>
          <textarea
            name="notes"
            value={data.notes}
            onChange={handleChange}
            className="textarea textarea-bordered w-full mb-2 h-12"
            placeholder="Agrega comentarios o especificaciones..."
          />
        </div>
      </div>
    </div>
  );
};
