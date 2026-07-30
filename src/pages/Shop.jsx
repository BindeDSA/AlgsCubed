import { ShoppingCart } from 'lucide-react';

const products = [
  { id: 1, name: "MoYu RS3 M 2020", price: "$8.99", desc: "Best budget magnetic cube", color: "var(--cyber-blue)" },
  { id: 2, name: "GAN 11 M Pro", price: "$59.99", desc: "Premium flagship speedcube", color: "var(--neon-green)" },
  { id: 3, name: "X-Man Tornado V3", price: "$24.99", desc: "Smooth and highly customizable", color: "var(--crimson-red)" },
  { id: 4, name: "QiYi Valk 3 Elite", price: "$45.99", desc: "Stable and reliable competition cube", color: "var(--sun-yellow)" },
];

function Shop() {
  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '3rem' }}>The Cube Shop</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        {products.map(product => (
          <div key={product.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', background: `linear-gradient(45deg, ${product.color}22, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {/* Placeholder for actual image */}
               <div style={{ width: '100px', height: '100px', border: `2px solid ${product.color}`, borderRadius: '12px', transform: 'rotate(45deg)' }}></div>
            </div>
            <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
              <p style={{ color: 'var(--text-color)', marginBottom: '1.5rem', flexGrow: 1 }}>{product.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: product.color }}>{product.price}</span>
                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  <ShoppingCart size={16} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
