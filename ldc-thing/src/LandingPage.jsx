function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      textAlign: 'center', // center text inside elements
    }}>
      <h1>LEGO Scavenger Hunt</h1>
      <p>Select your hunt and start finding minifigures!</p>
      <button onClick={() => navigate('/select')} style={{ marginTop: '20px' }}>
        Start!
      </button>
    </div>
  );
}