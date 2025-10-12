import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export async function requestCalendarAccess() {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/calendar.events");

  // Use `prompt: 'consent'` to force Google to show the permission screen again
  provider.setCustomParameters({ prompt: "consent" });

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const accessToken = credential.accessToken;

  console.log("Calendar access token:", accessToken);
  return accessToken;
}
