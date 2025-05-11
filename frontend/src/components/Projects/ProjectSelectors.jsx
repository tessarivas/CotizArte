
// 2. Componentes de selectores para tipos, técnicas y clientes
export const ProjectSelectors = ({ 
  selectedArtType, 
  setSelectedArtType, 
  selectedTechnique, 
  setSelectedTechnique,
  selectedClient, 
  setSelectedClient,
  artTypes,
  techniques,
  clients
}) => {
  return (
    <>
      <label className="block text-sm font-bold mb-2">Tipo de Arte:</label>
      <select
        value={selectedArtType}
        onChange={(e) => setSelectedArtType(e.target.value)}
        required
        className="select select-bordered w-full mb-3"
      >
        <option value="">Selecciona un tipo de arte</option>
        {artTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      
      <label className="block text-sm font-bold mb-2">Técnica (opcional):</label>
      <select
        value={selectedTechnique}
        onChange={(e) => setSelectedTechnique(e.target.value)}
        className="select select-bordered w-full mb-3"
      >
        <option value="">Selecciona una técnica</option>
        {techniques.map((tech) => (
          <option key={tech.id} value={tech.id}>
            {tech.name}
          </option>
        ))}
      </select>
      
      <label className="block text-sm font-bold mb-2">Cliente (opcional):</label>
      <select
        value={selectedClient}
        onChange={(e) => setSelectedClient(e.target.value)}
        className="select select-bordered w-full mb-3"
      >
        <option value="">Selecciona un cliente</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
    </>
  );
};
