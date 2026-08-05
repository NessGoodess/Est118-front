import { ReactNode, Suspense } from "react";

/** Layout de /users con slot paralelo para intercepting modals (create / ver / edit / password). */
export default function UsersLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {children}
      <Suspense fallback={null}>{modal}</Suspense>
    </>
  );
}
