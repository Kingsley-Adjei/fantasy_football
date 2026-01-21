import { Redirect } from "expo-router";

export default function TabIndex() {
  // For now, let's redirect to create-team by default.
  // Later, we can add logic here to check if the user already has a team.
  return <Redirect href="/create-team" />;
}
