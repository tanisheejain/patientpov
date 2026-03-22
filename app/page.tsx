import { redirect } from "next/navigation";

export default function Home() {
  redirect("/intro?next=%2Ftherapist%2Fauth");
}
