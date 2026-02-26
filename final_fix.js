const fs = require('fs');
const path = 'pages/ProductDetail.tsx';
let content = fs.readFileSync(path, 'utf8');

const premiumCards = `                <div className="flex gap-4 overflow-x-auto pb-16 no-scrollbar snap-x">
                   {products.filter(p => p.id !== id).slice(0, 10).map((p) => (
                      <div 
                         key={p.id} 
                         onClick={() => navigate(\`/products/\${p.id}\`)}
                         className="min-w-[200px] md:min-w-[260px] snap-start bg-white border border-transparent rounded-[2.5rem] overflow-hidden hover:shadow-[0_40px_80px_-15px_rgba(112,56,252,0.25)] hover:border-fario-purple/20 transition-all duration-700 cursor-pointer group flex flex-col flex-shrink-0 relative"
                      >
                         <div className="relative aspect-[4/5] bg-[#f9f9fb] overflow-hidden flex items-center justify-center group-hover:bg-[#f2f0ff] transition-all duration-700">
                            <img 
                               src={p.image} 
                               className="w-full h-full object-contain mix-blend-multiply p-8 group-hover:scale-110 transition-transform duration-1000 ease-out" 
                               alt={p.name}
                               referrerPolicy="no-referrer"
                               onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=FARIO'; }}
                            />
                            {p.originalPrice && (
                               <div className="absolute top-4 left-4 bg-fario-purple text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] rounded-full shadow-[0_8px_20px_rgba(112,56,252,0.4)] z-10 border border-white/20 backdrop-blur-md">
                                  Sale
                               </div>
                            )}
                            {p.colors && p.colors.length > 1 && (
                               <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[9px] font-black text-gray-500 uppercase border border-gray-100 shadow-sm z-10 transition-all group-hover:bottom-6">
                                  +{p.colors.length - 1} other colors
                               </div>
                            )}
                         </div>

                         <div className="p-5 flex flex-col flex-grow bg-white">
                            <div className="flex items-center justify-between mb-3">
                               <span className="text-[11px] font-black text-fario-purple/70 uppercase tracking-[0.2em]">{p.category || 'Shoes'}</span>
                               <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">In Stock</span>
                               </div>
                            </div>

                            <h4 className="text-base md:text-lg font-black text-gray-900 group-hover:text-fario-purple transition-all duration-300 leading-tight mb-1 italic tracking-tighter">{p.name}</h4>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide line-clamp-1 mb-4">{p.tagline || 'Urban Performance'}</p>

                            <div className="flex items-center justify-between mb-4 py-2 border-y border-gray-50">
                               <div className="flex items-center gap-1">
                                  <div className="flex text-yellow-400">
                                     <Star size={11} fill="currentColor" />
                                  </div>
                                  <span className="text-[11px] font-black text-gray-900 ml-1">{p.rating || '4.6'}</span>
                                  <span className="text-[10px] text-gray-400 font-bold">({(p.reviewsCount || 0)})</span>
                               </div>
                               <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase opacity-60">5K+ bought</span>
                            </div>

                            <div className="mt-auto">
                               <div className="flex items-baseline gap-2 mb-1">
                                  <span className="text-xl font-black text-gray-900 tracking-tighter italic">Rs. {p.price.toLocaleString()}</span>
                                  {p.originalPrice && (
                                     <span className="text-[11px] text-gray-300 line-through font-bold">Rs. {p.originalPrice.toLocaleString()}</span>
                                  )}
                               </div>
                               {p.originalPrice && (
                                  <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1">
                                     <span>({Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% off)</span>
                                     <div className="w-1 h-1 rounded-full bg-rose-600 animate-ping" />
                                  </div>
                                )}
                            </div>
                         </div>
                      </div>
                   ))}
                   {products.filter(p => p.id !== id).length === 0 && (
                      <div className="text-sm text-gray-400 font-medium py-12 flex flex-col items-center gap-4 w-full">
                         <div className="w-8 h-8 border-2 border-fario-purple border-t-transparent rounded-full animate-spin"></div>
                         <p className="uppercase tracking-widest font-black text-[10px]">Syncing Depot...</p>
                      </div>
                   )}
                </div>`;

const searchStr = '<div className="flex gap-6 overflow-x-auto pb-12 no-scrollbar snap-x">';
const startIdx = content.indexOf(searchStr);

if (startIdx !== -1) {
    // Find matching closing div
    let open = 0;
    let endIdx = -1;
    for (let i = startIdx; i < content.length; i++) {
        if (content.substring(i, i + 4) === '<div') open++;
        if (content.substring(i, i + 6) === '</div>') {
            open--;
            if (open === 0) {
                endIdx = i + 6;
                break;
            }
        }
    }

    if (endIdx !== -1) {
        const newContent = content.substring(0, startIdx) + premiumCards + content.substring(endIdx);
        fs.writeFileSync(path, newContent, 'utf8');
        console.log('SUCCESS: Recommended cards updated to premium style');
    } else {
        console.log('Error: Could not find closing div');
    }
} else {
    console.log('Error: Could not find start of recommendations div');
}
