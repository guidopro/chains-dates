export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "1rem",
        backgroundColor: "#333",
        color: "#fff",
        fontSize: "0.9rem",
        marginTop: "100px",
      }}
    >
      &copy; {year} Chains & Dates. All rights reserved.
    </footer>
  );
}
