const VisualCard = ({ image, title, description, className = "" }) => {
  return (
    <div className={`visual-card ${className}`}>
      <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
      {(title || description) && (
        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl">
          {title && <p className="font-black text-white">{title}</p>}
          {description && <p className="mt-1 text-xs leading-5 text-white/75">{description}</p>}
        </div>
      )}
    </div>
  );
};

export default VisualCard;
