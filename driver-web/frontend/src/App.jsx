export default function App() {
  return (
    <div>
      {/* Test current CSS variables */}
      <div style={{ color: 'var(--accent)', fontSize: '24px', marginBottom: '20px' }}>
        ✓ Current CSS variables are working if this is purple
      </div>
      
      {/* Test if Tailwind is available */}
      <div className="text-red-500 font-bold">
        If this text is red and bold → Tailwind CSS is working
      </div>
      <div className="text-blue-500">
        If this text is blue → Tailwind CSS is working
      </div>
      
      {/* Fallback test */}
      <div style={{ color: 'blue', fontWeight: 'bold', marginTop: '20px' }}>
        If you see this blue text → At least inline styles work
      </div>
    </div>
  );
}