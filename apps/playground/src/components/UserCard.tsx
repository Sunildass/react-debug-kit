interface UserCardProps {
  name: string;
  role: string;
  avatar: string;
}

export function UserCard({ name, role, avatar }: UserCardProps) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    }}>
      <span style={{ fontSize: "40px" }}>{avatar}</span>
      <div>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#1a1a2e" }}>{name}</h3>
        <p style={{ margin: 0, fontSize: "13px", color: "#6c6c8a" }}>{role}</p>
      </div>
    </div>
  );
}
