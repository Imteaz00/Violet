import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect, RedirectType } from "next/navigation";

export default async function checkAdmin() {
  const user = await currentUser();

  if (!user) {
    redirect("/", RedirectType.replace);
  }

  if (!(user.publicMetadata?.role === "admin")) {
    redirect("/", RedirectType.replace);
  }
}
