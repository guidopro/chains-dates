import { useAuth } from "../hooks/useAuth";

export default function WelcomeUser() {
  const { user } = useAuth();
  return (
    <>
      {user ? (
        <p>Welcome {user.displayName}</p>
      ) : (
        <p>Welcome to Chains & Discs</p>
      )}
    </>
  );
}
