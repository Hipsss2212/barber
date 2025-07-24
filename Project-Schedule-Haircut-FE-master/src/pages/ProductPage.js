import React, { useState } from 'react';
import products from '../services/products';
import Header from '../components/Header';
import Footer from '../components/Footer';

const getUniqueCategories = (products) => {
  const cats = products.map(p => p.category);
  return ['Tất cả', ...Array.from(new Set(cats))];
};

const ProductPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [sort, setSort] = useState('asc');

  const categories = getUniqueCategories(products);

  // Lọc sản phẩm theo tên và danh mục
  let filteredProducts = products.filter(product =>
    (category === 'Tất cả' || product.category === category) &&
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sắp xếp theo giá
  filteredProducts = filteredProducts.sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);

  return (
    <>
      <Header />
      <div className="product-page-container" style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32, color: '#15397F', letterSpacing: 1, fontSize: 32, fontWeight: 700 }}>Sản phẩm Haircut</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: 12, width: 220, borderRadius: 12, border: '1.5px solid #15397F', fontSize: 17, outline: 'none', boxShadow: '0 1px 4px rgba(21,57,127,0.07)' }}
          />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: 12, borderRadius: 12, border: '1.5px solid #15397F', fontSize: 16 }}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: 12, borderRadius: 12, border: '1.5px solid #15397F', fontSize: 16 }}>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
          {filteredProducts.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: 18 }}>Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            filteredProducts.map(product => (
              <div
                key={product.id}
                style={{
                  border: '1.5px solid #e3e8f0',
                  borderRadius: 16,
                  padding: 20,
                  background: 'linear-gradient(135deg, #f8fafc 60%, #e3e8f0 100%)',
                  boxShadow: '0 4px 16px rgba(21,57,127,0.07)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  cursor: 'pointer',
                  minHeight: 380,
                  position: 'relative',
                }}
                onClick={() => window.open(product.linkShopee, '_blank')}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 18, boxShadow: '0 2px 8px rgba(21,57,127,0.08)' }}
                />
                <h2 style={{ fontSize: 19, fontWeight: 700, color: '#15397F', marginBottom: 10, textAlign: 'center', minHeight: 48 }}>{product.name}</h2>
                <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 6 }}>{product.category}</div>
                <p style={{ color: '#e53935', fontWeight: 600, fontSize: 17, marginBottom: 10 }}>{product.price.toLocaleString()} đ</p>
                <button
                  style={{
                    background: 'linear-gradient(90deg, #15397F 60%, #1e88e5 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 28px',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: 12,
                    boxShadow: '0 2px 8px rgba(21,57,127,0.10)',
                    transition: 'background 0.2s',
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    window.open(product.linkShopee, '_blank');
                  }}
                >Mua trên Shopee</button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage; 