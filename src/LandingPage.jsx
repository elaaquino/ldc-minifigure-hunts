import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="title-page">
      <h1>LEGO Scavenger Hunt test</h1>
      <p>Select your hunt and start finding minifigures!</p>
      <button onClick={() => navigate('/select')}>
        Start!
      </button>
    </div>
  );
}