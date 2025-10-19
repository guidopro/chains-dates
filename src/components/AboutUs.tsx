export default function AboutUs() {
  const containerStyle: React.CSSProperties = {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#211038",
    borderRadius: "10px",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "20px",
    color: "#f0f0f0",
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: "1rem",
    lineHeight: 1.6,
    marginBottom: "15px",
    color: "#ddd",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>About Us</h2>
      <p style={paragraphStyle}>
        Welcome to Chains & Dates, a disc golf community built for players who
        love the game and the connections it creates. Based around the beautiful
        Longford Park Disc Golf Course in Manchester, our platform brings local
        players together through events, tournaments, and friendly competitions.
        Whether you're a first-time thrower or a seasoned pro, Chains & Dates
        gives you an easy way to discover upcoming events, sign up to play, and
        stay connected with others who share your passion for disc golf.
      </p>
      <p style={paragraphStyle}>
        At its heart, Chains & Dates is more than just an events platform - it’s
        a growing community of people who enjoy the outdoors, friendly
        competition, and a good laugh on the fairway. We’re here to make it
        easier for disc golfers to find games and be part
        of something local and welcoming.
      </p>
    </div>
  );
}
