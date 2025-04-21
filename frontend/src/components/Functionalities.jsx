import CircularGallery from '@/blocks/Components/CircularGallery/CircularGallery';

export const Functionalities = () => {
  return (
    <>
      <div style={{ height: "600px", position: "relative" }}>
        <CircularGallery bend={3} textColor="#000" borderRadius={0.05} />
      </div>
    </>
  );
};

export default Functionalities;

/* 
<div className="text-center mb-12">
    <h1 className="font-bold font-serif text-4xl md:text-5xl lg:text-7xl inline-block">
        <AuroraText>Funcionalidades</AuroraText>
    </h1>
</div> 
*/
