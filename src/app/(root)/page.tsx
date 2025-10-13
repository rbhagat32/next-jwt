import { getLoggedInUser } from "@/actions/user";
import { LogoutButton } from "@/components/custom/logout-button";

export default async function Root() {
  const user = await getLoggedInUser();

  return (
    <div>
      <h1>id: {user.id}</h1>
      <h1>username: {user.username}</h1>
      <h1>email: {user.email}</h1>
      <h1>password: {user.password}</h1>
      <h1>avatar: {user.avatar}</h1>
      <h1>createdAt: {user.createdAt.toString()}</h1>
      <h1>updatedAt: {user.updatedAt.toString()}</h1>
      <LogoutButton />
    </div>
  );
}
