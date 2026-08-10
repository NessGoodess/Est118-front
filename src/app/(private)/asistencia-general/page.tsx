import { redirect } from "next/navigation";

/** Legacy Spanish route → English path */
export default function AsistenciaGeneralRedirect() {
  redirect("/general-attendance");
}
